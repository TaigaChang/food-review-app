import db from "../db.js";

// Sample reviewer names
const reviewerNames = [
  "Sarah M.", "John D.", "Maria G.", "David L.", "Jessica T.",
  "Michael P.", "Emily K.", "James H.", "Amanda R.", "Christopher W.",
  "Lisa N.", "Robert B.", "Michelle A.", "Daniel F.", "Jennifer S.",
  "William C.", "Laura J.", "Joseph M.", "Patricia E.", "Richard V.",
];

// Sample review comments
const reviewComments = [
  "Absolutely loved this place! The food was incredible and the service was top-notch.",
  "Great restaurant with a wonderful atmosphere. Will definitely come back!",
  "The meal was delicious and the presentation was beautiful. Highly recommended!",
  "Fantastic dining experience. The chef really knows what they're doing.",
  "Amazing food and great ambiance. Our server was very attentive and friendly.",
  "One of the best meals I've had in a while. Everything was perfect!",
  "Good food, good service, good price. Can't ask for more!",
  "The flavors were incredible. Every dish was a masterpiece.",
  "Loved every bite! The ingredients are clearly high quality.",
  "Best restaurant in Honolulu in my opinion. Very impressed!",
  "Nice place with excellent service. Food was flavorful and well-prepared.",
  "Had a wonderful experience here. Will bring my family next time.",
  "Outstanding restaurant! The attention to detail is remarkable.",
  "This is the kind of place you want to visit again and again.",
  "Superb food and hospitality. Worth every penny!",
  "The atmosphere was cozy and the food was phenomenal.",
  "I would rate this place 5 stars! Everything was perfect.",
  "Great quality ingredients and skilled preparation. Bravo!",
  "My new favorite restaurant! Can't wait to come back.",
  "Exceptional experience from start to finish. Truly memorable.",
  "The portion sizes were generous and the food was delicious.",
  "Loved the creative menu and attentive staff.",
  "Best dining experience I've had in ages!",
  "Every detail was thoughtfully done. A real gem!",
  "The food was fresh, flavorful, and beautifully served.",
];

function generateRandomRating(min = 3.5, max = 5) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function generateComponentRatings(targetRating) {
  const taste = parseFloat((targetRating + (Math.random() - 0.5) * 0.6).toFixed(1));
  const service = parseFloat((targetRating + (Math.random() - 0.5) * 0.5).toFixed(1));
  const ambiance = parseFloat((targetRating + (Math.random() - 0.5) * 0.5).toFixed(1));
  const price = parseFloat((3 + Math.random() * 2).toFixed(1)); // Price from 3-5 stars
  
  return {
    taste: Math.max(1, Math.min(5, taste)),
    service: Math.max(1, Math.min(5, service)),
    ambiance: Math.max(1, Math.min(5, ambiance)),
    price: Math.max(1, Math.min(5, price)),
  };
}

async function seedSyntheticReviews() {
  try {
    console.log("🍽️  Seeding synthetic reviews for production database...\n");

    // Get all restaurants
    const [restaurants] = await db.query("SELECT id FROM restaurants ORDER BY id");
    console.log(`✅ Found ${restaurants.length} restaurants\n`);

    // Get users (we'll create some if they don't exist)
    const [users] = await db.query("SELECT id FROM users LIMIT 20");
    let userIds = users.map(u => u.id);

    if (userIds.length === 0) {
      console.log("👥 No users found, creating default users...");
      for (let i = 1; i <= 5; i++) {
        await db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [`user${i}`, `user${i}@example.com`, 'password_hash']
        );
      }
      const [newUsers] = await db.query("SELECT id FROM users");
      userIds = newUsers.map(u => u.id);
      console.log(`✅ Created ${userIds.length} default users\n`);
    }

    let totalReviewsInserted = 0;

    // Add 20 reviews per restaurant
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      let restaurantReviewCount = 0;

      for (let reviewNum = 0; reviewNum < 20; reviewNum++) {
        const rating = generateRandomRating();
        const components = generateComponentRatings(rating);
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const reviewComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

        // Spread reviews across 5 years
        const now = new Date();
        const monthsBack = Math.floor((reviewNum / 20) * 60); // 5 years
        const daysVariation = Math.floor(Math.random() * 28);
        const publishDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate() - daysVariation);
        const publishTime = publishDate.toISOString().replace('T', ' ').substring(0, 19);

        await db.query(
          "INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            userId,
            restaurant.id,
            components.taste,
            components.service,
            components.ambiance,
            components.price,
            reviewComment,
            publishTime,
          ]
        );
        restaurantReviewCount++;
      }

      console.log(`[${i + 1}/${restaurants.length}] Restaurant ${restaurant.id} - ${restaurantReviewCount} reviews added`);
      totalReviewsInserted += restaurantReviewCount;
    }

    console.log(`\n==================================================`);
    console.log(`📊 Synthetic Reviews Import Summary`);
    console.log(`==================================================`);
    console.log(`✅ Total reviews inserted: ${totalReviewsInserted}`);
    console.log(`==================================================\n`);

    await db.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error.message);
    await db.end();
    process.exit(1);
  }
}

seedSyntheticReviews();
