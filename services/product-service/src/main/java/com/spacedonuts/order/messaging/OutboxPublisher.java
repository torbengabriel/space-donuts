package com.spacedonuts.order.messaging;

import com.spacedonuts.order.entity.OutboxEvent;
import com.spacedonuts.order.repository.OutboxEventRepository;
import com.spacedonuts.order.service.OutboxService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisher {

  private final OutboxEventRepository outboxRepository;
  private final OutboxService outboxService;
  private final RabbitTemplate rabbitTemplate;
  private final JsonMapper jsonMapper;

  @Scheduled(fixedDelay = 5000)
  public void publishPendingEvents() {

    List<OutboxEvent> events =
      outboxRepository.findTop50ByPublishedAtIsNullOrderByCreatedAtAsc();

    for (OutboxEvent event : events) {
      try {
        OrderPlacedEvent orderEvent = jsonMapper.readValue(
          event.getPayload(),
          OrderPlacedEvent.class
        );

        CorrelationData correlationData =
          new CorrelationData(event.getEventId());

        rabbitTemplate.convertAndSend(
          OrderMessagingConfig.ORDER_EXCHANGE,
          OrderMessagingConfig.ORDER_RECEIVED_ROUTING_KEY,
          orderEvent,
          correlationData
        );

        CorrelationData.Confirm confirm = correlationData
          .getFuture()
          .get(5, TimeUnit.SECONDS);

        var returned = correlationData.getReturned();

        if (!confirm.ack()) {
          log.warn("RabbitMQ NACK for event {}", event.getEventId());
          continue;
        }

        if (returned != null) {
          log.error(
            "Message was returned! Reply: {}, routing key: {}",
            returned.getReplyText(),
            returned.getRoutingKey()
          );
          continue;
        }

        outboxService.markAsPublished(event);

        log.info(
          "Published order event: {}",
          event.getEventId()
        );

      } catch (Exception exception) {
        log.error(
          "Could not publish outbox event: {}",
          event.getEventId(),
          exception
        );
      }
    }
  }
}
