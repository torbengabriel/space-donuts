package com.spacedonuts.cart.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CartMergeRequest(
  @NotEmpty
  List<@Valid CartItemMergeRequest> items
) {}
