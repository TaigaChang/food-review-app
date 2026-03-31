import pool from '../db.js';
import { updateAggregatedRatings } from '../services/aggregated-ratings-service.js';

async function calculateAll() {
    try {
        console.log('Getting all restaurants...');
        const [restaurants] = await pool.query('SELECT id FROM restaurants');
        
        console.log(`Found ${restaurants.length} restaurants. Calculating aggregated ratings...`);
        
        for (const restaurant of restaurants) {
            console.log(`Calculating for restaurant ${restaurant.id}...`);
            await updateAggregatedRatings(restaurant.id);
        }
        
        console.log('✓ All aggregated ratings calculated!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

calculateAll();
