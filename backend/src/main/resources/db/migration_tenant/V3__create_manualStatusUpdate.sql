CREATE TABLE IF NOT EXISTS manual_status_updates (
	id bigserial NOT NULL,
	"comment" varchar(255) NULL,
	order_id int8 NULL,
	status varchar(255) NULL,
	"timestamp" timestamp(6) NULL,
	updated_by varchar(255) NULL,
	CONSTRAINT manual_status_updates_pkey PRIMARY KEY (id),
	CONSTRAINT manual_status_updates_status_check CHECK (((status)::text = ANY ((ARRAY['CREATED'::character varying, 'PICKED_UP'::character varying, 'IN_TRANSIT'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])))
);