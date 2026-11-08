package com.spacedonuts.product.controller;

import com.spacedonuts.product.dto.DonutCreateRequest;
import com.spacedonuts.product.dto.DonutResponse;
import com.spacedonuts.product.service.DonutService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
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
    return ResponseEntity.ok(donutService.findById(id));
  }

  @PostMapping
  public ResponseEntity<DonutResponse> create(
    @Valid @RequestBody DonutCreateRequest request
  ) {
    DonutResponse createdDonut = donutService.create(request);

    URI location = URI.create("/api/donuts/" + createdDonut.id());

    return ResponseEntity.created(location).body(createdDonut);
  }
}
