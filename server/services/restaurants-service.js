import pool from '../db.js';

// Replace old API key with new one in image URLs
function replaceApiKey(restaurants) {
    const oldKey = 'AIzaSyC9SLNXEQG8y8Y1Tuj3FYgEgyNUfSgGWnc';
    const newKey = 'AIzaSyAu0jZBgqfC0ce09G-bxGoWeTlq2EnwILQ';
    
    console.log('[API_KEY_REPLACE] Old key:', oldKey.substring(0, 10) + '...', 'New key:', newKey.substring(0, 10) + '...');
    console.log('[API_KEY_REPLACE] process.env.GOOGLE_PLACES_API_KEY:', process.env.GOOGLE_PLACES_API_KEY ? 'SET' : 'NOT SET');
    
    if (Array.isArray(restaurants)) {
        return restaurants.map(restaurant => ({
            ...restaurant,
            image_url: restaurant.image_url?.replace(oldKey, newKey) || null
        }));
    } else if (restaurants) {
        return {
            ...restaurants,
            image_url: restaurants.image_url?.replace(oldKey, newKey) || null
        };
    }
    return restaurants;
}

async function getRestaurantsHandler(req, res, next) {
    const restaurant_id = req.params.id;
    const { partial_restaurant } = req.query;
    
    try {
        if (restaurant_id) {
            const [rows] = await pool.query(
                `SELECT * FROM restaurants WHERE id = ?`,
                [restaurant_id]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            return res.status(200).json({ restaurant: replaceApiKey(rows[0]) });
        }

        // Partial search functionality
        if (partial_restaurant) {
            const searchTerm = `%${partial_restaurant}%`;
            const [rows] = await pool.query(
                `SELECT * FROM restaurants WHERE name LIKE ? OR cuisine LIKE ? OR address LIKE ? LIMIT 5`,
                [searchTerm, searchTerm, searchTerm]
            );
            return res.status(200).json({ restaurants: replaceApiKey(rows) });
        }

        const [rows] = await pool.query(`SELECT * FROM restaurants`);
        return res.status(200).json({ restaurants: replaceApiKey(rows) });
    } catch (error) {
        console.error('Error fetching restaurants:', error.message);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

export {
    getRestaurantsHandler
}