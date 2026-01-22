package validator

import (
	"WB/internal/models"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
    validate = validator.New()
}

func ValidateOrder(statement *models.Statement) error {
    return validate.Struct(order)
}