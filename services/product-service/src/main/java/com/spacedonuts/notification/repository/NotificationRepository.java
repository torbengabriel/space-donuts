package com.spacedonuts.notification.repository;

import com.spacedonuts.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  List<Notification> findByKeycloakUserIdOrderByCreatedAtDesc(
    String keycloakUserId
  );

  List<Notification> findByKeycloakUserIdAndReadFalseOrderByCreatedAtDesc(
    String keycloakUserId
  );

  long countByKeycloakUserIdAndReadFalse(String keycloakUserId);
}
