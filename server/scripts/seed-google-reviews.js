import db from "../db.js";
import { config } from "dotenv";
config({ path: ".env.google-places" });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1";

// Weighted score calculation: 0.6 * taste + 0.15 * service + 0.15 * ambiance + 0.1 * price
// We need to distribute a target rating across these categories
function generateComponentRatings(targetRating) {
  // Add some variance to make it realistic
  const variance = (Math.random() - 0.5) * 0.3;
  const adjustedTarget = Math.max(1, Math.min(5, targetRating + variance));

  // Generate random values that weight to the target
  // Start with a base around the target
  let taste = adjustedTarget + (Math.random() - 0.5) * 0.8;
  let service = adjustedTarget + (Math.random() - 0.5) * 0.8;
  let ambiance = adjustedTarget + (Math.random() - 0.5) * 0.8;
  let price = adjustedTarget + (Math.random() - 0.5) * 0.8;

  // Clamp to 1-5 range
  taste = Math.max(1, Math.min(5, taste));
  service = Math.max(1, Math.min(5, service));
  ambiance = Math.max(1, Math.min(5, ambiance));
  price = Math.max(1, Math.min(5, price));

  // Calculate the weighted average
  const weighted = taste * 0.6 + service * 0.15 + ambiance * 0.15 + price * 0.1;
  const difference = adjustedTarget - weighted;

  // Adjust taste (has highest weight) to match the target
  taste = Math.max(1, Math.min(5, taste + difference));

  return {
    taste: parseFloat(taste.toFixed(1)),
    service: parseFloat(service.toFixed(1)),
    ambiance: parseFloat(ambiance.toFixed(1)),
    price: parseFloat(price.toFixed(1)),
  };
}

async function searchRestaurant(name, address) {
  try {
    const searchUrl = "https://places.googleapis.com/v1/places:searchText";
    const query = `${name} restaurant Honolulu Hawaii`;
    
    const response = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.id",
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: {
          circle: {
            center: {
              latitude: 21.2859,
              longitude: -157.8253,
            },
            radius: 15000,
          },
        },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.places?.[0]?.id || null;
  } catch (error) {
    console.error(`Error searching for ${name}:`, error.message);
    return null;
  }
}

async function fetchRestaurantReviews(placeId) {
  try {
    const response = await fetch(`${BASE_URL}/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "reviews",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch reviews for ${placeId}:`, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error(`Error fetching reviews for ${placeId}:`, error.message);
    return [];
  }
}

async function seedGoogleReviews() {
  try {
    console.log("🗑️  Clearing existing reviews...");
    await db.query("DELETE FROM reviews");
    console.log("✅ Reviews cleared\n");

    console.log("👥 Fetching existing users...");
    const [users] = await db.query("SELECT id FROM users LIMIT 20");
    const userIds = users.map(u => u.id);
    console.log(`✅ Found ${userIds.length} users\n`);

    console.log("🍽️  Fetching all restaurants...");
    const [restaurants] = await db.query(
      "SELECT id, name, address FROM restaurants ORDER BY id"
    );
    console.log(`✅ Found ${restaurants.length} restaurants\n`);

    let totalReviewsInserted = 0;

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];

      try {
        // Search for the place ID
        const placeId = await searchRestaurant(restaurant.name, restaurant.address);

        if (!placeId) {
          console.log(`[${i + 1}/${restaurants.length}] ${restaurant.name} - Not found on Google`);
          continue;
        }

        // Fetch reviews for this place
        const googleReviews = await fetchRestaurantReviews(placeId);

        if (googleReviews.length === 0) {
          console.log(`[${i + 1}/${restaurants.length}] ${restaurant.name} - 0 reviews found`);
          continue;
        }

        let restaurantReviewCount = 0;
        
        // Augment reviews to reach 20 per restaurant with drastic variations
        // This creates a wider range of ratings (1-5) for more dramatic graphs
        let reviewsToImport = googleReviews.slice(0, 20);
        
        if (reviewsToImport.length < 20) {
          const augmentedReviews = [...reviewsToImport];
          const reviewTexts = googleReviews.map(r => 
            typeof r.originalText === 'string' ? r.originalText : 
            typeof r.text === 'string' ? r.text : r.originalText?.text || r.text?.text || "Great place!"
          );
          
          // Generate additional reviews with much wider rating variation
          while (augmentedReviews.length < 20) {
            // Create drastic variations - random rating from 1-5 instead of small variations
            // This creates more dramatic ups and downs in the rating graph
            const randomRating = Math.floor(Math.random() * 5) + 1; // 1-5
            
            // Use review text
            const textIndex = augmentedReviews.length % reviewTexts.length;
            const reviewText = reviewTexts[textIndex];
            
            augmentedReviews.push({
              rating: randomRating,
              originalText: reviewText,
              publishTime: null, // Will be spread by date logic below
            });
          }
          
          reviewsToImport = augmentedReviews;
        }

        for (let reviewIndex = 0; reviewIndex < reviewsToImport.length; reviewIndex++) {
          const googleReview = reviewsToImport[reviewIndex];
          try {
            const rating = googleReview.rating || 4;
            
            // Extract review text - Google API returns text as {text: "content"}
            let reviewText = "";
            if (googleReview.originalText) {
              // originalText might be a string or object with text property
              reviewText = typeof googleReview.originalText === 'string' 
                ? googleReview.originalText 
                : googleReview.originalText.text || "Great place!";
            } else if (googleReview.text) {
              // text might be a string or object with text property
              reviewText = typeof googleReview.text === 'string'
                ? googleReview.text
                : googleReview.text.text || "Great place!";
            } else {
              reviewText = "Great place!";
            }
            
            // Ensure reviewText is a string
            reviewText = String(reviewText).trim();
            if (!reviewText) {
              reviewText = "Great place!";
            }
            
            // Spread reviews across the past 5 YEARS for more drastic variation in the graph
            // Calculate date based on position in the review list
            const now = new Date();
            const monthsBack = Math.floor((reviewIndex / reviewsToImport.length) * 60); // 5 years = 60 months
            const daysVariation = Math.floor(Math.random() * 28); // Add random days for more variation
            const publishDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate() - daysVariation);
            const publishTime = publishDate.toISOString().replace('T', ' ').substring(0, 19);

            // Generate component ratings that weight to the Google rating
            const components = generateComponentRatings(rating);
            
            // Use an existing user ID (cycle through available users)
            const userId = userIds[Math.floor(Math.random() * userIds.length)];

            await db.query(
              "INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                userId,
                restaurant.id,
                components.taste,
                components.service,
                components.ambiance,
                components.price,
                reviewText.substring(0, 500), // Limit comment length
                publishTime,
              ]
            );
            restaurantReviewCount++;
          } catch (error) {
            console.error(`Error inserting review:`, error.message);
          }
        }

        console.log(
          `[${i + 1}/${restaurants.length}] ${restaurant.name} - ${restaurantReviewCount} reviews imported`
        );
        totalReviewsInserted += restaurantReviewCount;
        
        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error processing ${restaurant.name}:`, error.message);
      }
    }

    console.log(`\n==================================================`);
    console.log(`📊 Google Reviews Import Summary`);
    console.log(`==================================================`);
    console.log(`✅ Total reviews imported: ${totalReviewsInserted}`);
    console.log(`==================================================\n`);

    await db.end();
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error.message);
    await db.end();
    process.exit(1);
  }
}

seedGoogleReviews();
