package com.spacedonuts.product.controller;

import com.spacedonuts.product.dto.DonutResponse;
import com.spacedonuts.product.service.DonutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/donuts")
public class DonutController {

  private final DonutService donutService;

  public DonutController(DonutService donutService) {
    this.donutService = donutService;
  }

  @GetMapping
  public ResponseEntity<List<DonutResponse>> findAll() {
    return ResponseEntity.ok(donutService.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<DonutResponse> findById(@PathVariable Long id) {
    return donutService.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }
}
