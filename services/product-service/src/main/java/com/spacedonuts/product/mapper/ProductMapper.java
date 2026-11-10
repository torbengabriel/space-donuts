package com.spacedonuts.product.mapper;

import com.spacedonuts.product.dto.ProductCreateRequest;
import com.spacedonuts.product.dto.ProductResponse;
import com.spacedonuts.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

  public ProductResponse toResponse(Product product) {
    return new ProductResponse(
      product.getId(),
      product.getName(),
      product.getDescription(),
      product.getPrice(),
      product.getImageUrl(),
      product.getCategory(),
      product.isVegan(),
      product.isAvailable(),
      product.getCreatedAt()
    );
  }

  public Product toEntity(ProductCreateRequest request) {
    return new Product(
      request.name(),
      request.description(),
      request.price(),
      request.imageUrl(),
      request.category(),
      request.vegan()
    );
  }
}
