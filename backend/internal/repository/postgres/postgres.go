// Package postgres provides PostgreSQL-based implementation of order storage.
// It handles database connection, migrations and order CRUD operations.
package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"hack/internal/models"
	"log/slog"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib" //import pgx driver
	"github.com/pressly/goose/v3"
)

// Storage represents PostgreSQL repository for orders.
type Storage struct {
	db *sql.DB
}

// MustLoad initializes PostgreSQL storage with database connection and runs migrations.
// If a failure occurs during migration, os.exit is executed
func MustLoad(log *slog.Logger, db *sql.DB, migrationsPath string) *Storage {
	const op = "storage.postgres.MustLoad"

	db.SetMaxIdleConns(20)
	db.SetConnMaxLifetime(time.Hour)
	db.SetConnMaxIdleTime(15 * time.Minute)

	if err := db.Ping(); err != nil {
		log.Error("%s: db ping failed", op, slog.String("error", err.Error()))
		os.Exit(1)
	}

	if err := runMigrations(db, migrationsPath); err != nil {
		fmt.Println(err.Error())
		log.Error("%s: failed to apply database migrations", op, slog.String("error", err.Error()))
		os.Exit(1)
	}

	return &Storage{db: db}
}

// runMigrations applies pending migrations using goose.
func runMigrations(db *sql.DB, migrationsPath string) error {
	if migrationsPath == "" {
		return fmt.Errorf("migrations path is empty")
	}

	if err := goose.SetDialect("pgx"); err != nil {
		return fmt.Errorf("failed to set goose dialect: %w", err)
	}

	if err := goose.Up(db, migrationsPath); err != nil {
		return fmt.Errorf("failed to apply migrations: %w", err)
	}

	return nil
}

func (s *Storage) NewStatement(statements []models.Statement) error {
	const op = "storage.postgres.NewStatement"

	ctx := context.Background()
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("%s: begin tx: %w", op, err)
	}
	defer tx.Rollback()
	for _, stmt := range statements{
		// Вставляем запись
		_, err = tx.ExecContext(ctx, `
		INSERT INTO statements (
		source, district, category, subcategory,
		created_at, status, description
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT DO NOTHING`,
			stmt.Source,
			stmt.District,
			stmt.Category,
			stmt.Subcategory,
			stmt.CreatedAt,
			stmt.Status,
			stmt.Description,
		)
	
		if err != nil {
			return fmt.Errorf("%s: insert statement: %w", op, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("%s: commit: %w", op, err)
	}

	return nil
}

// GetStatement получает одно обращение по id
func (s *Storage) GetStatement(id int) (models.Statement, error) {
	const op = "storage.postgres.GetStatement"

	var stmt models.Statement

	ctx := context.Background()
	err := s.db.QueryRowContext(ctx, `
		SELECT 
		id,
		source,
		district,
		category,
		subcategory,
		created_at,
		status,
		description,
		FROM statements
		WHERE id = $1`,
		id,
	).Scan(
		&stmt.StatementUID,
		&stmt.Source,
		&stmt.District,
		&stmt.Category,
		&stmt.Subcategory,
		&stmt.CreatedAt,
		&stmt.Status,
		&stmt.Description,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return models.Statement{}, fmt.Errorf("%s: statement not found (id=%d)", op, id)
		}
		return models.Statement{}, fmt.Errorf("%s: query: %w", op, err)
	}

	return stmt, nil
}

func (s *Storage) GetAllStatements(ctx context.Context) ([]models.Statement, error) {
	const op = "storage.postgres.GetStatement"

	rows, err := s.db.QueryContext(ctx, `
		SELECT 
		id,
		source,
		district,
		category,
		subcategory,
		created_at,
		status,
		description
		FROM statements`,
	)	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return []models.Statement{}, fmt.Errorf("%s: statements not found", op)
		}
		return []models.Statement{}, fmt.Errorf("%s: query: %w", op, err)
	}

	var statements []models.Statement
	for rows.Next() {
		var stmt models.Statement
		err := rows.Scan(&stmt.StatementUID,
			&stmt.Source,
			&stmt.District,
			&stmt.Category,
			&stmt.Subcategory,
			&stmt.CreatedAt,
			&stmt.Status,
			&stmt.Description,
		)
		if err != nil {
			return []models.Statement{}, fmt.Errorf("%s: statements not found", op)
		}
		statements = append(statements, stmt)
	}

	return statements, nil
}

func (s *Storage) GetCategoriesAnalitic(ctx context.Context) (map[string]int, error) {
	const op = "storage.postgres.GetStatement"

	rows, err := s.db.QueryContext(ctx, `
		SELECT 
		category, COUNT(category)
		FROM statements
		GROUP BY category
		`,
	)	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return map[string]int{}, fmt.Errorf("%s: statements not found", op)
		}
		return map[string]int{}, fmt.Errorf("%s: query: %w", op, err)
	}

	analitic := make(map[string]int)
	for rows.Next() {
		key, value := "", 0
		
		err := rows.Scan(&key,&value)
		if err != nil {
			return map[string]int{}, fmt.Errorf("%s: statements not found", op)
		}

		analitic[key] = value
	}

	return analitic, nil
}

// Close closes the underlying database connection.
// Should be called on application shutdown.
func (s *Storage) Close() error {
	return s.db.Close()
}
