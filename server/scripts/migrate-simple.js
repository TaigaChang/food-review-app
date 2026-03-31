import mysql from "mysql2/promise";

async function migrateData() {
  let localConn, prodConn;
  try {
    console.log("📊 Starting migration...\n");

    // Create direct connections (not pools)
    localConn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "food_review_app",
    });

    prodConn = await mysql.createConnection({
      host: "hopper.proxy.rlwy.net",
      port: 38843,
      user: "root",
      password: "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl",
      database: "railway",
    });

    // Fetch data from local
    const [users] = await localConn.execute("SELECT * FROM users");
    const [restaurants] = await localConn.execute("SELECT * FROM restaurants");
    const [reviews] = await localConn.execute("SELECT * FROM reviews");

    console.log(`📥 Fetched: ${users.length} users, ${restaurants.length} restaurants, ${reviews.length} reviews\n`);

    // Disable FK checks
    await prodConn.execute("SET FOREIGN_KEY_CHECKS=0");
    
    // Clear production
    console.log("🗑️  Clearing production database...");
    await prodConn.execute("DELETE FROM reviews");
    await prodConn.execute("DELETE FROM restaurants");
    await prodConn.execute("DELETE FROM users");

    // Insert users
    console.log("👥 Inserting users...");
    for (const user of users) {
      await prodConn.execute(
        "INSERT INTO users (id, name_first, name_last, email, password, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [user.id, user.name_first, user.name_last, user.email, user.password, user.created_at]
      );
    }
    console.log(`✅ Inserted ${users.length} users\n`);

    // Insert restaurants
    console.log("🍽️  Inserting restaurants...");
    for (const restaurant of restaurants) {
      await prodConn.execute(
        "INSERT INTO restaurants (id, name, address, cuisine, created_at) VALUES (?, ?, ?, ?, ?)",
        [restaurant.id, restaurant.name, restaurant.address, restaurant.cuisine, restaurant.created_at]
      );
    }
    console.log(`✅ Inserted ${restaurants.length} restaurants\n`);

    // Insert reviews
    console.log("📝 Inserting reviews...");
    let count = 0;
    for (const review of reviews) {
      try {
        await prodConn.execute(
          "INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [1, review.restaurant_id, review.taste, review.service, review.ambiance, review.price, review.comment, review.created_at]
        );
        count++;
        if (count % 100 === 0) console.log(`  ${count}/${reviews.length}`);
      } catch (e) {
        console.error(`  Error: ${e.message}`);
      }
    }
    console.log(`✅ Inserted ${count}/${reviews.length} reviews\n`);

    // Re-enable FK
    await prodConn.execute("SET FOREIGN_KEY_CHECKS=1");

    console.log(`==================================================`);
    console.log(`✅ Migration Complete!`);
    console.log(`==================================================`);
    console.log(`Users: ${users.length}`);
    console.log(`Restaurants: ${restaurants.length}`);
    console.log(`Reviews: ${count}`);
    console.log(`==================================================\n`);

    await localConn.end();
    await prodConn.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    if (localConn) await localConn.end();
    if (prodConn) await prodConn.end();
    process.exit(1);
  }
}

migrateData();
