import mysql from "mysql2/promise";

const productionPool = mysql.createPool({
  host: "hopper.proxy.rlwy.net",
  port: 38843,
  user: "root",
  password: "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl",
  database: "railway",
});

async function setupProductionDatabase() {
  try {
    console.log("⚙️  Setting up production database schema...\n");

    // Create users table
    console.log("👥 Creating users table...");
    await productionPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_first VARCHAR(100) NOT NULL,
        name_last VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE = InnoDB
    `);
    console.log("✅ Users table created\n");

    // Create restaurants table
    console.log("🍽️  Creating restaurants table...");
    await productionPool.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        cuisine VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE = InnoDB
    `);
    try {
      await productionPool.query(`
        CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine)
      `);
    } catch (err) {
      // Index might already exist
    }
    console.log("✅ Restaurants table created\n");

    // Create reviews table
    console.log("⭐ Creating reviews table...");
    await productionPool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        restaurant_id INT NOT NULL,
        taste DECIMAL(2, 1) DEFAULT 3.0,
        service DECIMAL(2, 1) DEFAULT 3.0,
        ambiance DECIMAL(2, 1) DEFAULT 3.0,
        price DECIMAL(2, 1) DEFAULT 3.0,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      ) ENGINE = InnoDB
    `);
    console.log("✅ Reviews table created\n");

    // Create aggregated ratings table
    console.log("📊 Creating aggregated ratings table...");
    await productionPool.query(`
      CREATE TABLE IF NOT EXISTS aggregated_ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        restaurant_id INT NOT NULL UNIQUE,
        overall_rating DECIMAL(3, 2) DEFAULT 0,
        taste_rating DECIMAL(3, 2) DEFAULT 0,
        service_rating DECIMAL(3, 2) DEFAULT 0,
        ambiance_rating DECIMAL(3, 2) DEFAULT 0,
        price_rating DECIMAL(3, 2) DEFAULT 0,
        review_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      ) ENGINE = InnoDB
    `);
    console.log("✅ Aggregated ratings table created\n");

    console.log(`==================================================`);
    console.log(`✅ Production database schema setup complete!`);
    console.log(`==================================================\n`);

    await productionPool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    await productionPool.end();
    process.exit(1);
  }
}

setupProductionDatabase();
