-- Database setup: Drop old schema, recreate with new 0-5 scale, load seed data

-- Drop old tables (in reverse dependency order)
DROP TABLE IF EXISTS monthly_aggregated_ratings;
DROP TABLE IF EXISTS aggregated_ratings;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_first VARCHAR(100) NOT NULL,
    name_last VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE INDEX idx_users_email ON users(email);

-- Create restaurants table
CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);

-- Create reviews table with new 0-5 scale
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    taste DECIMAL(3, 1) NOT NULL CHECK (taste BETWEEN 0 AND 5),
    service DECIMAL(3, 1) NOT NULL CHECK (service BETWEEN 0 AND 5),
    ambiance DECIMAL(3, 1) NOT NULL CHECK (ambiance BETWEEN 0 AND 5),
    price DECIMAL(3, 1) NOT NULL CHECK (price BETWEEN 0 AND 5),
    total DECIMAL(3, 1) GENERATED ALWAYS AS (ROUND(taste * 0.6 + service * 0.15 + ambiance * 0.15 + price * 0.1, 1)) STORED,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id, created_at);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at);

-- Create aggregated_ratings table
CREATE TABLE aggregated_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL UNIQUE,
    avg_taste_alltime DECIMAL(3, 2),
    avg_service_alltime DECIMAL(3, 2),
    avg_ambiance_alltime DECIMAL(3, 2),
    avg_price_alltime DECIMAL(3, 2),
    avg_overall_alltime DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Create monthly_aggregated_ratings table
CREATE TABLE monthly_aggregated_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    month_index INT NOT NULL COMMENT '1-60 months back from now',
    month_start DATE NOT NULL,
    avg_taste DECIMAL(3, 2),
    avg_service DECIMAL(3, 2),
    avg_ambiance DECIMAL(3, 2),
    avg_price DECIMAL(3, 2),
    avg_overall DECIMAL(3, 2),
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_restaurant_month (restaurant_id, month_index),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE INDEX idx_monthly_restaurant ON monthly_aggregated_ratings(restaurant_id);

-- Create views for common queries
CREATE OR REPLACE VIEW restaurant_ratings_month AS
SELECT 
    restaurant_id,
    AVG(taste) AS avg_taste,
    AVG(service) AS avg_service,
    AVG(ambiance) AS avg_ambiance,
    AVG(price) AS avg_price,
    AVG(total) AS avg_total,
    COUNT(*) AS review_count
FROM reviews
WHERE created_at >= (NOW() - INTERVAL 1 MONTH)
GROUP BY restaurant_id;

CREATE OR REPLACE VIEW restaurant_ratings_year AS
SELECT 
    restaurant_id,
    AVG(taste) AS avg_taste,
    AVG(service) AS avg_service,
    AVG(ambiance) AS avg_ambiance,
    AVG(price) AS avg_price,
    AVG(total) AS avg_total,
    COUNT(*) AS review_count
FROM reviews
WHERE created_at >= (NOW() - INTERVAL 1 YEAR)
GROUP BY restaurant_id;

-- Insert test users
INSERT INTO users (name_first, name_last, email, password) VALUES
('Alice', 'Johnson', 'alice@example.com', '$2b$10$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMzG'),
('Bob', 'Smith', 'bob@example.com', '$2b$10$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMzG'),
('Carol', 'Davis', 'carol@example.com', '$2b$10$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMzG'),
('Diana', 'Miller', 'diana@example.com', '$2b$10$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMzG'),
('Eric', 'Wilson', 'eric@example.com', '$2b$10$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMzG');

-- Insert restaurants
INSERT INTO restaurants (name, address, cuisine) VALUES
('Bella Italia', '123 Main St, Downtown', 'Italian'),
('Dragon Palace', '456 Oak Ave, Chinatown', 'Chinese'),
('Le Petit Bistro', '789 Elm St, West End', 'French'),
('Tokyo Ramen House', '234 Pine Rd, Arts District', 'Japanese'),
('Taco Fiesta', '567 Maple Dr, South Side', 'Mexican'),
('The Greek Taverna', '890 Cedar Ln, Waterfront', 'Greek'),
('Spice Route', '345 Birch Way, East Market', 'Indian');

