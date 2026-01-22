package validator

import (
	"hack/internal/models"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

func ValidateStatement(statement *models.Statement) error {
	return validate.Struct(statement)
}
