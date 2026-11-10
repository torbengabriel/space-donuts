package com.spacedonuts.product.service;

import com.spacedonuts.product.dto.ProductCreateRequest;
import com.spacedonuts.product.dto.ProductResponse;
import com.spacedonuts.product.entity.Product;
import com.spacedonuts.product.entity.ProductCategory;
import com.spacedonuts.product.exception.ProductNotFoundException;
import com.spacedonuts.product.mapper.ProductMapper;
import com.spacedonuts.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.spacedonuts.product.specification.ProductSpecification.*;

@Service
public class ProductService {

  private static final Logger log =
    LoggerFactory.getLogger(ProductService.class);

  private final ProductRepository productRepository;
  private final ProductMapper productMapper;

  public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
    this.productRepository = productRepository;
    this.productMapper = productMapper;
  }

  public List<ProductResponse> searchProducts(
    ProductCategory category,
    String search,
    Boolean vegan,
    Boolean available) {
    log.debug("Loading all products");

    Specification<Product> spec = Specification
      .where(hasCategory(category))
      .and(nameContains(search))
      .and(isVegan(vegan))
      .and(isAvailable(available));

    List<Product> products = productRepository.findAll(spec);

    log.debug("Loaded {} products", products.size());

    return productRepository.findAll(spec)
      .stream()
      .map(productMapper::toResponse)
      .toList();
  }

  public ProductResponse findById(Long id) {
    log.debug("Loading donut with id {}", id);

    Product product = productRepository.findById(id)
      .orElseThrow(() -> new ProductNotFoundException(id));

    return productMapper.toResponse(product);
  }

  public ProductResponse create(ProductCreateRequest request) {
    Product product = productMapper.toEntity(request);
    Product savedProduct = productRepository.save(product);

    log.info("Created donut with ID {}", savedProduct.getId());

    return productMapper.toResponse(savedProduct);
  }

  @Transactional
  public ProductResponse update(Long id, ProductCreateRequest request) {
    Product product = productRepository.findById(id)
      .orElseThrow(() -> new ProductNotFoundException(id));

    product.setName(request.name());
    product.setDescription(request.description());
    product.setPrice(request.price());
    product.setImageUrl(request.imageUrl());
    product.setVegan(request.vegan());

    log.debug("Updating donut with ID {}", product.getId());

    return productMapper.toResponse(product);
  }

  @Transactional
  public void delete(Long id) {
    Product product = productRepository.findById(id)
      .orElseThrow(() -> new ProductNotFoundException(id));

    productRepository.delete(product);

    log.info("Product with ID {} was deleted", product.getId());
  }
}
