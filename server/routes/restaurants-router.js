import express from 'express';
import { getRestaurantsHandler } from '../services/restaurants-service.js';
const router = express.Router();

router.get('/', getRestaurantsHandler);

router.get('/:id', getRestaurantsHandler);

export default router;