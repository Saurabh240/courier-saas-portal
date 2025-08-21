CREATE TABLE IF NOT EXISTS users (
    id serial4 NOT NULL,
    name varchar(100) NULL,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    phone_no varchar(255) NULL,
    role varchar(50) NOT NULL,
    verified bool DEFAULT false NULL,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
