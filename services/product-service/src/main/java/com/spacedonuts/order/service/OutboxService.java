package com.spacedonuts.order.service;

import com.spacedonuts.order.entity.OutboxEvent;
import com.spacedonuts.order.messaging.OrderPlacedEvent;
import com.spacedonuts.order.repository.OutboxEventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.core.JacksonException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OutboxService {

  private final OutboxEventRepository outboxRepository;
  private final JsonMapper jsonMapper;

  public void saveOrderPlacedEvent(OrderPlacedEvent event) {

    try {
      OutboxEvent outboxEvent = new OutboxEvent();

      outboxEvent.setEventId(UUID.randomUUID().toString());
      outboxEvent.setAggregateType("ORDER");
      outboxEvent.setAggregateId(event.orderId().toString());
      outboxEvent.setEventType("OrderPlacedEvent");
      outboxEvent.setPayload(
        jsonMapper.writeValueAsString(event)
      );
      outboxEvent.setCreatedAt(Instant.now());

      outboxRepository.save(outboxEvent);

    } catch (JacksonException exception) {
      throw new IllegalStateException(
        "Could not serialize order event", exception
      );
    }
  }

  @Transactional
  public void markAsPublished(OutboxEvent event) {
    event.setPublishedAt(Instant.now());
    outboxRepository.save(event);
  }
}
