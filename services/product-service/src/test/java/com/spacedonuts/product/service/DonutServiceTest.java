package com.spacedonuts.product.service;

import com.spacedonuts.product.dto.DonutCreateRequest;
import com.spacedonuts.product.dto.DonutResponse;
import com.spacedonuts.product.entity.Donut;
import com.spacedonuts.product.exception.DonutNotFoundException;
import com.spacedonuts.product.mapper.DonutMapper;
import com.spacedonuts.product.repository.DonutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonutServiceTest {

  @Mock
  private DonutRepository donutRepository;

  @Mock
  private DonutMapper donutMapper;

  @InjectMocks
  private DonutService donutService;

  @BeforeEach
  void setUp() {
    // Hier können wir später gemeinsame Testdaten vorbereiten.
  }

  @Test
  void findByIdShouldReturnDonut() {
    // Arrange
    Donut donut1 = new Donut(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false
    );

    DonutResponse response1 = new DonutResponse(
      1L,
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false,
      true,
      LocalDateTime.now()
    );

    when(donutRepository.findById(1L))
      .thenReturn(Optional.of(donut1));

    when(donutMapper.toResponse(donut1))
      .thenReturn(response1);

    // Act
    DonutResponse result = donutService.findById(1L);

    // Assert
    assertEquals(response1, result);

    verify(donutRepository).findById(1L);
    verify(donutMapper).toResponse(donut1);
  }

  @Test
  void findAllShouldReturnAllDonuts() {
    // Arrange
    Donut donut1 = new Donut(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false
    );

    Donut donut2 = new Donut(
      "Saturn's Ring",
      "Vanilla donut with colorful sprinkles",
      new BigDecimal("3.50"),
      "/images/donuts/saturns-ring.png",
      true
    );

    DonutResponse response1 = new DonutResponse(
      1L, "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false, true, LocalDateTime.now()
    );

    DonutResponse response2 = new DonutResponse(
      2L, "Saturn's Ring",
      "Vanilla donut with colorful sprinkles",
      new BigDecimal("3.50"),
      "/images/donuts/saturns-ring.png",
      true, true, LocalDateTime.now()
    );

    when(donutRepository.findAll())
      .thenReturn(List.of(donut1, donut2));

    when(donutMapper.toResponse(donut1)).thenReturn(response1);
    when(donutMapper.toResponse(donut2)).thenReturn(response2);

    // Act
    List<DonutResponse> result = donutService.findAll();

    // Assert
    assertEquals(2, result.size());
    assertEquals(List.of(response1, response2), result);

    verify(donutRepository).findAll();
    verify(donutMapper).toResponse(donut1);
    verify(donutMapper).toResponse(donut2);
  }

  @Test
  void findByIdShouldThrowExceptionWhenDonutDoesNotExist() {
    // Arrange
    when(donutRepository.findById(999L))
      .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
      DonutNotFoundException.class,
      () -> donutService.findById(999L)
    );

    verify(donutRepository).findById(999L);
    verifyNoInteractions(donutMapper);
  }

  @Test
  void createDonutShouldCreateDonut() {
    // Arrange
    Donut donut = new Donut(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false
    );

    DonutCreateRequest request = new DonutCreateRequest(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false
    );

    DonutResponse response = new DonutResponse(
      1L,
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false,
      true,
      LocalDateTime.now()
    );

    when(donutMapper.toEntity(request)).thenReturn(donut);
    when(donutRepository.save(donut)).thenReturn(donut);
    when(donutMapper.toResponse(donut)).thenReturn(response);

    // Act
    DonutResponse result = donutService.create(request);

    // Assert
    assertEquals(response, result);

    verify(donutMapper).toEntity(request);
    verify(donutMapper).toResponse(donut);

    // catch Repository-Call
    ArgumentCaptor<Donut> captor = ArgumentCaptor.forClass(Donut.class);

    verify(donutRepository).save(captor.capture());

    Donut capturedDonut = captor.getValue();

    assertEquals("Black Hole Brownie", capturedDonut.getName());
    assertEquals(new BigDecimal("4.50"), capturedDonut.getPrice());
    assertFalse(capturedDonut.isVegan());
  }

  @Test
  void updateShouldUpdateExistingDonut() {
    // Arrange
    Donut donut = new Donut(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false
    );

    DonutCreateRequest request = new DonutCreateRequest(
      "Updated Donut",
      "Updated description",
      new BigDecimal("5.50"),
      "/images/donuts/updated-donut.png",
      true
    );

    DonutResponse expectedResponse = new DonutResponse(
      1L,
      "Updated Donut",
      "Updated description",
      new BigDecimal("5.50"),
      "/images/donuts/updated-donut.png",
      true,
      true,
      LocalDateTime.now()
    );

    when(donutRepository.findById(1L))
      .thenReturn(Optional.of(donut));

    when(donutMapper.toResponse(donut))
      .thenReturn(expectedResponse);

    // Act
    DonutResponse result = donutService.update(1L, request);

    // Assert
    assertEquals(expectedResponse, result);

    assertEquals("Updated Donut", donut.getName());
    assertEquals("Updated description", donut.getDescription());
    assertEquals(new BigDecimal("5.50"), donut.getPrice());
    assertEquals("/images/donuts/updated-donut.png", donut.getImageUrl());
    assertTrue(donut.isVegan());

    verify(donutRepository).findById(1L);
    verify(donutMapper).toResponse(donut);
  }

  @Test
  void updateShouldThrowExceptionWhenDonutDoesNotExist() {
    // Arrange
    DonutCreateRequest request = new DonutCreateRequest(
      "Updated Donut",
      "Updated description",
      new BigDecimal("5.50"),
      "/images/donuts/updated-donut.png",
      true
    );

    when(donutRepository.findById(999L))
      .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
      DonutNotFoundException.class,
      () -> donutService.update(999L, request)
    );

    verify(donutRepository).findById(999L);
    verifyNoInteractions(donutMapper);
  }

  @Test
  void deleteShouldDeleteExistingDonut() {
    // Arrange
    Donut donut = new Donut(
      "Black Hole Brownie",
      "Chocolate donut with brownie pieces",
      new BigDecimal("4.50"),
      "/images/donuts/black-hole-brownie.png",
      false
    );

    when(donutRepository.findById(1L))
      .thenReturn(Optional.of(donut));

    // Act
    donutService.delete(1L);

    // Assert
    verify(donutRepository).findById(1L);
    verify(donutRepository).delete(donut);
    verifyNoInteractions(donutMapper);
  }

  @Test
  void deleteShouldThrowExceptionWhenDonutDoesNotExist() {
    // Arrange
    when(donutRepository.findById(999L))
      .thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
      DonutNotFoundException.class,
      () -> donutService.delete(999L)
    );

    verify(donutRepository).findById(999L);
    verify(donutRepository, never()).delete(any());
    verifyNoInteractions(donutMapper);
  }
}
