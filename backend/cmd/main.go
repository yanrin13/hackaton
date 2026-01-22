package main

import (
	"hack/internal/config"
	"hack/internal/delivery/handlers"
	mwLogger "hack/internal/delivery/middleware/logger"
	kafka "hack/internal/lib/kafka"
	"hack/internal/lib/logger/sl"
	"hack/internal/lib/logger/slogpretty"
	"hack/internal/repository/postgres"
	"hack/internal/repository/redis"
	usecase "hack/internal/usecase"
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	chiprom "github.com/766b/chi-prometheus"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"golang.org/x/sync/errgroup"
)

func main() {
	cfg := config.MustLoad()

	log := slogpretty.SetupLogger(cfg.Env)
	log.Info("starting server", slog.String("env", cfg.Env))

	db, err := sql.Open("pgx", cfg.DSN())
	if err != nil {
		log.Error("failed to init storage", sl.Err(err))
		os.Exit(1)
	}

	orderRepo := postgres.MustLoad(log, db, cfg.MigrationsPath)

	redisConn := redis.MustLoad(log, cfg.Redis.Host, cfg.Redis.Port, cfg.Redis.Password, cfg.DB)

	kafkaProducer := kafka.MustProducer(log, cfg.Brokers, cfg.Topic)

	orderUseCase := usecase.NewOrderUseCase(orderRepo, redisConn, kafkaProducer)

	kafkaConsumer := kafka.NewConsumer(cfg.Brokers, cfg.ConsumerGroup, cfg.Topic, cfg.DLQTopic)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	g, ctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		log.Info("starting Kafka consumer")
		return kafkaConsumer.Start(ctx, orderUseCase.HandleMessage)
	})

	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(mwLogger.New(log))
	router.Use(middleware.Recoverer)

	// позже нужно добавить метрики
	router.Use(chiprom.NewMiddleware("my-service"))
	// router.Use(middleware.URLFormat)

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://0.0.0.0:*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	router.Handle("/metrics", promhttp.Handler())

	router.Post("/api/statement", handlers.NewStatement(log, orderUseCase))
	router.Get("/api/statement/{id}", handlers.GetStatement(log, orderUseCase))

	router.Post("/api/statement", handlers.NewStatement(log, orderUseCase))
	router.Get("/api/statement/{id}", handlers.GetStatement(log, orderUseCase))
	
	srv := &http.Server{
		Addr:         cfg.Address,
		Handler:      router,
		ReadTimeout:  cfg.Timeout,
		WriteTimeout: cfg.Timeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	g.Go(func() error {
		log.Info("starting HTTP server", slog.String("address", cfg.Address))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("HTTP server error", sl.Err(err))
			return err
		}
		return nil
	})

	<-ctx.Done()
	log.Info("shutting down gracefully...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error("HTTP server forced shutdown", sl.Err(err))
	}

	if err := g.Wait(); err != nil && !errors.Is(err, context.Canceled) {
		log.Error("error during shutdown", sl.Err(err))
	}

	log.Info("closing resources...")
	if err := db.Close(); err != nil {
		log.Error("error closing database", sl.Err(err))
	}
	if err := redisConn.Close(); err != nil {
		log.Error("error closing redis", sl.Err(err))
	}
	if err := kafkaProducer.Close(); err != nil {
		log.Error("error closing kafka producer", sl.Err(err))
	}

	log.Info("server stopped gracefully")
}
