CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_no VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT users_role_check CHECK (role IN ('ADMIN', 'STAFF', 'DELIVERY_PARTNER', 'CUSTOMER'))
);

CREATE TABLE IF NOT EXISTS address (
    id BIGINT PRIMARY KEY,
    line1 VARCHAR(255),
    line2 VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(255),
    country VARCHAR(255),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT
);

CREATE SEQUENCE IF NOT EXISTS address_seq START WITH 1 INCREMENT BY 50;
CREATE INDEX IF NOT EXISTS idx_address_user_id ON address(user_id);

ALTER TABLE address
    DROP CONSTRAINT IF EXISTS fk_address_user;

ALTER TABLE address
    ADD CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id);
