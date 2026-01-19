-- Insert test restaurants
INSERT INTO restaurants (name, address, cuisine, created_at) VALUES
('Sakura Sushi', '123 Main St, Downtown', 'Japanese', NOW()),
('La Bella Italia', '456 Oak Ave, Midtown', 'Italian', NOW()),
('Dragon Palace', '789 Park Blvd, Uptown', 'Chinese', NOW()),
('El Mariachi', '321 River Rd, Westside', 'Mexican', NOW()),
('Thai Orchid', '654 Forest Ln, Eastside', 'Thai', NOW());

-- Insert test reviews for Sakura Sushi (Restaurant 1)
INSERT INTO reviews (user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment, created_at) VALUES
(10, 1, 95, 90, 85, 80, 'Excellent sushi! Fresh fish and skilled preparation.', NOW() - INTERVAL 5 DAY),
(11, 1, 88, 85, 80, 75, 'Good quality but a bit pricey.', NOW() - INTERVAL 3 DAY),
(12, 1, 92, 89, 88, 78, 'Amazing experience. Will definitely come back.', NOW() - INTERVAL 1 DAY);

-- Insert test reviews for La Bella Italia (Restaurant 2)
INSERT INTO reviews (user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment, created_at) VALUES
(10, 2, 85, 82, 90, 85, 'Authentic Italian cuisine. Lovely ambiance.', NOW() - INTERVAL 4 DAY),
(11, 2, 80, 78, 85, 80, 'Good pasta but could use better sauce.', NOW() - INTERVAL 2 DAY),
(12, 2, 87, 84, 92, 83, 'Romantic place, perfect for date night.', NOW() - INTERVAL 1 DAY);

-- Insert test reviews for Dragon Palace (Restaurant 3)
INSERT INTO reviews (user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment, created_at) VALUES
(10, 3, 78, 75, 70, 65, 'Decent Chinese food. Could be fresher.', NOW() - INTERVAL 6 DAY),
(11, 3, 82, 80, 75, 70, 'Good taste but portions are small.', NOW() - INTERVAL 4 DAY),
(13, 3, 85, 83, 72, 68, 'Improved recently! Better quality ingredients.', NOW() - INTERVAL 2 DAY);

-- Insert test reviews for El Mariachi (Restaurant 4)
INSERT INTO reviews (user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment, created_at) VALUES
(10, 4, 90, 88, 80, 75, 'Authentic Mexican flavors! Love it.', NOW() - INTERVAL 7 DAY),
(11, 4, 92, 90, 85, 80, 'Best tacos in town. Fresh ingredients.', NOW() - INTERVAL 3 DAY),
(13, 4, 88, 86, 82, 78, 'Friendly staff and great food.', NOW() - INTERVAL 1 DAY);

-- Insert test reviews for Thai Orchid (Restaurant 5)
INSERT INTO reviews (user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment, created_at) VALUES
(10, 5, 84, 80, 88, 82, 'Authentic Thai with beautiful decor.', NOW() - INTERVAL 5 DAY),
(11, 5, 86, 82, 90, 85, 'Great pad thai and friendly service.', NOW() - INTERVAL 3 DAY),
(14, 5, 80, 78, 85, 80, 'Good but a bit overpriced.', NOW() - INTERVAL 1 DAY);
