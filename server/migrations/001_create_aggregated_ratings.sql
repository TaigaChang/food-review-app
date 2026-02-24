-- Create aggregated_ratings table to store pre-computed average ratings
-- This table caches average ratings per restaurant for all-time period

CREATE TABLE IF NOT EXISTS aggregated_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    
    -- All-time averages (out of 5)
    avg_taste_alltime DECIMAL(3, 2),
    avg_service_alltime DECIMAL(3, 2),
    avg_ambiance_alltime DECIMAL(3, 2),
    avg_price_alltime DECIMAL(3, 2),
    avg_overall_alltime DECIMAL(3, 2),
    
    -- Metadata
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    review_count_alltime INT DEFAULT 0,
    
    -- Foreign key
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant (restaurant_id)
);
