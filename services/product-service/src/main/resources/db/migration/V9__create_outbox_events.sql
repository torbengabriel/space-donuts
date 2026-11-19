CREATE TABLE outbox_events (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       event_id VARCHAR(36) NOT NULL UNIQUE,
       aggregate_type VARCHAR(100) NOT NULL,
       aggregate_id VARCHAR(100) NOT NULL,
       event_type VARCHAR(100) NOT NULL,
       payload JSON NOT NULL,
       created_at TIMESTAMP NOT NULL,
       published_at TIMESTAMP NULL,

       INDEX idx_outbox_unpublished (published_at, created_at)
);
