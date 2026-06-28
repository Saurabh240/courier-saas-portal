ALTER TABLE tenant_settings
    ADD COLUMN IF NOT EXISTS smtp_host          VARCHAR(255),
    ADD COLUMN IF NOT EXISTS smtp_port          INTEGER DEFAULT 587,
    ADD COLUMN IF NOT EXISTS smtp_user          VARCHAR(255),
    ADD COLUMN IF NOT EXISTS smtp_password_enc  TEXT,
    ADD COLUMN IF NOT EXISTS smtp_tls           BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS email_enabled      BOOLEAN DEFAULT FALSE,

    ADD COLUMN IF NOT EXISTS twilio_account_sid      VARCHAR(255),
    ADD COLUMN IF NOT EXISTS twilio_auth_token_enc   TEXT,
    ADD COLUMN IF NOT EXISTS twilio_from_number      VARCHAR(50),
    ADD COLUMN IF NOT EXISTS sms_enabled             BOOLEAN DEFAULT FALSE;