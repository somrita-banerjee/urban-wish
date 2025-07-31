CREATE TABLE payment (
    gateway_order_id TEXT NOT NULL,
    order_id UUID NOT NULL,
    payment_id TEXT,
    signature TEXT,
    details JSONB,
    PRIMARY KEY (gateway_order_id),
    FOREIGN KEY (order_id) REFERENCES "order"(id)
);