import pool from '../db.js';

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

            return res.status(200).json({ restaurant: rows[0] });
        }

        // Partial search functionality
        if (partial_restaurant) {
            const searchTerm = `%${partial_restaurant}%`;
            const [rows] = await pool.query(
                `SELECT * FROM restaurants WHERE name LIKE ? OR cuisine LIKE ? OR address LIKE ? LIMIT 5`,
                [searchTerm, searchTerm, searchTerm]
            );
            return res.status(200).json({ restaurants: rows });
        }

        const [rows] = await pool.query(`SELECT * FROM restaurants`);
        return res.status(200).json({ restaurants: rows });
    } catch (error) {
        console.error('Error in getting restaurants:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

export {
    getRestaurantsHandler
}