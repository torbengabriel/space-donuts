package com.spacedonuts.order.dto.response;

import java.math.BigDecimal;

public record OrderItemResponse(
  Long productId,
  String productName,
  BigDecimal price,
  Integer quantity,
  BigDecimal subtotal
) {}
