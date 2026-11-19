CREATE TABLE orders (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(50) NOT NULL UNIQUE,
      keycloak_user_id VARCHAR(255) NOT NULL,
      status VARCHAR(30) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP NOT NULL
);

CREATE TABLE order_items (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       order_id BIGINT NOT NULL,
       product_id BIGINT NOT NULL,
       product_name VARCHAR(255) NOT NULL,
       price DECIMAL(10, 2) NOT NULL,
       quantity INT NOT NULL,
       subtotal DECIMAL(10, 2) NOT NULL,

       CONSTRAINT fk_order_items_order
         FOREIGN KEY (order_id)
           REFERENCES orders(id)
);
