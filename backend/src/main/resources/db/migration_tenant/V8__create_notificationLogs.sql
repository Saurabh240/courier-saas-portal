CREATE TABLE IF NOT EXISTS notification_logs (
	id bigserial NOT NULL,
	attempted_at timestamptz(6) NULL,
	channel varchar(255) NULL,
	error_message text NULL,
	order_id int8 NULL,
	status varchar(255) NULL,
	CONSTRAINT notification_logs_channel_check CHECK (((channel)::text = ANY ((ARRAY['EMAIL'::character varying, 'SMS'::character varying])::text[]))),
	CONSTRAINT notification_logs_pkey PRIMARY KEY (id),
	CONSTRAINT notification_logs_status_check CHECK (((status)::text = ANY ((ARRAY['SENT'::character varying, 'FAILED'::character varying])::text[])))
);