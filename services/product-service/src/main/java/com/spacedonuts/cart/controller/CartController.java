package com.spacedonuts.cart.controller;

import com.spacedonuts.cart.dto.CartResponse;
import com.spacedonuts.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
