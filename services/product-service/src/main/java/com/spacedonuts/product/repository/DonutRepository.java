package com.spacedonuts.product.repository;

import com.spacedonuts.product.entity.Donut;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonutRepository extends JpaRepository<Donut, Long> {
}
