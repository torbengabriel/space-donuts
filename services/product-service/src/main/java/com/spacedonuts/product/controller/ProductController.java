package com.spacedonuts.product.controller;

import com.spacedonuts.product.dto.ProductCreateRequest;
import com.spacedonuts.product.dto.ProductResponse;
import com.spacedonuts.product.entity.ProductCategory;
import com.spacedonuts.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public ResponseEntity<List<ProductResponse>> getProducts(
    @RequestParam(required = false) ProductCategory category,
    @RequestParam(required = false) String search,
    @RequestParam(required = false) Boolean vegan,
    @RequestParam(required = false) Boolean available
  ) {
    return ResponseEntity.ok(productService.searchProducts(category, search, vegan, available));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductResponse> findById(@PathVariable Long id) {
    return ResponseEntity.ok(productService.findById(id));
  }

  @PostMapping
  public ResponseEntity<ProductResponse> create(
    @Valid @RequestBody ProductCreateRequest request
  ) {
    ProductResponse createdProduct = productService.create(request);

    URI location = URI.create("/api/products/" + createdProduct.id());

    return ResponseEntity.created(location).body(createdProduct);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductResponse> update(
    @PathVariable Long id,
    @Valid @RequestBody ProductCreateRequest request
  ) {
    ProductResponse updatedProduct = productService.update(id, request);
    return ResponseEntity.ok(updatedProduct);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    productService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
