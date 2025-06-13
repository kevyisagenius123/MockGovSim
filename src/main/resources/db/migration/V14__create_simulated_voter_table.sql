-- Flyway migration: create simulated_voter table
CREATE TABLE simulated_voter (
    id VARCHAR(255) PRIMARY KEY,
    region VARCHAR(255),
    voted BOOLEAN,
    registered_at TIMESTAMP,
    election_type VARCHAR(255)
); 