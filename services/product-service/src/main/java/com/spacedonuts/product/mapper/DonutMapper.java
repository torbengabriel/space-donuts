package com.spacedonuts.product.mapper;

import com.spacedonuts.product.dto.DonutResponse;
import com.spacedonuts.product.entity.Donut;
import org.springframework.stereotype.Component;

@Component
public class DonutMapper {

  public DonutResponse toResponse(Donut donut) {
    return new DonutResponse(
      donut.getId(),
      donut.getName(),
      donut.getDescription(),
      donut.getPrice(),
      donut.getImageUrl(),
      donut.isVegan(),
      donut.isAvailable(),
      donut.getCreatedAt()
    );
  }
}
