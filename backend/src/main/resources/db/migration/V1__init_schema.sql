CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    verified BOOLEAN DEFAULT FALSE
);

-- Add more tables like refresh_token, delivery_agent etc. as needed