package com.spacedonuts.cart.service;

import com.spacedonuts.cart.dto.CartResponse;
import com.spacedonuts.cart.entity.Cart;
import com.spacedonuts.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

  private final CartRepository cartRepository;

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

  private CartResponse mapToResponse(Cart cart) {
    // Mapping folgt im nächsten Schritt
    return null;
  }
}
