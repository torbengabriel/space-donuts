package com.spacedonuts.order.messaging;


import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OrderMessagingConfig {

  public static final String ORDER_EXCHANGE = "space-donuts.orders";
  public static final String ORDER_RECEIVED_QUEUE = "order.received";
  public static final String ORDER_RECEIVED_ROUTING_KEY = "order.received";

  @Bean
  public TopicExchange orderExchange() {
    return new TopicExchange(ORDER_EXCHANGE);
  }

  @Bean
  public Queue orderReceivedQueue() {
    return QueueBuilder
      .durable(ORDER_RECEIVED_QUEUE)
      .build();
  }

  @Bean
  public Binding orderReceivedBinding(
    Queue orderReceivedQueue,
    TopicExchange orderExchange
  ) {
    return BindingBuilder
      .bind(orderReceivedQueue)
      .to(orderExchange)
      .with(ORDER_RECEIVED_ROUTING_KEY);
  }

  @Bean
  public MessageConverter messageConverter() {
    return new JacksonJsonMessageConverter();
  }
}
