// Package handlers contains HTTP handlers for the WB backend API.
// It uses chi router and provides endpoints for order operations.
package handlers

import (
	resp "WB/internal/lib/api/response"
	"WB/internal/models"
	usecase "WB/internal/usecase"
	"context"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

// NewOrder returns HTTP handler for creating a new order.
// It decodes JSON request body, validates it via use case and returns appropriate response.
func NewStatement(log *slog.Logger, orderUseCase *usecase.OrderUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.order.NewOrder"

		ctx := r.Context()

		var statement models.Statement

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		if err := render.DecodeJSON(r.Body, &statement); err != nil {
			log.Error("failed to unmarshal order", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		if err := statementUseCase.CreateStatement(ctx, statement); err != nil {
			log.Error("failed create order", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement creating success")
		render.JSON(w, r, resp.OK())
	}
}

// GetOrder returns HTTP handler for retrieving an order by ID.
// It extracts order ID from URL parameters and returns the order or error.
func GetStatement(log *slog.Logger, statementUseCase *usecase.OrderUseCase) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.order.GetOrder"

		var statement models.Statement

		log := log.With(
			slog.String("op", op),
			slog.String("request_id", middleware.GetReqID(r.Context())),
		)

		//error track
		statementID := chi.URLParam(r, "id")
		if statementID == "" {
			http.Error(w, "id parameter missing", http.StatusBadRequest)
			return
		}

		statement, err := statementUseCase.GetStatement(context.Background(), OrderID)
		if err != nil {
			log.Error("failed to unmarshal order", "op", op, "error", err)
			render.JSON(w, r, resp.Error(err.Error()))
			return
		}

		log.Info("statement getting success")
		render.JSON(w, r, statement)
	}
}
