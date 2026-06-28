CREATE TABLE IF NOT EXISTS tenant_registry (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL UNIQUE,
    schema_name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
INSERT INTO tenant_registry (tenant_id, schema_name, display_name, active)
VALUES ('test', 'test', 'Default Test Tenant', TRUE)
    ON CONFLICT (tenant_id) DO UPDATE
                                   SET schema_name = EXCLUDED.schema_name,
                                   display_name = EXCLUDED.display_name,
                                   active = EXCLUDED.active,
                                   updated_at = CURRENT_TIMESTAMP;
