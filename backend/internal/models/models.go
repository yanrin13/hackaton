package models

import "time"

type Statement struct {
    ID            int       json:"id" validate:"required,gte=1"
    Source        string    json:"source" validate:"required"
    District      string    json:"district" validate:"required"
    Category      string    json:"category" validate:"required"
    Subcategory   string    json:"subcategory" validate:"required"
    CreatedAt     time.Time json:"created_at" validate:"required"
    Status        string    json:"status" validate:"required"
    Description   string    json:"description" validate:"required,min=10"
}