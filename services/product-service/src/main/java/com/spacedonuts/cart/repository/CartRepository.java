package com.spacedonuts.cart.repository;

import com.spacedonuts.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

  Optional<Cart> findByKeycloakUserId(String keycloakUserId);
}
