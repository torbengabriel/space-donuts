package com.spacedonuts.cart.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemMergeRequest(
  @NotNull Long productId,
  @NotNull @Min(1) Integer quantity
) {}
