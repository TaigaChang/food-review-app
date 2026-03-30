import pool from '../db.js';
import Validations from "../validations/reviews-validation.js";
import { updateAggregatedRatings } from './aggregated-ratings-service.js';

async function postReviewHandler(req, res) {
    const { restaurant_id, taste, service, ambiance, price, comment } = req.body;
    const user_id = req.user?.id;
    const userFields = { user_id, restaurant_id, taste, service, ambiance, price, comment };

    try {
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
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
            `INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, restaurant_id, taste, service, ambiance, price, comment]
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
        
        if (isNaN(parseInt(restaurant_id))) {
            return res.status(400).json({ message: 'Restaurant ID must be a number' });
        }

        const params = created_after ? [restaurant_id, created_after] : [restaurant_id];
        const dateFilter = created_after ? 'AND r.created_at >= ?' : '';

        const [rows] = await pool.query(
            `SELECT 
                r.*,
                SUBSTRING_INDEX(u.name_first, ' ', 1) AS user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.restaurant_id = ? ${dateFilter}
            ORDER BY r.created_at DESC`,
            params
        );

        const [avgResult] = await pool.query(
            `SELECT 
                AVG(taste) AS avg_taste_alltime,
                AVG(service) AS avg_service_alltime,
                AVG(ambiance) AS avg_ambiance_alltime,
                AVG(price) AS avg_price_alltime
            FROM reviews r
            WHERE r.restaurant_id = ? ${dateFilter}`,
            params
        );

        if (!avgResult) {
            return res.status(404).json({ message: 'Reviews not found' });
        }

        return res.status(200).json({ averages: avgResult[0], reviews: rows || [] });

    } catch (error) {
        console.error('Error in getting reviews:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

/* Get all reviews for the current authenticated user */
async function getUserReviewsHandler(req, res) {
    const user_id = req.user?.id;

    try {
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const [rows] = await pool.query(
            `SELECT 
                r.*,
                res.name AS restaurant_name
            FROM reviews r
            JOIN restaurants res ON r.restaurant_id = res.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC`,
            [user_id]
        );

        return res.status(200).json({ reviews: rows || [] });

    } catch (error) {
        console.error('Error in getting user reviews:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

export {
    postReviewHandler,
    getRestaurantReviewHandler,
    getUserReviewsHandler
}