package com.spacedonuts.order.dto.response;

import com.spacedonuts.order.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
  Long id,
  String orderNumber,
  OrderStatus status,
  BigDecimal totalPrice,
  Instant createdAt,
  List<OrderItemResponse> items
) {}
