package com.spacedonuts.product.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 150)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(name = "image_url", length = 500)
  private String imageUrl;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 250)
  private ProductCategory category;

  @Column(nullable = false)
  private boolean vegan = false;

  @Column(nullable = false)
  private boolean available = true;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  protected Product() {
  }

  public Product(
    String name,
    String description,
    BigDecimal price,
    String imageUrl,
    ProductCategory category,
    boolean vegan
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.vegan = vegan;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public ProductCategory getCategory() {
    return category;
  }

  public boolean isVegan() {
    return vegan;
  }

  public boolean isAvailable() {
    return available;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public void setCategory(ProductCategory category) {
    this.category = category;
  }

  public void setVegan(boolean vegan) {
    this.vegan = vegan;
  }
}
