package com.spacedonuts.order.messaging;

import com.spacedonuts.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderEventConsumer {

  private final OrderService orderService;

  @RabbitListener(
    queues = OrderMessagingConfig.ORDER_RECEIVED_QUEUE
  )
  public void consume(OrderPlacedEvent event) {

    log.info("New Order received: {}", event.orderNumber());
    log.info("Order value: {}", event.totalPrice());

    orderService.markAsProcessing(event.orderId());
  }
}
