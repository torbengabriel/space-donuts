package com.spacedonuts.order.entity;

import com.spacedonuts.order.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String orderNumber;

  @Column(nullable = false)
  private String keycloakUserId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrderStatus status;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal totalPrice;

  @Column(nullable = false)
  private Instant createdAt;

  @OneToMany(
    mappedBy = "order",
    cascade = CascadeType.ALL,
    orphanRemoval = true
  )
  private List<OrderItem> items = new ArrayList<>();

  public void addItem(OrderItem item) {
    items.add(item);
    item.setOrder(this);
  }
}
