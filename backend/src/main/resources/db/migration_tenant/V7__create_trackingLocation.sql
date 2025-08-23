CREATE TABLE IF NOT EXISTS tracking_location (
	id bigserial NOT NULL,
	latitude float8 NOT NULL,
	longitude float8 NOT NULL,
	status varchar(255) NULL,
	"timestamp" varchar(255) NULL,
	tracking_id int8 NULL,
	CONSTRAINT tracking_location_pkey PRIMARY KEY (id)
);