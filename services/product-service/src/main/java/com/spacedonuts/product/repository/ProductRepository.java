package com.spacedonuts.product.repository;

import com.spacedonuts.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends
  JpaRepository<Product, Long>,
  JpaSpecificationExecutor<Product> {
}
