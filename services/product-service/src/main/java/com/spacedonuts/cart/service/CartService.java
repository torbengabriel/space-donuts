package com.spacedonuts.cart.service;

import com.spacedonuts.cart.dto.request.CartItemCreateRequest;
import com.spacedonuts.cart.dto.request.CartItemUpdateRequest;
import com.spacedonuts.cart.dto.response.CartItemResponse;
import com.spacedonuts.cart.dto.response.CartResponse;
import com.spacedonuts.cart.entity.Cart;
import com.spacedonuts.cart.entity.CartItem;
import com.spacedonuts.cart.repository.CartRepository;
import com.spacedonuts.product.entity.Product;
import com.spacedonuts.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

  private final CartRepository cartRepository;
  private final ProductRepository productRepository;

  public CartResponse getCart(String keycloakUserId) {

    Cart cart = cartRepository
      .findByKeycloakUserId(keycloakUserId)
      .orElseGet(() -> {
        Cart newCart = new Cart();
        newCart.setKeycloakUserId(keycloakUserId);
        return cartRepository.save(newCart);
      });

    return mapToResponse(cart);
  }

  @Transactional
  public CartResponse addItem(
    String keycloakUserId,
    CartItemCreateRequest request
  ) {
    Cart cart = getOrCreateCart(keycloakUserId);

    Product product = productRepository.findById(request.productId())
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "Product not found"
      ));

    if (!product.isAvailable()) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "Product is not available"
      );
    }

    CartItem existingItem = cart.getItems().stream()
      .filter(item -> item.getProduct().getId().equals(product.getId()))
      .findFirst()
      .orElse(null);

    if (existingItem != null) {
      existingItem.setQuantity(
        existingItem.getQuantity() + request.quantity()
      );
    } else {
      CartItem cartItem = new CartItem();
      cartItem.setProduct(product);
      cartItem.setQuantity(request.quantity());

      cart.addItem(cartItem);
    }

    return mapToResponse(cart);
  }

  @Transactional
  public CartResponse updateQuantity(
    String keycloakUserId,
    Long itemId,
    CartItemUpdateRequest request
  ) {
    Cart cart = getCartEntity(keycloakUserId);

    CartItem item = findCartItem(cart, itemId);

    item.setQuantity(request.quantity());

    return mapToResponse(cart);
  }

  @Transactional
  public CartResponse removeItem(String keycloakUserId, Long itemId) {
    Cart cart = getCartEntity(keycloakUserId);

    CartItem item = findCartItem(cart, itemId);

    cart.removeItem(item);

    return mapToResponse(cart);
  }

  @Transactional
  public void clearCart(String keycloakUserId) {
    Cart cart = getCartEntity(keycloakUserId);

    cart.getItems().clear();
  }

  private Cart getOrCreateCart(String keycloakUserId) {
    return cartRepository.findByKeycloakUserIdWithItems(keycloakUserId)
      .orElseGet(() -> {
        Cart cart = new Cart();
        cart.setKeycloakUserId(keycloakUserId);
        return cartRepository.save(cart);
      });
  }

  private Cart getCartEntity(String keycloakUserId) {
    return cartRepository.findByKeycloakUserIdWithItems(keycloakUserId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "Cart not found"
      ));
  }

  private CartItem findCartItem(Cart cart, Long itemId) {
    return cart.getItems().stream()
      .filter(item -> item.getId().equals(itemId))
      .findFirst()
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "Cart item not found"
      ));
  }

  private CartResponse mapToResponse(Cart cart) {
    List<CartItemResponse> items = cart.getItems().stream()
      .map(item -> {
        Product product = item.getProduct();

        BigDecimal subtotal = product.getPrice()
          .multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartItemResponse(
          item.getId(),
          product.getId(),
          product.getName(),
          product.getImageUrl(),
          product.getPrice(),
          item.getQuantity(),
          subtotal
        );
      })
      .toList();

    int totalItems = items.stream()
      .mapToInt(CartItemResponse::quantity)
      .sum();

    BigDecimal totalPrice = items.stream()
      .map(CartItemResponse::subtotal)
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    return new CartResponse(
      cart.getId(),
      items,
      totalItems,
      totalPrice
    );
  }
}
