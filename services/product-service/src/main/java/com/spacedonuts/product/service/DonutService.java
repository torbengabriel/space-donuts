package com.spacedonuts.product.service;

import com.spacedonuts.product.dto.DonutCreateRequest;
import com.spacedonuts.product.dto.DonutResponse;
import com.spacedonuts.product.entity.Donut;
import com.spacedonuts.product.exception.DonutNotFoundException;
import com.spacedonuts.product.mapper.DonutMapper;
import com.spacedonuts.product.repository.DonutRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

  public DonutResponse findById(Long id) {
    Donut donut = donutRepository.findById(id)
      .orElseThrow(() -> new DonutNotFoundException(id));

    return donutMapper.toResponse(donut);
  }

  public DonutResponse create(DonutCreateRequest request) {
    Donut donut = donutMapper.toEntity(request);

    Donut savedDonut = donutRepository.save(donut);

    return donutMapper.toResponse(savedDonut);
  }
}
