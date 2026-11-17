package com.spacedonuts.cart.controller;

import com.spacedonuts.cart.dto.request.CartItemCreateRequest;
import com.spacedonuts.cart.dto.request.CartItemUpdateRequest;
import com.spacedonuts.cart.dto.response.CartResponse;
import com.spacedonuts.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;

  @GetMapping
  public CartResponse getCart(
    @AuthenticationPrincipal Jwt jwt) {

    String keycloakUserId = jwt.getSubject();

    return cartService.getCart(keycloakUserId);
  }

  @PostMapping("/items")
  public CartResponse addItem(
    @AuthenticationPrincipal Jwt jwt,
    @Valid @RequestBody CartItemCreateRequest request
  ) {
    return cartService.addItem(
      jwt.getSubject(),
      request
    );
  }

  @PatchMapping("/items/{itemId}")
  public CartResponse updateQuantity(
    @AuthenticationPrincipal Jwt jwt,
    @PathVariable Long itemId,
    @Valid @RequestBody CartItemUpdateRequest request
  ) {
    return cartService.updateQuantity(
      jwt.getSubject(),
      itemId,
      request
    );
  }

  @DeleteMapping("/items/{itemId}")
  public CartResponse removeItem(
    @AuthenticationPrincipal Jwt jwt,
    @PathVariable Long itemId
  ) {
    return cartService.removeItem(
      jwt.getSubject(),
      itemId
    );
  }

  @DeleteMapping
  public void clearCart(
    @AuthenticationPrincipal Jwt jwt
  ) {
    cartService.clearCart(jwt.getSubject());
  }
}
