package com.spacedonuts.notification.service;

import com.spacedonuts.notification.dto.NotificationResponse;
import com.spacedonuts.notification.entity.Notification;
import com.spacedonuts.notification.entity.NotificationType;
import com.spacedonuts.notification.repository.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationRepository notificationRepository;

  @Transactional
  public Notification createNotification(
    String keycloakUserId,
    String title,
    String message,
    NotificationType type
  ) {
    Notification notification = new Notification();

    notification.setKeycloakUserId(keycloakUserId);
    notification.setTitle(title);
    notification.setMessage(message);
    notification.setType(type);

    return notificationRepository.save(notification);
  }

  @Transactional(readOnly = true)
  public List<Notification> getNotifications(String keycloakUserId) {
    return notificationRepository
      .findByKeycloakUserIdOrderByCreatedAtDesc(keycloakUserId);
  }

  @Transactional(readOnly = true)
  public long getUnreadCount(String keycloakUserId) {
    return notificationRepository
      .countByKeycloakUserIdAndReadFalse(keycloakUserId);
  }

  @Transactional
  public NotificationResponse markAsRead(Long notificationId, String keycloakUserId) {
    Notification notification = notificationRepository.findById(notificationId)
      .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

    if (!notification.getKeycloakUserId().equals(keycloakUserId)) {
      throw new EntityNotFoundException("Notification not found");
    }

    notification.setRead(true);

    return NotificationResponse.fromEntity(notification);
  }
}
