import mysql from 'mysql2/promise';

const productionConfig = {
  host: 'hopper.proxy.rlwy.net',
  user: 'root',
  password: 'ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl',
  database: 'railway',
  port: 38843,
};

const localConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'food_review_app',
};

async function migrateData() {
  let localPool, prodPool;
  
  try {
    console.log('🔌 Connecting to databases...');
    localPool = mysql.createPool(localConfig);
    prodPool = mysql.createPool(productionConfig);
    
    // Test connections
    await localPool.getConnection();
    const prodConn = await prodPool.getConnection();
    console.log('✅ Connected to both databases\n');
    
    // Clear production data
    console.log('🗑️  Clearing production data...');
    await prodConn.execute('SET FOREIGN_KEY_CHECKS = 0');
    await prodConn.execute('DELETE FROM reviews');
    await prodConn.execute('DELETE FROM restaurants');
    await prodConn.execute('DELETE FROM users');
    await prodConn.execute('DELETE FROM aggregated_ratings');
    await prodConn.execute('DELETE FROM monthly_aggregated_ratings');
    await prodConn.execute('DELETE FROM daily_aggregated_ratings');
    await prodConn.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Cleared\n');
    
    // Copy users
    console.log('👤 Importing users...');
    const [users] = await localPool.query('SELECT * FROM users');
    for (const user of users) {
      await prodConn.execute(
        'INSERT INTO users (id, email, password, name_first, name_last, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, user.email, user.password, user.name_first, user.name_last, user.created_at]
      );
    }
    console.log(`✓ ${users.length} users imported\n`);
    
    // Copy restaurants
    console.log('🍽️  Importing restaurants...');
    const [restaurants] = await localPool.query('SELECT * FROM restaurants');
    for (const rest of restaurants) {
      await prodConn.execute(
        'INSERT INTO restaurants (id, name, address, cuisine, created_at, phone, image_url, hours, rating_source, about) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [rest.id, rest.name, rest.address, rest.cuisine, rest.created_at, rest.phone, rest.image_url, rest.hours, rest.rating_source, rest.about]
      );
    }
    console.log(`✓ ${restaurants.length} restaurants imported\n`);
    
    // Copy reviews in batches
    console.log('⭐ Importing reviews...');
    const [reviews] = await localPool.query('SELECT * FROM reviews');
    
    const reviewBatchSize = 500;
    for (let i = 0; i < reviews.length; i += reviewBatchSize) {
      const batch = reviews.slice(i, i + reviewBatchSize);
      const values = batch.map(r => [r.id, r.user_id, r.restaurant_id, r.taste, r.service, r.ambiance, r.price, r.comment, r.created_at]);
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
      const flatValues = values.flat();
      
      await prodConn.execute(
        `INSERT INTO reviews (id, user_id, restaurant_id, taste, service, ambiance, price, comment, created_at) VALUES ${placeholders}`,
        flatValues
      );
    }
    console.log(`✓ ${reviews.length} reviews imported\n`);
    
    // Copy aggregated ratings
    console.log('📊 Importing aggregated ratings...');
    const [aggregated] = await localPool.query('SELECT * FROM aggregated_ratings');
    for (const agg of aggregated) {
      await prodConn.execute(
        'INSERT INTO aggregated_ratings (id, restaurant_id, avg_taste_alltime, avg_service_alltime, avg_ambiance_alltime, avg_price_alltime, avg_overall_alltime, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [agg.id, agg.restaurant_id, agg.avg_taste_alltime, agg.avg_service_alltime, agg.avg_ambiance_alltime, agg.avg_price_alltime, agg.avg_overall_alltime, agg.review_count]
      );
    }
    console.log(`✓ ${aggregated.length} aggregated ratings imported\n`);
    
    // Copy monthly ratings in batches
    console.log('📅 Importing monthly ratings...');
    const [monthly] = await localPool.query('SELECT * FROM monthly_aggregated_ratings');
    
    // Batch insert (500 at a time)
    const batchSize = 500;
    for (let i = 0; i < monthly.length; i += batchSize) {
      const batch = monthly.slice(i, i + batchSize);
      const values = batch.map(m => [m.id, m.restaurant_id, m.month_index, m.month_start, m.avg_taste, m.avg_service, m.avg_ambiance, m.avg_price, m.avg_overall, m.review_count]);
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
      const flatValues = values.flat();
      
      await prodConn.execute(
        `INSERT INTO monthly_aggregated_ratings (id, restaurant_id, month_index, month_start, avg_taste, avg_service, avg_ambiance, avg_price, avg_overall, review_count) VALUES ${placeholders}`,
        flatValues
      );
    }
    console.log(`✓ ${monthly.length} monthly ratings imported\n`);
    
    // Copy daily ratings in batches
    console.log('📆 Importing daily ratings...');
    const [daily] = await localPool.query('SELECT * FROM daily_aggregated_ratings');
    
    for (let i = 0; i < daily.length; i += batchSize) {
      const batch = daily.slice(i, i + batchSize);
      const values = batch.map(d => [d.id, d.restaurant_id, d.day_index, d.day_start, d.avg_taste, d.avg_service, d.avg_ambiance, d.avg_price, d.avg_overall, d.review_count]);
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
      const flatValues = values.flat();
      
      await prodConn.execute(
        `INSERT INTO daily_aggregated_ratings (id, restaurant_id, day_index, day_start, avg_taste, avg_service, avg_ambiance, avg_price, avg_overall, review_count) VALUES ${placeholders}`,
        flatValues
      );
    }
    console.log(`✓ ${daily.length} daily ratings imported\n`);
    
    prodConn.release();
    
    console.log('='.repeat(50));
    console.log('✅ MIGRATION COMPLETE!');
    console.log('='.repeat(50));
    console.log(`📊 Data synced to production:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Restaurants: ${restaurants.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - Aggregated Ratings: ${aggregated.length}`);
    console.log(`   - Monthly Ratings: ${monthly.length}`);
    console.log(`   - Daily Ratings: ${daily.length}`);
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await localPool?.end();
    await prodPool?.end();
  }
}

migrateData();
