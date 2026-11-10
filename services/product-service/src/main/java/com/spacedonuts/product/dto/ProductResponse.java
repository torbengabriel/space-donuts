package com.spacedonuts.product.dto;

import com.spacedonuts.product.entity.ProductCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
  Long id,
  String name,
  String description,
  BigDecimal price,
  String imageUrl,
  ProductCategory category,
  boolean vegan,
  boolean available,
  LocalDateTime createdAt
) {
}
