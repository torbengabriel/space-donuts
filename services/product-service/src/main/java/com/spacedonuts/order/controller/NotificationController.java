package com.spacedonuts.notification.controller;

import com.spacedonuts.notification.dto.NotificationResponse;
import com.spacedonuts.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final NotificationService notificationService;

  @GetMapping
  public List<NotificationResponse> getNotifications(
    @AuthenticationPrincipal Jwt jwt
  ) {
    return notificationService.getNotifications(jwt.getSubject())
      .stream()
      .map(NotificationResponse::fromEntity)
      .toList();
  }

  @GetMapping("/unread-count")
  public long getUnreadCount(@AuthenticationPrincipal Jwt jwt) {
    return notificationService.getUnreadCount(jwt.getSubject());
  }

  @PatchMapping("/{id}/read")
  public NotificationResponse markAsRead(
    @PathVariable Long id,
    @AuthenticationPrincipal Jwt jwt
  ) {
    return notificationService.markAsRead(id, jwt.getSubject());
  }
}
