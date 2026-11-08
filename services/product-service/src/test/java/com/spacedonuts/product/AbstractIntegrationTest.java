package com.spacedonuts.product;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.mysql.MySQLContainer;

@Testcontainers
public abstract class AbstractIntegrationTest {

  @Container
  @ServiceConnection
  static final MySQLContainer mysql =
    new MySQLContainer("mysql:8.4");
}
