package com.spacedonuts.notification.dto;

import com.spacedonuts.notification.entity.Notification;
import com.spacedonuts.notification.entity.NotificationType;

import java.time.Instant;

public record NotificationResponse(
  Long id,
  String title,
  String message,
  NotificationType type,
  boolean read,
  Instant createdAt
) {

  public static NotificationResponse fromEntity(Notification notification) {
    return new NotificationResponse(
      notification.getId(),
      notification.getTitle(),
      notification.getMessage(),
      notification.getType(),
      notification.isRead(),
      notification.getCreatedAt()
    );
  }
}
