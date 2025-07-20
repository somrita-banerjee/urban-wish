-- dropping cart_items and cart  table if it exists
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart;

-- Cart items table (many-to-many between cart and products)
CREATE TABLE cart_items (
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_cart_items_user ON cart_items (user_id);