package com.spacedonuts.order.messaging;


import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class OrderEventPublisher {

  private final RabbitTemplate rabbitTemplate;

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void publish(OrderPlacedEvent event) {

    rabbitTemplate.convertAndSend(
      OrderMessagingConfig.ORDER_EXCHANGE,
      OrderMessagingConfig.ORDER_RECEIVED_ROUTING_KEY,
      event
    );
  }
}

