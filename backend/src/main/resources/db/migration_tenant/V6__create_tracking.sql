CREATE TABLE IF NOT EXISTS tracking (
	tracking_id bigserial NOT NULL,
	agent_id varchar(255) NULL,
	order_id int8 NULL,
	pickup_time varchar(255) NULL,
	status varchar(255) NULL,
	CONSTRAINT tracking_pkey PRIMARY KEY (tracking_id)
);