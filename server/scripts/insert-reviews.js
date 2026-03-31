import mysql from "mysql2/promise";

async function insertReviews() {
  let localConn, prodConn;
  try {
    // Create direct connections
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

    // Get reviews from local
    const [reviews] = await localConn.execute("SELECT * FROM reviews");
    console.log(`📥 Fetched ${reviews.length} reviews from local\n`);

    // Clear old reviews from production
    console.log("🗑️  Clearing old reviews...");
    await prodConn.execute("DELETE FROM reviews");

    // Disable FK checks
    await prodConn.execute("SET FOREIGN_KEY_CHECKS=0");

    // Insert reviews in batches
    console.log("📝 Inserting reviews...\n");
    let inserted = 0;
    const batchSize = 50;

    for (let i = 0; i < reviews.length; i += batchSize) {
      const batch = reviews.slice(i, i + batchSize);
      
      for (const review of batch) {
        try {
          await prodConn.execute(
            "INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [1, review.restaurant_id, review.taste, review.service, review.ambiance, review.price, review.comment, review.created_at]
          );
          inserted++;
        } catch (e) {
          console.error(`  ❌ Error review ${review.id}: ${e.message}`);
        }
      }
      
      const progress = Math.min(i + batchSize, reviews.length);
      console.log(`  ✅ ${progress}/${reviews.length} inserted`);
    }

    // Re-enable FK
    await prodConn.execute("SET FOREIGN_KEY_CHECKS=1");

    console.log(`\n✅ Migration complete: ${inserted}/${reviews.length} reviews inserted`);

    await localConn.end();
    await prodConn.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (localConn) await localConn.end();
    if (prodConn) await prodConn.end();
    process.exit(1);
  }
}

insertReviews();
