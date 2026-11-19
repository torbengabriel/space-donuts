package com.spacedonuts.order.messaging;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderPlacedEvent(
  Long orderId,
  String orderNumber,
  String keycloakUserId,
  BigDecimal totalPrice,
  Instant createdAt
) {}
