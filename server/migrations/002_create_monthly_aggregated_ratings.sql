-- Create monthly_aggregated_ratings table to store 60 months of aggregated data for graphing

CREATE TABLE IF NOT EXISTS monthly_aggregated_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    month_index INT NOT NULL,
    month_start DATETIME NOT NULL,
    
    -- Monthly averages (out of 5)
    avg_taste DECIMAL(3, 2),
    avg_service DECIMAL(3, 2),
    avg_ambiance DECIMAL(3, 2),
    avg_price DECIMAL(3, 2),
    avg_overall DECIMAL(3, 2),
    
    -- Metadata
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_restaurant_month (restaurant_id, month_index)
) ENGINE = InnoDB;

-- Index for querying by restaurant
CREATE INDEX idx_monthly_restaurant ON monthly_aggregated_ratings(restaurant_id, month_index);
