-- Reviews table schema
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    taste INTEGER NOT NULL CHECK (taste BETWEEN 0 AND 100),
    ingredients INTEGER NOT NULL CHECK (ingredients BETWEEN 0 AND 100),
    ambiance INTEGER NOT NULL CHECK (ambiance BETWEEN 0 AND 100),
    pricing INTEGER NOT NULL CHECK (pricing BETWEEN 0 AND 100),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id, created_at);

-- Optional: Create a view for aggregated ratings (last month)
CREATE VIEW IF NOT EXISTS restaurant_ratings_month AS
SELECT 
    restaurant_id,
    AVG(taste) as avg_taste,
    AVG(ingredients) as avg_ingredients,
    AVG(ambiance) as avg_ambiance,
    AVG(pricing) as avg_pricing,
    COUNT(*) as review_count,
    (AVG(taste) + AVG(ingredients) + AVG(ambiance) + AVG(pricing)) / 4.0 as overall_score
FROM reviews
WHERE created_at >= datetime('now', '-1 month')
GROUP BY restaurant_id;

-- Optional: Create a view for aggregated ratings (last year)
CREATE VIEW IF NOT EXISTS restaurant_ratings_year AS
SELECT 
    restaurant_id,
    AVG(taste) as avg_taste,
    AVG(ingredients) as avg_ingredients,
    AVG(ambiance) as avg_ambiance,
    AVG(pricing) as avg_pricing,
    COUNT(*) as review_count,
    (AVG(taste) + AVG(ingredients) + AVG(ambiance) + AVG(pricing)) / 4.0 as overall_score
FROM reviews
WHERE created_at >= datetime('now', '-1 year')
GROUP BY restaurant_id;