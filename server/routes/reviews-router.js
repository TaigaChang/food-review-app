// Placeholder for reviews routes: POST /api/reviews (protected), GET /api/reviews/restaurant/:id
// TODO: implement handlers to add reviews and list reviews for a restaurant.

import express from 'express';
import { postReviewHandler, getRestaurantReviewHandler } from '../services/reviews-service.js';
import authenticateToken from '../middleware/authenticate_token.js';
const router = express.Router();

router.post('/', authenticateToken, postReviewHandler);

router.get('/restaurant', getRestaurantReviewHandler);

export default router;

