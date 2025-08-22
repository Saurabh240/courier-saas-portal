CREATE TABLE IF NOT EXISTS tenant_settings (
	id uuid NOT NULL,
	brand_name varchar(255) NULL,
	business_hours text NULL,
	created_at timestamptz(6) NULL,
	logo_url varchar(255) NULL,
	primary_color varchar(255) NULL,
	secondary_color varchar(255) NULL,
	tenant_id varchar(255) NOT NULL,
	timezone varchar(255) NULL,
	updated_at timestamptz(6) NULL,
	CONSTRAINT tenant_settings_pkey PRIMARY KEY (id)
);