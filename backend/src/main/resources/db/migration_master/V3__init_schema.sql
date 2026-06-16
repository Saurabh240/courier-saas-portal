INSERT INTO tenant_registry (tenant_id, schema_name, display_name, active)
VALUES ('test', 'test', 'Default Test Tenant', TRUE)
ON CONFLICT (tenant_id) DO UPDATE
SET schema_name = EXCLUDED.schema_name,
    display_name = EXCLUDED.display_name,
    active = EXCLUDED.active,
    updated_at = CURRENT_TIMESTAMP;
