import pool from '../db.js';

/**
 * Compute and upsert aggregated ratings for a restaurant
 * Called whenever a review is added, updated, or deleted
 */
async function updateAggregatedRatings(restaurantId) {
    try {
        // Get current timestamp for period calculations
        const now = new Date();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

        // Query 1: All-time averages
        const [allTimeData] = await pool.query(
            `SELECT
                COUNT(*) as count,
                AVG(taste) as avg_taste,
                AVG(ingredients) as avg_ingredients,
                AVG(ambiance) as avg_ambiance,
                AVG(pricing) as avg_pricing,
                ROUND((AVG(taste) + AVG(ingredients) + AVG(ambiance) + AVG(pricing)) / 4, 2) as avg_overall
            FROM reviews
            WHERE restaurant_id = ?`,
            [restaurantId]
        );

        // Query 2: 1-year averages
        const [oneYearData] = await pool.query(
            `SELECT
                COUNT(*) as count,
                AVG(taste) as avg_taste,
                AVG(ingredients) as avg_ingredients,
                AVG(ambiance) as avg_ambiance,
                AVG(pricing) as avg_pricing,
                ROUND((AVG(taste) + AVG(ingredients) + AVG(ambiance) + AVG(pricing)) / 4, 2) as avg_overall
            FROM reviews
            WHERE restaurant_id = ? AND created_at >= ?`,
            [restaurantId, oneYearAgo]
        );

        // Query 3: 1-month averages
        const [oneMonthData] = await pool.query(
            `SELECT
                COUNT(*) as count,
                AVG(taste) as avg_taste,
                AVG(ingredients) as avg_ingredients,
                AVG(ambiance) as avg_ambiance,
                AVG(pricing) as avg_pricing,
                ROUND((AVG(taste) + AVG(ingredients) + AVG(ambiance) + AVG(pricing)) / 4, 2) as avg_overall
            FROM reviews
            WHERE restaurant_id = ? AND created_at >= ?`,
            [restaurantId, oneMonthAgo]
        );

        const allTime = allTimeData[0];
        const oneYear = oneYearData[0];
        const oneMonth = oneMonthData[0];

        // Upsert aggregated_ratings
        await pool.query(
            `INSERT INTO aggregated_ratings (
                restaurant_id,
                avg_taste_alltime, avg_ingredients_alltime, avg_ambiance_alltime, avg_pricing_alltime, avg_overall_alltime,
                avg_taste_1year, avg_ingredients_1year, avg_ambiance_1year, avg_pricing_1year, avg_overall_1year,
                avg_taste_1month, avg_ingredients_1month, avg_ambiance_1month, avg_pricing_1month, avg_overall_1month,
                review_count_alltime, review_count_1year, review_count_1month
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                avg_taste_alltime = ?, avg_ingredients_alltime = ?, avg_ambiance_alltime = ?, avg_pricing_alltime = ?, avg_overall_alltime = ?,
                avg_taste_1year = ?, avg_ingredients_1year = ?, avg_ambiance_1year = ?, avg_pricing_1year = ?, avg_overall_1year = ?,
                avg_taste_1month = ?, avg_ingredients_1month = ?, avg_ambiance_1month = ?, avg_pricing_1month = ?, avg_overall_1month = ?,
                review_count_alltime = ?, review_count_1year = ?, review_count_1month = ?,
                last_updated = CURRENT_TIMESTAMP`,
            [
                // INSERT values
                restaurantId,
                allTime.avg_taste, allTime.avg_ingredients, allTime.avg_ambiance, allTime.avg_pricing, allTime.avg_overall,
                oneYear.avg_taste, oneYear.avg_ingredients, oneYear.avg_ambiance, oneYear.avg_pricing, oneYear.avg_overall,
                oneMonth.avg_taste, oneMonth.avg_ingredients, oneMonth.avg_ambiance, oneMonth.avg_pricing, oneMonth.avg_overall,
                allTime.count, oneYear.count, oneMonth.count,
                // UPDATE values (duplicates)
                allTime.avg_taste, allTime.avg_ingredients, allTime.avg_ambiance, allTime.avg_pricing, allTime.avg_overall,
                oneYear.avg_taste, oneYear.avg_ingredients, oneYear.avg_ambiance, oneYear.avg_pricing, oneYear.avg_overall,
                oneMonth.avg_taste, oneMonth.avg_ingredients, oneMonth.avg_ambiance, oneMonth.avg_pricing, oneMonth.avg_overall,
                allTime.count, oneYear.count, oneMonth.count
            ]
        );

        console.log(`✓ Updated aggregated ratings for restaurant ${restaurantId}`);
    } catch (error) {
        console.error('Error updating aggregated ratings:', error);
        throw error;
    }
}

/**
 * Get aggregated ratings for a restaurant
 */
async function getAggregatedRatings(restaurantId) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM aggregated_ratings WHERE restaurant_id = ?`,
            [restaurantId]
        );

        if (!rows || rows.length === 0) {
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error('Error fetching aggregated ratings:', error);
        throw error;
    }
}

export {
    updateAggregatedRatings,
    getAggregatedRatings
};
