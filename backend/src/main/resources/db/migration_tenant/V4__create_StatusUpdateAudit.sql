CREATE TABLE IF NOT EXISTS status_update_audit (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT,
    old_status VARCHAR(255),
    new_status VARCHAR(255),
    performed_by VARCHAR(255),
    reason VARCHAR(255),
    timestamp TIMESTAMP(6),
    CONSTRAINT status_update_audit_old_status_check CHECK (old_status IS NULL OR old_status IN ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    CONSTRAINT status_update_audit_new_status_check CHECK (new_status IS NULL OR new_status IN ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_status_update_audit_order_id ON status_update_audit(order_id);
