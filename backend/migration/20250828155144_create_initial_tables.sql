-- +goose Up
-- +goose StatementBegin

CREATE TABLE statements (
    id                  BIGSERIAL           PRIMARY KEY,             
    source              VARCHAR(100)        NOT NULL,             
    district            VARCHAR(100)        NOT NULL,            
    category            VARCHAR(80)         NOT NULL,           
    subcategory         VARCHAR(150)        NOT NULL,
    created_at          DATE                NOT NULL,           
    status              VARCHAR(50)         NOT NULL,          
    description         TEXT                NOT NULL
);

CREATE INDEX idx_statement_district_category ON complaints(district, category);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS statement CASCADE;

-- +goose StatementEnd