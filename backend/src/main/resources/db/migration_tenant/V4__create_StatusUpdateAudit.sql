CREATE TABLE IF NOT EXISTS status_update_audit (
	id bigserial NOT NULL,
	new_status varchar(255) NULL,
	old_status varchar(255) NULL,
	order_id int8 NULL,
	performed_by varchar(255) NULL,
	reason varchar(255) NULL,
	"timestamp" timestamp(6) NULL,
	CONSTRAINT status_update_audit_new_status_check CHECK (((new_status)::text = ANY ((ARRAY['CREATED'::character varying, 'PICKED_UP'::character varying, 'IN_TRANSIT'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[]))),
	CONSTRAINT status_update_audit_old_status_check CHECK (((old_status)::text = ANY ((ARRAY['CREATED'::character varying, 'PICKED_UP'::character varying, 'IN_TRANSIT'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[]))),
	CONSTRAINT status_update_audit_pkey PRIMARY KEY (id)
);