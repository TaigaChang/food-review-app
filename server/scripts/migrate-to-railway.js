import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config();

// Parse Railway DATABASE_URL or use provided credentials
function getConnectionConfig() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl && dbUrl.includes('mysql')) {
    // Parse DATABASE_URL format: mysql://user:password@host:port/database
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }

  // Use provided config or environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'railway',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

async function migrateToProduction() {
  let pool;
  try {
    const config = getConnectionConfig();
    console.log(`🔌 Connecting to database: ${config.host}:${config.port}/${config.database}`);
    
    pool = mysql.createPool(config);
    const connection = await pool.getConnection();
    
    console.log('✅ Connected to production database');

    // Get the path to the SQL data file
    const sqlDataPath = path.join(import.meta.url.replace('file://', ''), '..', 'production-data.sql');
    const sqlDataFile = '/Users/taiga/Desktop/Food Review App/food-review-app/server/scripts/production-data.sql';
    
    if (!fs.existsSync(sqlDataFile)) {
      throw new Error(`SQL data file not found: ${sqlDataFile}`);
    }

    console.log('📁 Reading data file...');
    const sqlData = fs.readFileSync(sqlDataFile, 'utf8');

    // Split SQL commands
    const commands = sqlData
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    console.log(`📝 Found ${commands.length} SQL commands to execute`);

    // Disable foreign key checks for data insertion
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔓 Disabled foreign key checks');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await connection.execute('DELETE FROM reviews');
    await connection.execute('DELETE FROM restaurants');
    await connection.execute('DELETE FROM users');
    await connection.execute('DELETE FROM aggregated_ratings');
    await connection.execute('DELETE FROM monthly_aggregated_ratings');
    await connection.execute('DELETE FROM daily_aggregated_ratings');
    console.log('✓ Cleared old data');

    // Execute all SQL commands
    let executed = 0;
    for (const command of commands) {
      try {
        await connection.execute(command);
        executed++;
        if (executed % 100 === 0) {
          console.log(`  ✓ ${executed}/${commands.length} commands executed`);
        }
      } catch (error) {
        console.error(`  ✗ Error executing command: ${error.message}`);
        console.error(`    Command: ${command.substring(0, 100)}...`);
      }
    }

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔒 Re-enabled foreign key checks');

    // Verify counts
    const [restaurants] = await connection.execute('SELECT COUNT(*) as cnt FROM restaurants');
    const [reviews] = await connection.execute('SELECT COUNT(*) as cnt FROM reviews');
    const [users] = await connection.execute('SELECT COUNT(*) as cnt FROM users');
    const [aggregated] = await connection.execute('SELECT COUNT(*) as cnt FROM aggregated_ratings');
    const [monthly] = await connection.execute('SELECT COUNT(*) as cnt FROM monthly_aggregated_ratings');
    const [daily] = await connection.execute('SELECT COUNT(*) as cnt FROM daily_aggregated_ratings');

    console.log('\n📊 Migration Complete!');
    console.log('==================================================');
    console.log(`✅ Restaurants: ${restaurants[0][0].cnt}`);
    console.log(`✅ Reviews: ${reviews[0][0].cnt}`);
    console.log(`✅ Users: ${users[0][0].cnt}`);
    console.log(`✅ Aggregated Ratings: ${aggregated[0][0].cnt}`);
    console.log(`✅ Monthly Aggregated: ${monthly[0][0].cnt}`);
    console.log(`✅ Daily Aggregated: ${daily[0][0].cnt}`);
    console.log('==================================================\n');

    connection.release();
    await pool.end();

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateToProduction();
