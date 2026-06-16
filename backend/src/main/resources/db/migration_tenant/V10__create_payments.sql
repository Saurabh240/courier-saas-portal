CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    provider VARCHAR(255),
    provider_order_id VARCHAR(255),
    provider_payment_id VARCHAR(255),
    amount_paise BIGINT,
    currency VARCHAR(255),
    status VARCHAR(255),
    raw_payload TEXT,
    last_event VARCHAR(255),
    created_at TIMESTAMPTZ(6),
    updated_at TIMESTAMPTZ(6),
    CONSTRAINT uk_payments_provider_order_id UNIQUE (provider_order_id),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT payments_provider_check CHECK (provider IS NULL OR provider IN ('RAZORPAY', 'STRIPE', 'PAYPAL')),
    CONSTRAINT payments_status_check CHECK (status IS NULL OR status IN ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED'))
);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
