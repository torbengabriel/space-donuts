package com.spacedonuts.product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DonutResponse(
  Long id,
  String name,
  String description,
  BigDecimal price,
  String imageUrl,
  boolean vegan,
  boolean available,
  LocalDateTime createdAt
) {
}
