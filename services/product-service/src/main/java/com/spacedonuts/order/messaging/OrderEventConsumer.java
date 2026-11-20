package com.spacedonuts.order.messaging;

import com.spacedonuts.notification.entity.Notification;
import com.spacedonuts.notification.entity.NotificationType;
import com.spacedonuts.notification.service.NotificationService;
import com.spacedonuts.order.service.NotificationSender;
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
  private final NotificationService notificationService;
  private final NotificationSender notificationSender;

  @RabbitListener(
    queues = OrderMessagingConfig.ORDER_RECEIVED_QUEUE
  )
  public void consume(OrderPlacedEvent event) {

    log.info("New Order received: {}", event.orderNumber());

    boolean orderProcessing = orderService.markAsProcessing(
      event.orderId()
    );

    if (!orderProcessing) {
      return;
    }

    Notification notification = notificationService.createNotification(
      event.keycloakUserId(),
      "Order is being processed",
      "Your order " + event.orderNumber()
        + " has been received and is now being processed.",
      NotificationType.ORDER_PROCESSING
    );

    log.info(
      "Notification created for order {}",
      event.orderNumber()
    );
    notificationSender.send(notification);
  }
}
