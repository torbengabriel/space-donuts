
CREATE TABLE carts (
                     id BIGINT NOT NULL AUTO_INCREMENT,
                     keycloak_user_id VARCHAR(36) NOT NULL,
                     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                       ON UPDATE CURRENT_TIMESTAMP,

                     PRIMARY KEY (id),
                     CONSTRAINT uk_carts_keycloak_user_id
                       UNIQUE (keycloak_user_id)
);

CREATE TABLE cart_items (
                          id BIGINT NOT NULL AUTO_INCREMENT,
                          cart_id BIGINT NOT NULL,
                          product_id BIGINT NOT NULL,
                          quantity INT NOT NULL DEFAULT 1,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,

                          PRIMARY KEY (id),

                          CONSTRAINT fk_cart_items_cart
                            FOREIGN KEY (cart_id)
                              REFERENCES carts(id)
                              ON DELETE CASCADE,

                          CONSTRAINT fk_cart_items_product
                            FOREIGN KEY (product_id)
                              REFERENCES products(id)
                              ON DELETE RESTRICT,

                          CONSTRAINT uk_cart_items_cart_product
                            UNIQUE (cart_id, product_id),

                          CONSTRAINT chk_cart_items_quantity
                            CHECK (quantity > 0)
);

CREATE INDEX idx_cart_items_product_id
  ON cart_items(product_id);
