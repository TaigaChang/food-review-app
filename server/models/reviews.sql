-- Reviews table schema
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    taste INT NOT NULL CHECK (taste BETWEEN 0 AND 100),
    ingredients INT NOT NULL CHECK (ingredients BETWEEN 0 AND 100),
    ambiance INT NOT NULL CHECK (ambiance BETWEEN 0 AND 100),
    pricing INT NOT NULL CHECK (pricing BETWEEN 0 AND 100),
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
    AVG(ingredients) AS avg_ingredients,
    AVG(ambiance) AS avg_ambiance,
    AVG(pricing) AS avg_pricing,
    COUNT(*) AS review_count,
    (AVG(taste) + AVG(ingredients) + AVG(ambiance) + AVG(pricing)) / 4.0 AS overall_score
FROM reviews
WHERE created_at >= (NOW() - INTERVAL 1 MONTH)
GROUP BY restaurant_id;

-- Optional: Create a view for aggregated ratings (last year)
CREATE OR REPLACE VIEW restaurant_ratings_year AS
SELECT 
    restaurant_id,
    AVG(taste) AS avg_taste,
    AVG(ingredients) AS avg_ingredients,
    AVG(ambiance) AS avg_ambiance,
    AVG(pricing) AS avg_pricing,
    COUNT(*) AS review_count,
    (AVG(taste) + AVG(ingredients) + AVG(ambiance) + AVG(pricing)) / 4.0 AS overall_score
FROM reviews
WHERE created_at >= (NOW() - INTERVAL 1 YEAR)
GROUP BY restaurant_id;