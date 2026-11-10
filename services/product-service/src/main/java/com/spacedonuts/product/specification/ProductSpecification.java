package com.spacedonuts.product.specification;

import com.spacedonuts.product.entity.Product;
import com.spacedonuts.product.entity.ProductCategory;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

  public static Specification<Product> hasCategory(
    ProductCategory category) {

    return (root, query, criteriaBuilder) -> {
      if (category == null) {
        return null;
      }

      return criteriaBuilder.equal(
        root.get("category"),
        category
      );
    };
  }

  public static Specification<Product> nameContains(
    String search) {

    return (root, query, criteriaBuilder) -> {
      if (search == null || search.isBlank()) {
        return null;
      }

      return criteriaBuilder.like(
        criteriaBuilder.lower(root.get("name")),
        "%" + search.toLowerCase() + "%"
      );
    };
  }

  public static Specification<Product> isVegan(Boolean vegan) {

    return (root, query, criteriaBuilder) -> {
      if (vegan == null) {
        return null;
      }

      return criteriaBuilder.equal(
        root.get("vegan"),
        vegan
      );
    };
  }

  public static Specification<Product> isAvailable(Boolean available) {

    return (root, query, criteriaBuilder) -> {
      if (available == null) {
        return null;
      }

      return criteriaBuilder.equal(
        root.get("available"),
        available
      );
    };
  }
}
