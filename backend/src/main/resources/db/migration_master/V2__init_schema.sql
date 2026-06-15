CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tenant_registry_updated_at ON tenant_registry;
CREATE TRIGGER trg_tenant_registry_updated_at
BEFORE UPDATE ON tenant_registry
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_tenant_registry_active ON tenant_registry(active);
