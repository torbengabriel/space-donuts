package com.spacedonuts.cart.repository;

import com.spacedonuts.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

  Optional<Cart> findByKeycloakUserId(String keycloakUserId);

  @Query("""
        SELECT DISTINCT c
        FROM Cart c
        LEFT JOIN FETCH c.items ci
        LEFT JOIN FETCH ci.product
        WHERE c.keycloakUserId = :userId
        """)
  Optional<Cart> findByKeycloakUserIdWithItems(
    @Param("userId") String userId
  );
}
