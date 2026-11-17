package com.spacedonuts.cart.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemCreateRequest(
  @NotNull Long productId,
  @NotNull @Min(1) Integer quantity
) {}
