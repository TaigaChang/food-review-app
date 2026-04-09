import pool from '../db.js';

/**
 * Compute and upsert aggregated ratings for a restaurant
 * Called whenever a review is added, updated, or deleted
 */
async function updateAggregatedRatings(restaurantId) {
    try {
        const now = new Date();
        const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
        const oneDayMs = 24 * 60 * 60 * 1000;

        // Query 1: All-time averages
        const [allTimeData] = await pool.query(
            `SELECT
                COUNT(*) as count,
                AVG(taste) as avg_taste,
                AVG(service) as avg_service,
                AVG(ambiance) as avg_ambiance,
                AVG(price) as avg_price,
                AVG(total) as avg_total
            FROM reviews
            WHERE restaurant_id = ?`,
            [restaurantId]
        );

        const allTime = allTimeData[0];

        // Query 2: Loop through 60 months for graphing data
        const monthlyData = [];
        for (let months = 1; months <= 60; months++) {
            const startDate = new Date(now.getTime() - months * oneMonthMs);

            const [monthResult] = await pool.query(
                `SELECT
                    COUNT(*) as count,
                    AVG(taste) as avg_taste,
                    AVG(service) as avg_service,
                    AVG(ambiance) as avg_ambiance,
                    AVG(price) as avg_price,
                    AVG(total) as avg_total
                FROM reviews
                WHERE restaurant_id = ? AND created_at >= ?`,
                [restaurantId, startDate]
            );

            const monthData = {
                restaurant_id: restaurantId,
                month_index: months,
                month_start: startDate,
                ...monthResult[0]
            };

            monthlyData.push(monthData);
        }

        // Query 3: Loop through 30 days for daily graphing data
        const dailyData = [];
        for (let days = 1; days <= 30; days++) {
            const startDate = new Date(now.getTime() - days * oneDayMs);

            const [dayResult] = await pool.query(
                `SELECT
                    COUNT(*) as count,
                    AVG(taste) as avg_taste,
                    AVG(service) as avg_service,
                    AVG(ambiance) as avg_ambiance,
                    AVG(price) as avg_price,
                    AVG(total) as avg_total
                FROM reviews
                WHERE restaurant_id = ? AND created_at >= ?`,
                [restaurantId, startDate]
            );

            const dayData = {
                restaurant_id: restaurantId,
                day_index: days,
                day_start: startDate,
                ...dayResult[0]
            };

            dailyData.push(dayData);
        }

        // Upsert aggregated_ratings (all-time only)
        await pool.query(
            `INSERT INTO aggregated_ratings (
                restaurant_id,
                avg_taste_alltime, avg_service_alltime, avg_ambiance_alltime, avg_price_alltime, avg_overall_alltime, review_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                avg_taste_alltime = VALUES(avg_taste_alltime),
                avg_service_alltime = VALUES(avg_service_alltime),
                avg_ambiance_alltime = VALUES(avg_ambiance_alltime),
                avg_price_alltime = VALUES(avg_price_alltime),
                avg_overall_alltime = VALUES(avg_overall_alltime),
                review_count = VALUES(review_count),
                updated_at = CURRENT_TIMESTAMP`,
            [
                restaurantId,
                allTime.avg_taste, allTime.avg_service, allTime.avg_ambiance, allTime.avg_price, allTime.avg_total, allTime.count
            ]
        );

        // Save all 60 months to monthly_aggregated_ratings
        for (const month of monthlyData) {
            await pool.query(
                `INSERT INTO monthly_aggregated_ratings (
                    restaurant_id, month_index, month_start,
                    avg_taste, avg_service, avg_ambiance, avg_price, avg_overall, review_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    avg_taste = VALUES(avg_taste),
                    avg_service = VALUES(avg_service),
                    avg_ambiance = VALUES(avg_ambiance),
                    avg_price = VALUES(avg_price),
                    avg_overall = VALUES(avg_overall),
                    review_count = VALUES(review_count)`,
                [
                    month.restaurant_id,
                    month.month_index,
                    month.month_start,
                    month.avg_taste, month.avg_service, month.avg_ambiance, month.avg_price, month.avg_total,
                    month.count
                ]
            );
        }

        // Save all 30 days to daily_aggregated_ratings
        for (const day of dailyData) {
            await pool.query(
                `INSERT INTO daily_aggregated_ratings (
                    restaurant_id, day_index, day_start,
                    avg_taste, avg_service, avg_ambiance, avg_price, avg_overall, review_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    avg_taste = VALUES(avg_taste),
                    avg_service = VALUES(avg_service),
                    avg_ambiance = VALUES(avg_ambiance),
                    avg_price = VALUES(avg_price),
                    avg_overall = VALUES(avg_overall),
                    review_count = VALUES(review_count)`,
                [
                    day.restaurant_id,
                    day.day_index,
                    day.day_start,
                    day.avg_taste, day.avg_service, day.avg_ambiance, day.avg_price, day.avg_total,
                    day.count
                ]
            );
        }

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
            // Return default zero ratings for restaurants with no reviews
            return {
                avg_taste: 0,
                avg_service: 0,
                avg_ambiance: 0,
                avg_price: 0,
                avg_overall_alltime: 0,
                review_count: 0
            };
        }

        const row = rows[0];
        // Map database column names to match frontend expectations
        // Convert string values to numbers
        return {
            avg_taste: Number(row.avg_taste_alltime),
            avg_service: Number(row.avg_service_alltime),
            avg_ambiance: Number(row.avg_ambiance_alltime),
            avg_price: Number(row.avg_price_alltime),
            avg_overall_alltime: Number(row.avg_overall_alltime),
            review_count: Number(row.review_count || 0)
        };
    } catch (error) {
        console.error('Error fetching aggregated ratings:', error);
        throw error;
    }
}

/**
 * Get 60 months of aggregated data for graphing
 */
async function getMonthlyAggregatedRatings(restaurantId) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM monthly_aggregated_ratings 
            WHERE restaurant_id = ? 
            ORDER BY month_index ASC`,
            [restaurantId]
        );

        return rows;
    } catch (error) {
        console.error('Error fetching monthly aggregated ratings:', error);
        throw error;
    }
}

/**
 * Get 30 days of aggregated data for graphing
 */
async function getDailyAggregatedRatings(restaurantId) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM daily_aggregated_ratings 
            WHERE restaurant_id = ? 
            ORDER BY day_index ASC`,
            [restaurantId]
        );

        return rows;
    } catch (error) {
        console.error('Error fetching daily aggregated ratings:', error);
        throw error;
    }
}

export {
    updateAggregatedRatings,
    getAggregatedRatings,
    getMonthlyAggregatedRatings,
    getDailyAggregatedRatings
};
