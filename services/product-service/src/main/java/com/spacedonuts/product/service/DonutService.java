package com.spacedonuts.product.service;

import com.spacedonuts.product.dto.DonutResponse;
import com.spacedonuts.product.mapper.DonutMapper;
import com.spacedonuts.product.repository.DonutRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonutService {

  private final DonutRepository donutRepository;
  private final DonutMapper donutMapper;

  public DonutService(DonutRepository donutRepository, DonutMapper donutMapper) {
    this.donutRepository = donutRepository;
    this.donutMapper = donutMapper;
  }

  public List<DonutResponse> findAll() {
    return donutRepository.findAll()
      .stream()
      .map(donutMapper::toResponse)
      .toList();
  }

  public Optional<DonutResponse> findById(Long id) {
    return donutRepository.findById(id)
      .map(donutMapper::toResponse);
  }
}
