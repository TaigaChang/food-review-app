import db from "../db.js";
import { config } from "dotenv";
config({ path: ".env.google-places" });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1";

// Real review comments with varied sentiments
const reviewComments = {
  excellent: [
    "Absolutely amazing! Best meal I've had in months. Every dish was perfectly executed.",
    "Outstanding service and incredible food quality. Will definitely come back!",
    "This place is a gem! The flavors are exceptional and the ambiance is perfect.",
    "Exceptional experience from start to finish. Highly recommend!",
    "Simply the best restaurant in Honolulu. Worth every penny.",
    "Wow! The presentation and taste were both incredible. Service was impeccable.",
  ],
  good: [
    "Really enjoyed this place. Good food and friendly service.",
    "Nice restaurant with solid dishes. Atmosphere was great.",
    "Had a wonderful time here. The food was well-prepared and portions were generous.",
    "Great selection of dishes and reasonable prices for the quality.",
    "Solid experience overall. Would come back again.",
    "Good ambiance and tasty food. Staff was attentive.",
  ],
  average: [
    "It was okay. Nothing special but nothing bad either.",
    "Decent restaurant. Some dishes were better than others.",
    "Average experience. Food was fine but nothing memorable.",
    "Pretty good but a bit overpriced for what you get.",
    "So-so experience. Service was slow but food was decent.",
    "Acceptable overall. Had better meals elsewhere.",
  ],
  poor: [
    "Disappointed with this visit. Food was mediocre and overpriced.",
    "Not impressed. Food was cold and service was slow.",
    "Pretty letdown by the quality. Expected better.",
    "Went here with high expectations but was disappointed.",
    "Food was bland and service was inattentive. Not worth it.",
    "Wouldn't recommend. Better options in the area.",
  ],
  terrible: [
    "Terrible experience. Food was cold and tasteless.",
    "Worst meal I've had in a long time. Very disappointed.",
    "Poor quality food and awful service. Won't be back.",
    "Horrible experience. Waste of money and time.",
    "Absolutely terrible. Don't waste your time here.",
    "Worst restaurant experience ever. Avoid at all costs.",
  ],
};

function getCommentForRating(rating) {
  if (rating >= 4.5) return reviewComments.excellent[Math.floor(Math.random() * reviewComments.excellent.length)];
  if (rating >= 3.5) return reviewComments.good[Math.floor(Math.random() * reviewComments.good.length)];
  if (rating >= 2.5) return reviewComments.average[Math.floor(Math.random() * reviewComments.average.length)];
  if (rating >= 1.5) return reviewComments.poor[Math.floor(Math.random() * reviewComments.poor.length)];
  return reviewComments.terrible[Math.floor(Math.random() * reviewComments.terrible.length)];
}

function generateComponentRatings(targetRating) {
  let taste = targetRating + (Math.random() - 0.5) * 1.2;
  let service = targetRating + (Math.random() - 0.5) * 1;
  let ambiance = targetRating + (Math.random() - 0.5) * 1;
  let price = targetRating + (Math.random() - 0.5) * 0.8;

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

async function fetchRestaurantDetailsFromGoogle(restaurantName, address) {
  try {
    const searchUrl = `${BASE_URL}/places:searchText`;
    
    const response = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places(id,photos,displayName,formattedAddress,internationalPhoneNumber,editorialSummary)",
      },
      body: JSON.stringify({
        textQuery: `${restaurantName} ${address}`,
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

    if (!response.ok) return null;

    const data = await response.json();
    const place = data.places?.[0];
    if (!place) return null;

    let imageUrl = null;
    if (place.photos && place.photos.length > 0) {
      const photoName = place.photos[0].name;
      imageUrl = `https://places.googleapis.com/v1/${photoName}/media?max_height_px=600&max_width_px=800&key=${API_KEY}`;
    }

    let phone = place.internationalPhoneNumber || null;
    let about = place.editorialSummary?.text || null;

    return { imageUrl, phone, about };
  } catch (error) {
    return null;
  }
}

async function generateReviewsForRestaurant(restaurantId, index) {
  const now = new Date();
  const reviews = [];
  const validUserIds = [26, 27, 28, 29, 30];

  // Distribute reviews: 40% recent (last 30 days), 30% in last year, 30% older
  for (let i = 0; i < 20; i++) {
    let reviewDate;
    let randomForDate = Math.random();
    
    if (randomForDate < 0.4) {
      // 40% in past 30 days
      const daysAgo = Math.random() * 30;
      reviewDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    } else if (randomForDate < 0.7) {
      // 30% in past year (30-365 days ago)
      const daysAgo = 30 + Math.random() * 335;
      reviewDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    } else {
      // 30% spread over previous 4 years
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      const fourYearsAgo = new Date();
      fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 1);
      const randomTime = fourYearsAgo.getTime() + Math.random() * (fiveYearsAgo.getTime() - fourYearsAgo.getTime());
      reviewDate = new Date(randomTime);
    }

    const rand = Math.random();
    let targetRating;
    if (rand < 0.1) targetRating = Math.floor(Math.random() * 2) + 1;
    else if (rand < 0.2) targetRating = 2.5 + Math.random() * 0.5;
    else if (rand < 0.35) targetRating = 3 + Math.random() * 1;
    else if (rand < 0.7) targetRating = 3.8 + Math.random() * 1;
    else targetRating = 4.5 + Math.random() * 0.5;

    const components = generateComponentRatings(targetRating);
    const comment = getCommentForRating(targetRating);

    reviews.push({
      restaurantId,
      userId: validUserIds[(index + i) % validUserIds.length],
      date: reviewDate,
      taste: components.taste,
      service: components.service,
      ambiance: components.ambiance,
      price: components.price,
      comment,
    });
  }

  return reviews;
}

async function updateRestaurantsAndGenerateReviews() {
  try {
    console.log("🚀 Starting comprehensive restaurant update...\n");

    const [restaurants] = await db.query(`SELECT id, name, address FROM restaurants ORDER BY id`);
    console.log(`📍 Found ${restaurants.length} restaurants\n`);
    
    let updated = 0;
    let totalReviewsInserted = 0;

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      console.log(`[${i + 1}/${restaurants.length}] ${restaurant.name}...`);

      const details = await fetchRestaurantDetailsFromGoogle(restaurant.name, restaurant.address);

      if (details && details.imageUrl) {
        await db.query(
          `UPDATE restaurants SET image_url = ?, phone = ?, about = ? WHERE id = ?`,
          [details.imageUrl, details.phone, details.about, restaurant.id]
        );
        console.log(`  ✓ Updated with Google data`);
        updated++;
      } else {
        console.log(`  ✗ No Google image found`);
      }

      // Generate reviews for ALL restaurants
      const reviews = await generateReviewsForRestaurant(restaurant.id, i);
      await db.query(`DELETE FROM reviews WHERE restaurant_id = ?`, [restaurant.id]);

      for (const review of reviews) {
        await db.query(
          `INSERT INTO reviews (user_id, restaurant_id, taste, service, ambiance, price, comment, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [review.userId, review.restaurantId, review.taste, review.service, review.ambiance, review.price, review.comment, review.date]
        );
      }
      
      console.log(`  ✓ 20 reviews added`);
      totalReviewsInserted += 20;

      await new Promise(resolve => setTimeout(resolve, 400));
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Updated: ${updated} restaurants`);
    console.log(`📝 Reviews generated: ${totalReviewsInserted}`);
    console.log(`${'='.repeat(50)}\n`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.end();
  }
}

updateRestaurantsAndGenerateReviews();
