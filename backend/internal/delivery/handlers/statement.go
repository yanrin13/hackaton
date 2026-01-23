// Package handlers contains HTTP handlers for the hack backend API.
// It uses chi router and provides endpoints for order operations.
package handlers

import (
	"context"
	resp "hack/internal/lib/api/response"
	"hack/internal/models"
	usecase "hack/internal/usecase"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

// NewOrder returns HTTP handler for creating a new order.
// It decodes JSON request body, validates it via use case and returns appropriate response.
func NewStatement(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.statement.NewStatement"

		ctx := r.Context()

		var statements []models.Statement

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		if err := render.DecodeJSON(r.Body, &statements); err != nil {
			log.Error("failed to unmarshal orstatementder", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		if err := statementUseCase.CreateStatement(ctx, statements); err != nil {
			log.Error("failed create statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement creating success")
		render.JSON(w, r, resp.OK())
	}
}

// GetOrder returns HTTP handler for retrieving an order by ID.
// It extracts order ID from URL parameters and returns the order or error.
func GetStatement(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.statement.GetStatement"

		var statement models.Statement

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		//error track
		statementUID := chi.URLParam(r, "id")
		if statementUID == "" {
			http.Error(w, "id parameter missing", http.StatusBadRequest)
			return
		}
		key, _ := strconv.Atoi(statementUID)

		statement, err := statementUseCase.GetStatement(context.Background(), key)
		if err != nil {
			log.Error("failed to unmarshal statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement getting success")
		render.JSON(w, r, statement)
	}
}

func UpdateStatement(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.statement.NewStatement"

		ctx := r.Context()

		var statements []models.Statement

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		if err := render.DecodeJSON(r.Body, &statements); err != nil {
			log.Error("failed to unmarshal orstatementder", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		if err := statementUseCase.UpdateStatement(ctx, statements); err != nil {
			log.Error("failed create statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement updating success")
		render.JSON(w, r, resp.OK())
	}
}

func DeleteStatement(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.statement.DeleteStatement"

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		//error track
		statementUID := chi.URLParam(r, "id")
		if statementUID == "" {
			http.Error(w, "id parameter missing", http.StatusBadRequest)
			return
		}
		key, _ := strconv.Atoi(statementUID)

		err := statementUseCase.DeleteStatement(context.Background(), key)
		if err != nil {
			log.Error("failed to delete statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement delete success")
		render.JSON(w, r, resp.OK())
	}
}

func GetAllStatements(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.statement.GetAllStatements"

		var statements []models.Statement

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		statements, err := statementUseCase.GetAllStatements(context.Background())
		if err != nil {
			log.Error("failed to unmarshal statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement getting success")
		render.JSON(w, r, statements)
	}
}

func GetCategoriesAnalitic(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.analitic.GetCategoriesAnalitic"

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		district := chi.URLParam(r, "district")
		if district == "" {
			http.Error(w, "id parameter missing", http.StatusBadRequest)
			return
		}

		analitic, err := statementUseCase.GetCategoriesAnalitic(context.Background(), district)
		if err != nil {
			log.Error("failed to unmarshal statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement getting success")
		render.JSON(w, r, analitic)
	}
}

func GetDistrictAnalitic(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.analitic.GetDistrictAnalitic"

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		analitic, err := statementUseCase.GetDistrictAnalitic(context.Background())
		if err != nil {
			log.Error("failed to unmarshal statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement getting success")
		render.JSON(w, r, analitic)
	}
}

func GetPeriodAnalitic(log *slog.Logger, statementUseCase *usecase.StatementUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.analitic.GetPeriodAnalitic"

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		analitic, err := statementUseCase.GetPeriodAnalitic(context.Background())
		if err != nil {
			log.Error("failed to unmarshal statement", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement getting success")
		render.JSON(w, r, analitic)
	}
}
