package com.spacedonuts.order.controller;

import com.spacedonuts.order.dto.response.OrderResponse;
import com.spacedonuts.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @PostMapping("/checkout")
  public OrderResponse checkout(
    @AuthenticationPrincipal Jwt jwt
  ) {
    return orderService.checkout(jwt.getSubject());
  }
}
