import express from 'express';
import { getRestaurantsHandler } from '../services/restaurants-service.js';
import { getAggregatedRatings, getMonthlyAggregatedRatings, getDailyAggregatedRatings } from '../services/aggregated-ratings-service.js';
const router = express.Router();

router.get('/', getRestaurantsHandler);

// More specific routes BEFORE generic /:id route
router.get('/aggregated/:id', async (req, res, next) => {
    const restaurantId = req.params.id;
    try {
        const ratings = await getAggregatedRatings(restaurantId);
        return res.status(200).json({ ratings });
    } catch (error) {
        console.error('Error fetching aggregated ratings:', error);
        return res.status(500).json({ message: error.message });
    }
});

router.get('/monthly/:id', async (req, res, next) => {
    const restaurantId = req.params.id;
    try {
        const monthlyRatings = await getMonthlyAggregatedRatings(restaurantId);
        return res.status(200).json({ monthlyRatings: monthlyRatings || [] });
    } catch (error) {
        console.error('Error fetching monthly aggregated ratings:', error);
        return res.status(500).json({ message: error.message });
    }
});

router.get('/daily/:id', async (req, res, next) => {
    const restaurantId = req.params.id;
    try {
        const dailyRatings = await getDailyAggregatedRatings(restaurantId);
        return res.status(200).json({ dailyRatings: dailyRatings || [] });
    } catch (error) {
        console.error('Error fetching daily aggregated ratings:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Generic route AFTER specific ones
router.get('/:id', getRestaurantsHandler);

export default router;