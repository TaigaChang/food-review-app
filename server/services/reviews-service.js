import pool from '../db.js';
import Validations from "../validations/reviews-validation.js";
import { updateAggregatedRatings } from './aggregated-ratings-service.js';

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

        // Update aggregated ratings for this restaurant
        await updateAggregatedRatings(restaurant_id);

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

/* Get restaurant reviews with optional date filter and rating averages */
async function getRestaurantReviewHandler(req, res) {
    const { restaurant_id, created_after } = req.query;

    try {
        if (!restaurant_id) {
            return res.status(400).json({ message: 'Missing restaurant_id query parameter' });
        }

        const params = created_after ? [restaurant_id, created_after] : [restaurant_id];
        const dateFilter = created_after ? 'AND r.created_at >= ?' : '';

        const [rows] = await pool.query(
            `SELECT 
                r.*,
                CONCAT(u.name_first, ' ', u.name_last) AS user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.restaurant_id = ? ${dateFilter}
            ORDER BY r.created_at DESC`,
            params
        );

        const [avgResult] = await pool.query(
            `SELECT 
                AVG(taste) AS avg_taste,
                AVG(ingredients) AS avg_ingredients,
                AVG(ambiance) AS avg_ambiance,
                AVG(pricing) AS avg_pricing
            FROM reviews
            WHERE restaurant_id = ? ${dateFilter}`,
            params
        );

        if (!rows?.length || !avgResult) {
            return res.status(404).json({ message: 'Reviews not found' });
        }

        const totalAverage =
            Object.values(avgResult[0]).reduce((sum, val) => Number(sum) + Number(val), 0) /
            Object.values(avgResult[0]).length;

        return res.status(200).json({ totalAverage: totalAverage, averages: avgResult[0], reviews: rows });

    } catch (error) {
        console.error('Error in getting reviews:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

export {
    postReviewHandler,
    getRestaurantReviewHandler
}