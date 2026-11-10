CREATE TABLE product_variants (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        product_id BIGINT NOT NULL,
        name VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,

        CONSTRAINT fk_product_variants_product
          FOREIGN KEY (product_id)
            REFERENCES products(id)
            ON DELETE CASCADE,

        CONSTRAINT uk_product_variant_name
          UNIQUE (product_id, name)
);
