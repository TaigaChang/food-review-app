import express from 'express';
import { getRestaurantsHandler } from '../services/restaurants-service.js';
import { getAggregatedRatings, getMonthlyAggregatedRatings, getDailyAggregatedRatings } from '../services/aggregated-ratings-service.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        console.log('[RESTAURANTS] GET / - Fetching all restaurants');
        const result = await getRestaurantsHandler(req, res, next);
        console.log('[RESTAURANTS] GET / - Success');
        return result;
    } catch (error) {
        console.error('[RESTAURANTS] GET / - Error:', error.message);
        console.error('[RESTAURANTS] Error details:', error);
        return res.status(500).json({ 
            message: 'Error fetching restaurants',
            error: error.message 
        });
    }
});

// More specific routes BEFORE generic /:id route
router.get('/aggregated/:id', async (req, res, next) => {
    const restaurantId = req.params.id;
    try {
        const ratings = await getAggregatedRatings(restaurantId);
        if (!ratings) {
            return res.status(404).json({ message: 'No ratings found for this restaurant' });
        }
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
        if (!monthlyRatings || monthlyRatings.length === 0) {
            return res.status(404).json({ message: 'No monthly ratings found for this restaurant' });
        }
        return res.status(200).json({ monthlyRatings });
    } catch (error) {
        console.error('Error fetching monthly aggregated ratings:', error);
        return res.status(500).json({ message: error.message });
    }
});

router.get('/daily/:id', async (req, res, next) => {
    const restaurantId = req.params.id;
    try {
        const dailyRatings = await getDailyAggregatedRatings(restaurantId);
        if (!dailyRatings || dailyRatings.length === 0) {
            return res.status(404).json({ message: 'No daily ratings found for this restaurant' });
        }
        return res.status(200).json({ dailyRatings });
    } catch (error) {
        console.error('Error fetching daily aggregated ratings:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Generic route AFTER specific ones
router.get('/:id', getRestaurantsHandler);

export default router;