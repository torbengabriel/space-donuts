package com.spacedonuts.product.service;

import com.spacedonuts.product.dto.ProductCreateRequest;
import com.spacedonuts.product.dto.ProductResponse;
import com.spacedonuts.product.entity.Product;
import com.spacedonuts.product.entity.ProductCategory;
import com.spacedonuts.product.exception.ProductNotFoundException;
import com.spacedonuts.product.mapper.ProductMapper;
import com.spacedonuts.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

  @Mock
  private ProductRepository productRepository;

  @Mock
  private ProductMapper productMapper;

  @InjectMocks
  private ProductService productService;

  @BeforeEach
  void setUp() {
    // Hier können wir später gemeinsame Testdaten vorbereiten.
  }

  @Test
  void findByIdShouldReturnDonut() {
    // Arrange
    Product product1 = new Product(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false
    );

    ProductResponse response1 = new ProductResponse(
      1L,
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false,
      true,
      LocalDateTime.now()
    );

    when(productRepository.findById(1L))
      .thenReturn(Optional.of(product1));

    when(productMapper.toResponse(product1))
      .thenReturn(response1);

    // Act
    ProductResponse result = productService.findById(1L);

    // Assert
    assertEquals(response1, result);

    verify(productRepository).findById(1L);
    verify(productMapper).toResponse(product1);
  }

  @Test
  void findAllShouldReturnAllDonuts() {
    // Arrange
    Product product1 = new Product(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false
    );

    Product product2 = new Product(
      "Saturn's Ring",
      "Vanilla donut with colorful sprinkles",
      new BigDecimal("3.50"),
      "/images/donuts/saturns-ring.png",
      ProductCategory.DONUT,
      true
    );

    ProductResponse response1 = new ProductResponse(
      1L, "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false,
      true,
      LocalDateTime.now()
    );

    ProductResponse response2 = new ProductResponse(
      2L, "Saturn's Ring",
      "Vanilla donut with colorful sprinkles",
      new BigDecimal("3.50"),
      "/images/donuts/saturns-ring.png",
      ProductCategory.DONUT,
      true,
      true,
      LocalDateTime.now()
    );

    when(productRepository.findAll())
      .thenReturn(List.of(product1, product2));

    when(productMapper.toResponse(product1)).thenReturn(response1);
    when(productMapper.toResponse(product2)).thenReturn(response2);

    // Act
    List<ProductResponse> result = productService.searchProducts(
      ProductCategory.DONUT,
      null,
      null,
      null
    );

    // Assert
    assertEquals(2, result.size());
    assertEquals(List.of(response1, response2), result);

    verify(productRepository).findAll();
    verify(productMapper).toResponse(product1);
    verify(productMapper).toResponse(product2);
  }

  @Test
  void findByIdShouldThrowExceptionWhenDonutDoesNotExist() {
    // Arrange
    when(productRepository.findById(999L))
      .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
      ProductNotFoundException.class,
      () -> productService.findById(999L)
    );

    verify(productRepository).findById(999L);
    verifyNoInteractions(productMapper);
  }

  @Test
  void createDonutShouldCreateDonut() {
    // Arrange
    Product product = new Product(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false
    );

    ProductCreateRequest request = new ProductCreateRequest(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false
    );

    ProductResponse response = new ProductResponse(
      1L,
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false,
      true,
      LocalDateTime.now()
    );

    when(productMapper.toEntity(request)).thenReturn(product);
    when(productRepository.save(product)).thenReturn(product);
    when(productMapper.toResponse(product)).thenReturn(response);

    // Act
    ProductResponse result = productService.create(request);

    // Assert
    assertEquals(response, result);

    verify(productMapper).toEntity(request);
    verify(productMapper).toResponse(product);

    // catch Repository-Call
    ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);

    verify(productRepository).save(captor.capture());

    Product capturedProduct = captor.getValue();

    assertEquals("Black Hole Brownie", capturedProduct.getName());
    assertEquals(new BigDecimal("4.50"), capturedProduct.getPrice());
    assertFalse(capturedProduct.isVegan());
  }

  @Test
  void updateShouldUpdateExistingDonut() {
    // Arrange
    Product product = new Product(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false
    );

    ProductCreateRequest request = new ProductCreateRequest(
      "Updated Donut",
      "Updated description",
      new BigDecimal("5.50"),
      "/images/donuts/updated-donut.png",
      ProductCategory.DONUT,
      true
    );

    ProductResponse expectedResponse = new ProductResponse(
      1L,
      "Updated Donut",
      "Updated description",
      new BigDecimal("5.50"),
      "/images/donuts/updated-donut.png",
      ProductCategory.DONUT,
      true,
      true,
      LocalDateTime.now()
    );

    when(productRepository.findById(1L))
      .thenReturn(Optional.of(product));

    when(productMapper.toResponse(product))
      .thenReturn(expectedResponse);

    // Act
    ProductResponse result = productService.update(1L, request);

    // Assert
    assertEquals(expectedResponse, result);

    assertEquals("Updated Donut", product.getName());
    assertEquals("Updated description", product.getDescription());
    assertEquals(new BigDecimal("5.50"), product.getPrice());
    assertEquals("/images/donuts/updated-donut.png", product.getImageUrl());
    assertTrue(product.isVegan());

    verify(productRepository).findById(1L);
    verify(productMapper).toResponse(product);
  }

  @Test
  void updateShouldThrowExceptionWhenDonutDoesNotExist() {
    // Arrange
    ProductCreateRequest request = new ProductCreateRequest(
      "Updated Donut",
      "Updated description",
      new BigDecimal("5.50"),
      "/images/donuts/updated-donut.png",
      ProductCategory.DONUT,
      true
    );

    when(productRepository.findById(999L))
      .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
      ProductNotFoundException.class,
      () -> productService.update(999L, request)
    );

    verify(productRepository).findById(999L);
    verifyNoInteractions(productMapper);
  }

  @Test
  void deleteShouldDeleteExistingDonut() {
    // Arrange
    Product product = new Product(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      ProductCategory.DONUT,
      false
    );

    when(productRepository.findById(1L))
      .thenReturn(Optional.of(product));

    // Act
    productService.delete(1L);

    // Assert
    verify(productRepository).findById(1L);
    verify(productRepository).delete(product);
    verifyNoInteractions(productMapper);
  }

  @Test
  void deleteShouldThrowExceptionWhenDonutDoesNotExist() {
    // Arrange
    when(productRepository.findById(999L))
      .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
      ProductNotFoundException.class,
      () -> productService.delete(999L)
    );

    verify(productRepository).findById(999L);
    verify(productRepository, never()).delete(any(Product.class));
    verifyNoInteractions(productMapper);
  }
}
