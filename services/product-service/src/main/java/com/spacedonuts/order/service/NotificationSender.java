package com.spacedonuts.order.service;

import com.spacedonuts.notification.dto.NotificationResponse;
import com.spacedonuts.notification.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationSender {

  private final SimpMessagingTemplate messagingTemplate;

  public void send(Notification notification) {
    NotificationResponse response =
      NotificationResponse.fromEntity(notification);

    messagingTemplate.convertAndSendToUser(
      notification.getKeycloakUserId(),
      "/queue/notifications",
      response
    );
  }
}
