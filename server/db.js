import mysql from "mysql2/promise";

const isProduction = process.env.NODE_ENV === "production";

console.log('[DB] Initializing database connection...');

let config;

try {
  if (isProduction && process.env.DATABASE_URL) {
    console.log('[DB] Using Railway DATABASE_URL...');
    // Parse Railway DATABASE_URL (mysql://user:password@host:port/database)
    const url = new URL(process.env.DATABASE_URL);
    config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
    };
    console.log(`[DB] Connecting to ${config.host}:${config.port}/${config.database}`);
  } else {
    console.log('[DB] Using local development config...');
    // Local development
    config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "food_review_app",
    };
    console.log(`[DB] Connecting to ${config.host}/${config.database}`);
  }
} catch (error) {
  console.error('[DB] ❌ Config parsing error:', error.message);
  console.error('[DB] Stack:', error.stack);
  // Fallback to local
  config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "food_review_app",
  };
  console.log('[DB] Using fallback config: localhost/food_review_app');
}

console.log('[DB] Creating connection pool...');

const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log('[DB] Connection pool created. Testing connection...');

// Test connection on startup (always test in production to catch errors)
pool.query('SELECT COUNT(*) as cnt FROM restaurants')
  .then(([rows]) => {
    console.log(`[DB] ✅ Connected successfully! Found ${rows[0].cnt} restaurants`);
  })
  .catch(err => {
    console.error(`[DB] ⚠️  Connection test failed:`, err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('[DB] ❌ Access denied - check DATABASE_URL or credentials');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('[DB] ❌ Database does not exist');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('[DB] ❌ Connection refused - database server not available');
    }
    // Don't exit - app can still start even if DB is temporarily unavailable
  });

export default pool;
