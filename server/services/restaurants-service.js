import pool from '../db.js';

async function getRestaurantsHandler(req, res, next) {
    const restaurantId = req.params.id;
    try {
        if (restaurantId) {
            const [rows] = await pool.query(
                `SELECT * FROM restaurants WHERE id = ?`,
                [restaurantId]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            return res.status(200).json({ restaurant: rows[0] });
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