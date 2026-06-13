CREATE TABLE IF NOT EXISTS manual_status_updates (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT,
    status VARCHAR(255),
    comment VARCHAR(255),
    updated_by VARCHAR(255),
    timestamp TIMESTAMP(6),
    CONSTRAINT manual_status_updates_status_check CHECK (status IS NULL OR status IN ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_manual_status_updates_order_id ON manual_status_updates(order_id);
