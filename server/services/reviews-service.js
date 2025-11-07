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
            `INSERT INTO reviews (user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment) VALUES (?, ?, ?, ?)`,
            [user_id, restaurant_id, taste, ingredients, ambiance, pricing, comment, createdAt]
        );

        return res.status(201).json({
            message: "User created successfully",
            user_id: results.insertId,
        });
    }
    catch (error) {
        console.error('Error in posting review:', error);
        return res.status(500).json({ message: error.sqlMessage || error.message });
    }
}

async function getRestaurantReviewHandler(req, res) {
}

export {
    postReviewHandler,
    getRestaurantReviewHandler
}