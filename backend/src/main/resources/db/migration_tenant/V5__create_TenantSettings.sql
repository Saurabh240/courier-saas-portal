CREATE TABLE IF NOT EXISTS tenant_settings (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL UNIQUE,
    business_hours TEXT,
    brand_name VARCHAR(255),
    logo_url VARCHAR(255),
    primary_color VARCHAR(255),
    secondary_color VARCHAR(255),
    timezone VARCHAR(255),
    created_at TIMESTAMPTZ(6),
    updated_at TIMESTAMPTZ(6)
);