package com.spacedonuts.notification.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor {

  private final JwtDecoder jwtDecoder;

  public StompAuthChannelInterceptor(JwtDecoder jwtDecoder) {
    this.jwtDecoder = jwtDecoder;
  }

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {

    StompHeaderAccessor accessor =
      MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor == null) {
      return message;
    }

    if (StompCommand.CONNECT.equals(accessor.getCommand())) {

      String authorizationHeader =
        accessor.getFirstNativeHeader("Authorization");

      if (authorizationHeader == null ||
        !authorizationHeader.startsWith("Bearer ")) {
        throw new MessagingException(message, "Missing Bearer token");
      }

      String token = authorizationHeader.substring(7);

      try {
        Jwt jwt = jwtDecoder.decode(token);
        JwtAuthenticationToken authentication =
          new JwtAuthenticationToken(jwt);

        accessor.setUser(authentication);

      } catch (Exception exception) {
        System.err.println("JWT validation failed: "
          + exception.getClass().getSimpleName()
          + " - " + exception.getMessage());

        throw new MessagingException(message, "Invalid JWT token", exception);
      }
    }

    if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {

      String destination = accessor.getDestination();

      if (!"/user/queue/notifications".equals(destination)) {
        throw new MessagingException(
          message,
          "Subscription to this destination is not allowed"
        );
      }

      if (accessor.getUser() == null) {
        throw new MessagingException(message, "User is not authenticated");
      }
    }

    if (StompCommand.SEND.equals(accessor.getCommand())) {
      throw new MessagingException(message, "Client messages are not allowed");
    }

    return message;
  }
}
