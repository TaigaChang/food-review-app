-- Create aggregated_ratings table to store pre-computed average ratings
-- This table caches average ratings per restaurant for 1-month, 1-year, and all-time periods

CREATE TABLE IF NOT EXISTS aggregated_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    
    -- 1-month averages
    avg_taste_1month DECIMAL(5, 2),
    avg_ingredients_1month DECIMAL(5, 2),
    avg_ambiance_1month DECIMAL(5, 2),
    avg_pricing_1month DECIMAL(5, 2),
    avg_overall_1month DECIMAL(5, 2),
    
    -- 1-year averages
    avg_taste_1year DECIMAL(5, 2),
    avg_ingredients_1year DECIMAL(5, 2),
    avg_ambiance_1year DECIMAL(5, 2),
    avg_pricing_1year DECIMAL(5, 2),
    avg_overall_1year DECIMAL(5, 2),
    
    -- All-time averages
    avg_taste_alltime DECIMAL(5, 2),
    avg_ingredients_alltime DECIMAL(5, 2),
    avg_ambiance_alltime DECIMAL(5, 2),
    avg_pricing_alltime DECIMAL(5, 2),
    avg_overall_alltime DECIMAL(5, 2),
    
    -- Metadata
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    review_count_1month INT DEFAULT 0,
    review_count_1year INT DEFAULT 0,
    review_count_alltime INT DEFAULT 0,
    
    -- Foreign key
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant (restaurant_id)
);
