-- Restaurants table schema
CREATE TABLE IF NOT EXISTS restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- Index on cuisine type for filtering
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);

-- Optional: Add index on address for future location-based queries
-- (Spatial index requires a spatial data type like POINT)
-- CREATE INDEX idx_restaurants_address ON restaurants(address);