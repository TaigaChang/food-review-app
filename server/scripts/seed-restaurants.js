import db from "../db.js";

const restaurants = [
  { name: "Rainbow Drive-In", cuisine: "Local" },
  { name: "Leonard's Bakery", cuisine: "Bakery" },
  { name: "Helena's Hawaiian Food", cuisine: "Hawaiian" },
  { name: "Zippy's", cuisine: "Local" },
  { name: "Liliha Bakery", cuisine: "Bakery" },
  { name: "Wagaya", cuisine: "Japanese" },
  { name: "Menya le Nood", cuisine: "Japanese" },
  { name: "Marukame Udon", cuisine: "Japanese" },
  { name: "Katsu Midori Sushi", cuisine: "Japanese" },
  { name: "Sekiya's Restaurant & Delicatessen", cuisine: "Japanese" },
  { name: "Pho Saigon", cuisine: "Vietnamese" },
  { name: "Olay's Thai Lao Cuisine", cuisine: "Thai" },
  { name: "Richie's Drive Inn", cuisine: "Local" },
  { name: "Grace's Inn", cuisine: "Local" },
  { name: "Ono Seafood", cuisine: "Seafood" },
  { name: "Fresh Catch", cuisine: "Seafood" },
  { name: "Alicia's Market", cuisine: "Local" },
  { name: "Highway Inn", cuisine: "Hawaiian" },
  { name: "Chun Wah Kam", cuisine: "Chinese" },
  { name: "Teddy's Bigger Burgers", cuisine: "American" },
  { name: "Diamond Head Market & Grill", cuisine: "Local" },
  { name: "Bogart's Cafe", cuisine: "American" },
  { name: "Nico's Pier 38", cuisine: "Seafood" },
  { name: "Side Street Inn", cuisine: "Local" },
  { name: "Cafe Kaila", cuisine: "Hawaiian" },
  { name: "Sweet E's Cafe", cuisine: "Cafe" },
  { name: "Happy Days Chinese Seafood Restaurant", cuisine: "Chinese" },
  { name: "Legend Seafood Restaurant", cuisine: "Chinese" },
  { name: "Waiola Shave Ice", cuisine: "Dessert" },
  { name: "Shimazu Store", cuisine: "Local" },
  { name: "Uncle Clay's House of Pure Aloha", cuisine: "Dessert" },
  { name: "Tonkatsu Tamafuji", cuisine: "Japanese" },
  { name: "Tight Tacos", cuisine: "Mexican" },
  { name: "Pioneer", cuisine: "Local" },
  { name: "Maharani", cuisine: "Indian" },
  { name: "Keaamoku Seafood", cuisine: "Seafood" },
  { name: "Korean Garden", cuisine: "Korean" },
  { name: "Noods", cuisine: "Asian" },
  { name: "Mama Pho", cuisine: "Vietnamese" },
  { name: "Hamada General Store", cuisine: "Local" },
  { name: "Waioli Kitchen", cuisine: "Hawaiian" },
  { name: "Da spot", cuisine: "Local" },
  { name: "Bo's Kitchen", cuisine: "Local" },
  { name: "Sprout", cuisine: "Healthy" },
  { name: "Shaloha", cuisine: "Hawaiian" },
  { name: "Chubbies", cuisine: "American" },
  { name: "Red Elephant", cuisine: "Thai" },
  { name: "Beast side Kitchen", cuisine: "Asian" },
  { name: "Moena Cafe", cuisine: "Cafe" },
  { name: "Hale Vietnam", cuisine: "Vietnamese" },
  { name: "Olay", cuisine: "Thai" },
];

// Sample review comments
const reviewComments = [
  "Absolutely loved this place! The food was incredible.",
  "Great restaurant with a wonderful atmosphere.",
  "The meal was delicious and the presentation was beautiful.",
  "Fantastic dining experience. Perfect!",
  "Amazing food and great ambiance. Very impressed!",
  "One of the best meals I've had.",
  "Good food, good service, good price.",
  "The flavors were incredible. Every dish was a masterpiece.",
  "Loved every bite! High quality ingredients.",
  "Best restaurant in Honolulu. Highly recommended!",
  "Outstanding service and excellent food.",
  "Had a wonderful experience here. Will return!",
  "The food was okay but service was slow.",
  "Not what I expected. Disappointed.",
  "Average experience. Nothing special.",
  "Decent food but overpriced.",
  "Pretty good, would come back.",
  "Excellent quality and attention to detail.",
  "My new favorite restaurant!",
  "Exceptional from start to finish.",
  "Average at best. Expected more.",
  "Waste of money. Very disappointed.",
  "Not worth the hype.",
  "Mediocre food and slow service.",
  "Great value for the price.",
  "Impressive presentation and taste.",
  "Could be better, but decent.",
  "Really enjoyed our meal here.",
  "Highly recommend this place!",
  "Just okay, nothing memorable.",
];

