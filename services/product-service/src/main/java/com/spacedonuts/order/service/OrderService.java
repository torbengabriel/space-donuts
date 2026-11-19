package com.spacedonuts.order.service;

import com.spacedonuts.cart.entity.Cart;
import com.spacedonuts.cart.entity.CartItem;
import com.spacedonuts.cart.repository.CartRepository;
import com.spacedonuts.order.dto.response.OrderItemResponse;
import com.spacedonuts.order.dto.response.OrderResponse;
import com.spacedonuts.order.entity.Order;
import com.spacedonuts.order.entity.OrderItem;
import com.spacedonuts.order.enums.OrderStatus;
import com.spacedonuts.order.messaging.OrderPlacedEvent;
import com.spacedonuts.order.repository.OrderRepository;
import com.spacedonuts.product.entity.Product;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {

  private final CartRepository cartRepository;
  private final OrderRepository orderRepository;

  private final OutboxService outboxService;

  @Transactional
  public OrderResponse checkout(String keycloakUserId) {

    Cart cart = cartRepository
      .findByKeycloakUserIdWithItems(keycloakUserId)
      .orElseThrow(() -> new EntityNotFoundException(
        "Cart not found"
      ));

    if (cart.getItems().isEmpty()) {
      throw new IllegalStateException("Cart is empty");
    }

    Order order = new Order();
    order.setOrderNumber(generateOrderNumber());
    order.setKeycloakUserId(keycloakUserId);
    order.setStatus(OrderStatus.RECEIVED);
    order.setCreatedAt(Instant.now());

    BigDecimal totalPrice = BigDecimal.ZERO;

    for (CartItem cartItem : cart.getItems()) {

      Product product = cartItem.getProduct();

      if (!product.isAvailable()) {
        throw new IllegalStateException(
          "Product is not available: " + product.getName()
        );
      }

      BigDecimal subtotal = product.getPrice()
        .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

      OrderItem orderItem = new OrderItem();
      orderItem.setProductId(product.getId());
      orderItem.setProductName(product.getName());
      orderItem.setPrice(product.getPrice());
      orderItem.setQuantity(cartItem.getQuantity());
      orderItem.setSubtotal(subtotal);

      order.addItem(orderItem);

      totalPrice = totalPrice.add(subtotal);
    }

    order.setTotalPrice(totalPrice);

    Order savedOrder = orderRepository.save(order);

    cart.getItems().clear();

    OrderPlacedEvent event = new OrderPlacedEvent(
      savedOrder.getId(),
      savedOrder.getOrderNumber(),
      savedOrder.getKeycloakUserId(),
      savedOrder.getTotalPrice(),
      savedOrder.getCreatedAt()
    );

    outboxService.saveOrderPlacedEvent(event);

    return mapToResponse(savedOrder);
  }

  private String generateOrderNumber() {
    return "SD-" + UUID.randomUUID()
      .toString()
      .substring(0, 8)
      .toUpperCase();
  }

  private OrderResponse mapToResponse(Order order) {
    List<OrderItemResponse> items = order.getItems().stream()
      .map(item -> new OrderItemResponse(
        item.getProductId(),
        item.getProductName(),
        item.getPrice(),
        item.getQuantity(),
        item.getSubtotal()
      ))
      .toList();

    return new OrderResponse(
      order.getId(),
      order.getOrderNumber(),
      order.getStatus(),
      order.getTotalPrice(),
      order.getCreatedAt(),
      items
    );
  }

  @Transactional
  public void markAsProcessing(Long orderId) {
    Order order = orderRepository.findById(orderId)
      .orElseThrow(() -> new EntityNotFoundException(
        "Order not found: " + orderId
      ));

    if (order.getStatus() != OrderStatus.RECEIVED) {
      log.info(
        "Order {} is already in status {}",
        order.getOrderNumber(),
        order.getStatus()
      );
      return;
    }

    order.setStatus(OrderStatus.PROCESSING);

    log.info(
      "Order {} status changed to PROCESSING",
      order.getOrderNumber()
    );
  }
}
