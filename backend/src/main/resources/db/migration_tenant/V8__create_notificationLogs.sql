CREATE TABLE IF NOT EXISTS notification_logs (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT,
    channel VARCHAR(255),
    status VARCHAR(255),
    attempted_at TIMESTAMPTZ(6),
    error_message TEXT,
    CONSTRAINT notification_logs_channel_check CHECK (channel IS NULL OR channel IN ('EMAIL', 'SMS')),
    CONSTRAINT notification_logs_status_check CHECK (status IS NULL OR status IN ('SENT', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_order_id ON notification_logs(order_id);
