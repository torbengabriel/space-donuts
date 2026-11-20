CREATE TABLE notifications (
     id BIGINT AUTO_INCREMENT PRIMARY KEY,
     keycloak_user_id VARCHAR(255) NOT NULL,
     title VARCHAR(255) NOT NULL,
     message TEXT NOT NULL,
     type VARCHAR(50) NOT NULL,
     is_read BOOLEAN NOT NULL DEFAULT FALSE,
     created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

     INDEX idx_notifications_user_id (keycloak_user_id),
     INDEX idx_notifications_user_unread (keycloak_user_id, is_read)
);
