
package com.spacedonuts.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record DonutCreateRequest(

  @NotBlank
  @Size(max = 150)
  String name,

  String description,

  @NotNull
  @DecimalMin("0.01")
  BigDecimal price,

  @Size(max = 500)
  String imageUrl,

  boolean vegan

) {}
