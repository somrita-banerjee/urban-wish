CREATE TYPE order_status AS ENUM ('payment_pending', 'order_placed', 'payment_failed', 'order_cancelled');

ALTER TABLE "order"
    ADD COLUMN status order_status DEFAULT 'payment_pending';