function generateComponentRatings(targetRating) {
  // Generate component ratings that weight to the target
  let taste = targetRating + (Math.random() - 0.5) * 1;
  let service = targetRating + (Math.random() - 0.5) * 1;
  let ambiance = targetRating + (Math.random() - 0.5) * 1;
  let price = targetRating + (Math.random() - 0.5) * 1;

  // Clamp to 1-5 range
  taste = Math.max(1, Math.min(5, taste));
  service = Math.max(1, Math.min(5, service));
  ambiance = Math.max(1, Math.min(5, ambiance));
  price = Math.max(1, Math.min(5, price));

  return {
    taste: parseFloat(taste.toFixed(1)),
    service: parseFloat(service.toFixed(1)),
    ambiance: parseFloat(ambiance.toFixed(1)),
    price: parseFloat(price.toFixed(1)),
  };
}

async function seedRestaurantsAndReviews() {
  try {
    console.log("🍽️  Seeding 50 restaurants with reviews...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.query("DELETE FROM reviews");
    await db.query("DELETE FROM restaurants");
    console.log("✅ Cleared\n");

    // Create default users if they don't exist
    console.log("👥 Setting up users...");
    await db.query("DELETE FROM users");
    const defaultUsers = [
      { name_first: "John", name_last: "Doe", email: "john@example.com", password: "hash1" },
      { name_first: "Jane", name_last: "Smith", email: "jane@example.com", password: "hash2" },
      { name_first: "Mike", name_last: "Wilson", email: "mike@example.com", password: "hash3" },
      { name_first: "Sarah", name_last: "Jones", email: "sarah@example.com", password: "hash4" },
      { name_first: "Alex", name_last: "Brown", email: "alex@example.com", password: "hash5" },
    ];

    for (const user of defaultUsers) {
      await db.query(
        "INSERT INTO users (name_first, name_last, email, password) VALUES (?, ?, ?, ?)",
        [user.name_first, user.name_last, user.email, user.password]
      );
    }
    console.log(`✅ Created ${defaultUsers.length} users\n`);

    // Get user IDs
    const [users] = await db.query("SELECT id FROM users");
    const userIds = users.map(u => u.id);

    // Insert restaurants
    console.log("🍽️  Inserting 50 restaurants...");
    for (const restaurant of restaurants) {
      await db.query(
        "INSERT INTO restaurants (name, address, cuisine) VALUES (?, ?, ?)",
        [restaurant.name, "Honolulu, Hawaii", restaurant.cuisine]
      );
    }
    console.log(`✅ Inserted ${restaurants.length} restaurants\n`);

    // Get all restaurants
    const [allRestaurants] = await db.query("SELECT id FROM restaurants ORDER BY id");

    // Seed reviews - 20 per restaurant with wide rating variation and 5-year spread
    console.log("📝 Generating 1000 reviews with 1-5 star variation across 5 years...");
    let totalReviews = 0;

    for (let i = 0; i < allRestaurants.length; i++) {
      const restaurant = allRestaurants[i];

      for (let reviewNum = 0; reviewNum < 20; reviewNum++) {
        // Random rating from 1-5 (drastic variation for good graph movement)
        const rating = Math.floor(Math.random() * 5) + 1;
        const components = generateComponentRatings(rating);

        // Spread reviews across 5 years (60 months)
        const now = new Date();
        const monthsBack = Math.floor((reviewNum / 20) * 60);
        const daysVariation = Math.floor(Math.random() * 28);
        const publishDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate() - daysVariation);
        const publishTime = publishDate.toISOString().replace('T', ' ').substring(0, 19);

        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

        await db.query(
          "INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            userId,
            restaurant.id,
            components.taste,
            components.service,
            components.ambiance,
            components.price,
            comment,
            publishTime,
          ]
        );
        totalReviews++;
      }

      if ((i + 1) % 10 === 0) {
        console.log(`  [${i + 1}/${allRestaurants.length}] restaurants done...`);
      }
    }

    console.log(`✅ Generated ${totalReviews} reviews\n`);

    console.log(`==================================================`);
    console.log(`✅ Seeding Complete!`);
    console.log(`==================================================`);
    console.log(`🍽️  Restaurants: ${restaurants.length}`);
    console.log(`📝 Reviews: ${totalReviews}`);
    console.log(`⭐ Rating range: 1-5 stars (drastic variation)`);
    console.log(`📅 Spread: 5 years back`);
    console.log(`==================================================\n`);

    await db.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await db.end();
    process.exit(1);
  }
}

seedRestaurantsAndReviews();
