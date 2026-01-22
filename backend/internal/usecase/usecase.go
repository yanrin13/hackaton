// Package usecase implements business logic for order operations.
// It orchestrates interactions between repository, cache and message broker.
package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"hack/internal/lib/validator"
	"hack/internal/models"
)

type StatementRepository interface {
	NewStatement(statements []models.Statement) error
	GetStatement(statementID int) (models.Statement, error)
	GetAllStatements(ctx context.Context) ([]models.Statement, error)
	GetCategoriesAnalitic(ctx context.Context) (map[string]int, error)
}

type CacheRepository interface {
	GetStatement(ctx context.Context, statementUID int) ([]byte, error)
	SetStatement(ctx context.Context, statementUID int, data []byte, ttl time.Duration) error
	DeleteStatement(ctx context.Context, statementUID int) error
}

// MessageBroker defines methods for sending messages to Kafka.
type MessageBroker interface {
	Send(ctx context.Context, key string, value []byte) error
	Close() error
}

// StatementUseCase contains dependencies and implements order-related use cases.
type StatementUseCase struct {
	statementRepo StatementRepository
	cacheRepo     CacheRepository
	messageBroker MessageBroker
}

// NewStatementUseCase creates a new instance of StatementUseCase with required dependencies.
func NewStatementUseCase(statementRepo StatementRepository, cacheRepo CacheRepository, messageBroker MessageBroker) *StatementUseCase {
	return &StatementUseCase{
		statementRepo: statementRepo,
		cacheRepo:     cacheRepo,
		messageBroker: messageBroker,
	}
}

// CreateOrder validates the order and sends it to Kafka for asynchronous processing.
// It does not wait for persistence — that's handled by the consumer.
func (uc *StatementUseCase) CreateStatement(ctx context.Context, statements []models.Statement) error {
	const op = "usecase.CreateStatement"

	for _, statement := range statements {
		if err := validator.ValidateStatement(&statement); err != nil {
			return fmt.Errorf("%s: validator: %w", op, err)
		}
	}
	statementJSON, err := json.Marshal(statements)
	if err != nil {
		return fmt.Errorf("%s: json marshal err: %w", op, err)
	}
	if len(statements) == 1 {
		key := strconv.Itoa(statements[0].StatementUID)

		if err := uc.messageBroker.Send(ctx, key, statementJSON); err != nil {

		}
	}

	if err := uc.statementRepo.NewStatement(statements); err != nil {
		return fmt.Errorf("%s: failed to save statement to repository: %w", op, err)
	}

	return nil
}

// GetOrder retrieves an order by UID, first checking cache, then database.
// On successful DB fetch, it updates the cache.
func (uc *StatementUseCase) GetStatement(ctx context.Context, statementUID int) (models.Statement, error) {
	const op = "usecase.GetStatement"

	cached, err := uc.cacheRepo.GetStatement(ctx, statementUID)
	if err == nil && len(cached) > 0 {
		var statement models.Statement
		if jsonErr := json.Unmarshal(cached, &statement); jsonErr == nil {
			return statement, nil
		}
		uc.cacheRepo.DeleteStatement(ctx, statementUID)
	}

	statement, err := uc.statementRepo.GetStatement(statementUID)
	if err != nil {
		return models.Statement{}, fmt.Errorf("%s: orderRepo get order: %w", op, err)
	}

	statementJSON, marshalErr := json.Marshal(statement)
	if marshalErr == nil {
		uc.cacheRepo.SetStatement(ctx, statementUID, statementJSON, 24*time.Hour)
	}

	return statement, nil
}

func (uc *StatementUseCase) GetAllStatements(ctx context.Context) ([]models.Statement, error) {
	const op = "usecase.GetStatement"

	statements, err := uc.statementRepo.GetAllStatements(ctx)
	if err != nil {
		return []models.Statement{}, fmt.Errorf("%s: orderRepo get order: %w", op, err)
	}

	return statements, nil
}

func (uc *StatementUseCase) GetCategoriesAnalitic(ctx context.Context) (map[string]int, error) {
	const op = "usecase.GetStatement"

	analitic, err := uc.statementRepo.GetCategoriesAnalitic(ctx)
	if err != nil {
		return map[string]int{}, fmt.Errorf("%s: orderRepo get order: %w", op, err)
	}

	return analitic, nil
}
