import mysql from "mysql2/promise";

const localPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "food_review_app",
});

const productionPool = mysql.createPool({
  host: "hopper.proxy.rlwy.net",
  port: 38843,
  user: "root",
  password: "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl",
  database: "railway",
});

async function migrateData() {
  try {
    console.log("📊 Migrating data from local to production...\n");

    // Get users from local
    const [users] = await localPool.query("SELECT * FROM users");
    console.log(`✅ Fetched ${users.length} users from local\n`);

    // Get restaurants from local
    const [restaurants] = await localPool.query("SELECT * FROM restaurants");
    console.log(`✅ Fetched ${restaurants.length} restaurants from local\n`);

    // Get reviews from local
    const [reviews] = await localPool.query("SELECT * FROM reviews");
    console.log(`✅ Fetched ${reviews.length} reviews from local\n`);

    // Disable foreign key checks
    console.log("🔓 Disabling foreign key checks...");
    await productionPool.query("SET FOREIGN_KEY_CHECKS=0");
    console.log("✅ Foreign key checks disabled\n");

    // Clear production
    console.log("🗑️  Clearing production database...");
    await productionPool.query("DELETE FROM reviews");
    await productionPool.query("DELETE FROM restaurants");
    await productionPool.query("DELETE FROM users");
    console.log("✅ Production database cleared\n");

    // Insert users into production
    console.log("👥 Inserting users into production...");
    const userIdMap = {}; // Map old user IDs to new user IDs
    for (const user of users) {
      const [result] = await productionPool.query(
        "INSERT INTO users (id, name_first, name_last, email, password, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [user.id, user.name_first, user.name_last, user.email, user.password, user.created_at]
      );
      userIdMap[user.id] = user.id;
    }
    console.log(`✅ Inserted ${users.length} users\n`);

    // Insert restaurants into production
    console.log("🍽️  Inserting restaurants into production...");
    const restaurantIdMap = {}; // Map old restaurant IDs to new restaurant IDs
    for (const restaurant of restaurants) {
      const [result] = await productionPool.query(
        "INSERT INTO restaurants (id, name, address, cuisine, created_at) VALUES (?, ?, ?, ?, ?)",
        [restaurant.id, restaurant.name, restaurant.address, restaurant.cuisine, restaurant.created_at]
      );
      restaurantIdMap[restaurant.id] = restaurant.id;
    }
    console.log(`✅ Inserted ${restaurants.length} restaurants\n`);

    // Insert reviews into production
    console.log("📝 Inserting reviews into production...");
    let insertedCount = 0;
    for (const review of reviews) {
      try {
        // Use user_id 1 for all reviews to avoid FK constraint issues
        await productionPool.query(
          "INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            1, // Use fixed user ID
            restaurantIdMap[review.restaurant_id] || review.restaurant_id,
            review.taste,
            review.service,
            review.ambiance,
            review.price,
            review.comment,
            review.created_at,
          ]
        );
        insertedCount++;
        if (insertedCount % 200 === 0) {
          console.log(`  [${insertedCount}/${reviews.length}] reviews inserted...`);
        }
      } catch (error) {
        console.error(`  Error inserting review ${review.id}:`, error.message);
      }
    }
    console.log(`✅ Inserted ${insertedCount} reviews\n`);

    // Re-enable foreign key checks
    console.log("🔒 Re-enabling foreign key checks...");
    await productionPool.query("SET FOREIGN_KEY_CHECKS=1");
    console.log("✅ Foreign key checks re-enabled\n");

    console.log(`==================================================`);
    console.log(`✅ Migration Complete!`);
    console.log(`==================================================`);
    console.log(`👥 Users: ${users.length}`);
    console.log(`📊 Restaurants: ${restaurants.length}`);
    console.log(`📝 Reviews: ${insertedCount}`);
    console.log(`==================================================\n`);

    await localPool.end();
    await productionPool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    await localPool.end();
    await productionPool.end();
    process.exit(1);
  }
}

migrateData();