-- Insert reviews with 0-5 scale ratings (taste, service, ambiance, price)
-- Restaurant 1: Bella Italia
INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES
(1, 1, 4.5, 4.0, 4.2, 3.8, 'Excellent pasta, friendly staff, romantic atmosphere'),
(2, 1, 4.2, 3.8, 4.0, 3.5, 'Good pizza, average service, nice ambiance'),
(3, 1, 4.8, 4.5, 4.5, 4.0, 'Outstanding! Best restaurant in the city'),
(4, 1, 3.9, 3.5, 3.8, 3.2, 'Decent food, slow service, pricey for what you get'),
(5, 1, 4.3, 4.2, 4.1, 3.7, 'Great experience overall, would come back');

-- Restaurant 2: Dragon Palace
INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES
(1, 2, 4.6, 4.3, 3.9, 3.5, 'Authentic flavors, quick service, simple decor'),
(2, 2, 4.4, 4.1, 3.8, 3.3, 'Fresh ingredients, attentive waitstaff'),
(3, 2, 4.2, 3.9, 3.5, 3.2, 'Good value for money'),
(4, 2, 4.7, 4.4, 4.0, 3.6, 'Best dim sum in town!'),
(5, 2, 4.5, 4.2, 3.7, 3.4, 'Consistently delicious');

-- Restaurant 3: Le Petit Bistro
INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES
(1, 3, 4.9, 4.7, 4.8, 4.5, 'Michelin-quality cooking, impeccable service, charming atmosphere'),
(2, 3, 4.7, 4.5, 4.6, 4.3, 'Very good French cuisine, professional staff'),
(3, 3, 4.8, 4.6, 4.7, 4.4, 'Romantic dinner spot, highly recommend'),
(4, 3, 4.6, 4.4, 4.5, 4.2, 'Expensive but worth it'),
(5, 3, 4.7, 4.5, 4.6, 4.2, 'Exquisite dining experience');

-- Restaurant 4: Tokyo Ramen House
INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES
(1, 4, 4.4, 4.0, 3.5, 3.1, 'Delicious ramen, limited seating'),
(2, 4, 4.5, 4.1, 3.6, 3.2, 'Rich broth, friendly owner'),
(3, 4, 4.6, 4.2, 3.7, 3.3, 'Best tonkotsu ramen nearby'),
(4, 4, 4.3, 3.9, 3.4, 3.0, 'Good but can get crowded'),
(5, 4, 4.5, 4.1, 3.6, 3.2, 'Worth the wait');

-- Restaurant 5: Taco Fiesta
INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES
(1, 5, 4.0, 3.8, 3.6, 2.8, 'Tasty tacos, casual vibe, budget-friendly'),
(2, 5, 4.2, 3.9, 3.7, 2.9, 'Great street tacos'),
(3, 5, 3.9, 3.7, 3.5, 2.7, 'Good for quick meal'),
(4, 5, 4.1, 3.8, 3.6, 2.8, 'Authentic flavors'),
(5, 5, 4.3, 4.0, 3.8, 3.0, 'Fun and delicious');

-- Restaurant 6: The Greek Taverna
INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES
(1, 6, 4.4, 4.2, 4.3, 3.8, 'Fantastic Greek food, lively atmosphere, good hospitality'),
(2, 6, 4.3, 4.1, 4.2, 3.7, 'Fresh fish, friendly service'),
(3, 6, 4.5, 4.3, 4.4, 3.9, 'Island vibes, excellent mezze platter'),
(4, 6, 4.2, 4.0, 4.1, 3.6, 'Good value'),
(5, 6, 4.4, 4.2, 4.3, 3.8, 'Always a pleasure');

-- Restaurant 7: Spice Route
INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES
(1, 7, 4.5, 4.1, 3.9, 3.6, 'Aromatic spices, expert preparation, warm welcome'),
(2, 7, 4.6, 4.2, 4.0, 3.7, 'Heat level perfect, flavorful curries'),
(3, 7, 4.4, 4.0, 3.8, 3.5, 'Traditional Indian recipes'),
(4, 7, 4.7, 4.3, 4.1, 3.8, 'Best biryani around'),
(5, 7, 4.5, 4.1, 3.9, 3.6, 'Consistently good');
