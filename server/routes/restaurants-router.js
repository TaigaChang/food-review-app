import express from 'express';
import { getRestaurantsHandler } from '../services/restaurants-service.js';
import { getAggregatedRatings } from '../services/aggregated-ratings-service.js';
const router = express.Router();

router.get('/', getRestaurantsHandler);

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

router.get('/:id', getRestaurantsHandler);

export default router;