-- Reviews table schema
CREATE TABLE IF NOT EXISTS reviews (
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

-- Indexes for frequent queries
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id, created_at);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at);

-- Optional: Create a view for aggregated ratings (last month)
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

-- Optional: Create a view for aggregated ratings (last year)
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