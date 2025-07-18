-- Create ENUM for user.type
CREATE TYPE user_type AS ENUM ('buyer', 'seller', 'admin');

-- User table
CREATE TABLE "user" (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    phone INT,
    address VARCHAR,
    type user_type NOT NULL
);

-- Category table
CREATE TABLE category (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    price INTEGER NOT NULL,
    description VARCHAR,
    category UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seller_id UUID NOT NULL,
    FOREIGN KEY (category) REFERENCES category(id),
    FOREIGN KEY (seller_id) REFERENCES "user"(id)
);

-- Cart table (one per user)
CREATE TABLE cart (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Cart items table (many-to-many between cart and products)
CREATE TABLE cart_items (
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Order table
CREATE TABLE "order" (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Order items table (many-to-many between order and products)
CREATE TABLE order_items (
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES "order"(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_email ON "user" (email);
CREATE INDEX idx_product_name ON products (name);
CREATE INDEX idx_category_name ON category (name);
CREATE INDEX idx_cart_user ON cart (user_id);
CREATE INDEX idx_order_user ON "order" (user_id);
