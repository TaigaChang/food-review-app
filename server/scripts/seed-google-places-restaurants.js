import db from "../db.js";
import { config } from "dotenv";
config({ path: ".env.google-places" });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1";

// Popular restaurant keywords to search for variety
const searchQueries = [
  "popular restaurants Honolulu Hawaii",
  "fine dining Honolulu",
  "casual restaurants Honolulu",
  "Japanese restaurants Honolulu",
  "Hawaiian restaurants Honolulu",
  "seafood restaurants Honolulu",
  "Italian restaurants Honolulu",
  "Thai restaurants Honolulu",
];

async function searchRestaurants(query) {
  try {
    const searchUrl = `${BASE_URL}/places:searchText`;
    
    const response = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places(id,displayName,formattedAddress,types)",
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
      const error = await response.text();
      console.error(`Search failed for "${query}": ${response.statusText}`);
      console.error(`Response: ${error}`);
      return [];
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error(`Error searching for "${query}":`, error.message);
    return [];
  }
}

function detectedCuisine(types = []) {
  if (!types || types.length === 0) return "International";
  
  const typeStr = types.join(" ").toLowerCase();
  if (typeStr.includes("japanese")) return "Japanese";
  if (typeStr.includes("thai")) return "Thai";
  if (typeStr.includes("italian")) return "Italian";
  if (typeStr.includes("seafood") || typeStr.includes("fish")) return "Seafood";
  if (typeStr.includes("hawaiian")) return "Hawaiian";
  if (typeStr.includes("asian")) return "Asian";
  if (typeStr.includes("chinese")) return "Chinese";
  if (typeStr.includes("korean")) return "Korean";
  if (typeStr.includes("mexican")) return "Mexican";
  if (typeStr.includes("american")) return "American";
  return "International";
}

async function seedGoogleRestaurants() {
  try {
    console.log("🍽️  Searching Google Places for Honolulu restaurants...\n");

    const allRestaurants = new Map(); // Use Map to deduplicate by name

    for (const query of searchQueries) {
      console.log(`🔍 Searching: "${query}"`);
      const places = await searchRestaurants(query);
      
      for (const place of places) {
        const name = place.displayName?.text || place.displayName || "Unknown";
        const address = place.formattedAddress || "Honolulu, HI";
        
        // Skip if we already have this restaurant
        if (!allRestaurants.has(name.toLowerCase())) {
          allRestaurants.set(name.toLowerCase(), {
            name,
            address,
            cuisine: detectedCuisine(place.types),
          });
        }
      }
      
      // Rate limiting - wait between searches
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`\n✅ Found ${allRestaurants.size} unique restaurants\n`);

    // Insert into database
    console.log("💾 Inserting restaurants into database...");
    let insertedCount = 0;

    for (const restaurant of allRestaurants.values()) {
      try {
        await db.query(
          "INSERT INTO restaurants (name, address, cuisine) VALUES (?, ?, ?)",
          [restaurant.name, restaurant.address, restaurant.cuisine]
        );
        insertedCount++;
      } catch (error) {
        // Skip duplicates
      }
    }

    console.log(`✅ Inserted ${insertedCount} restaurants\n`);
    
    console.log(`==================================================`);
    console.log(`📊 Google Restaurants Import Summary`);
    console.log(`==================================================`);
    console.log(`✅ Total restaurants imported: ${insertedCount}`);
    console.log(`==================================================\n`);

    await db.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error.message);
    await db.end();
    process.exit(1);
  }
}

seedGoogleRestaurants();
