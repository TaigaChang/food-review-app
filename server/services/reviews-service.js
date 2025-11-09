import pool from '../db.js';
import Validations from "../validations/reviews-validation.js";

async function postReviewHandler(req, res) {
    const { user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment } = req.body;
    const userFields = { user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment };

    try {
        for (const field in userFields) {
            if (userFields[field] === undefined || userFields[field] === null) {
                return res.status(400).json({ message: `Missing field: ${field}` });
            }
        }

        for (const field in userFields) {
            const isValid = await Validations[field](userFields[field]);
            if (!isValid) {
                return res.status(400).json({ message: `Invalid field: ${field}` });
            }
        }

        const [results] = await pool.query(
            `INSERT INTO reviews (user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment]
        );

        return res.status(201).json({
            message: "Review created successfully",
            review_id: results.insertId,
        });
    }
    catch (error) {
        console.error('Error in posting review:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

/* Create a review getter based on specific times.*/
async function getRestaurantReviewHandler(req, res) {
    const restaurant_id = req.query.restaurant_id;
    const created_after = req.query.created_after;

    try {
        if (created_after) {
            const [rows] = await pool.query(
                `SELECT * FROM reviews WHERE restaurant_id = ? AND created_at >= ?`,
                [restaurant_id, created_after]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'Reviews not found' });
            }

            return res.status(200).json({ reviews: rows });
        }

        const [rows] = await pool.query(
            `SELECT * FROM reviews WHERE restaurant_id = ?`,
            [restaurant_id]
        );
        return res.status(200).json({ reviews: rows });
    } catch (error) {
        console.error('Error in getting reviews:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

export {
    postReviewHandler,
    getRestaurantReviewHandler
}