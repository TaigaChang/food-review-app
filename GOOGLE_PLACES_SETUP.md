# Google Places API Setup Guide

Import real restaurants from Google Places API into your Food Review App database.

## Overview

This guide will help you:
1. Set up Google Cloud Console and get API credentials
2. Enable the Places API
3. Configure environment variables
4. Import 50 restaurants from Honolulu

**Estimated time:** 15 minutes  
**Cost:** Free (with $300/month Google Cloud credit for new accounts)

---

## Prerequisites

- Google Cloud account (create one at [cloud.google.com](https://cloud.google.com))
- Node.js installed
- Running MySQL database (already set up)

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. At the top left, click the **Project** dropdown
3. Click **NEW PROJECT**
4. Enter project name: `Food Review App`
5. Click **CREATE**
6. Wait for the project to be created (may take a moment)
7. Make sure the new project is selected in the dropdown

---

## Step 2: Enable the Places API (New)

⚠️ **Important:** Make sure to enable the **Places API (New)**, not the legacy "Places API".

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Places API"** (you should see multiple results)
3. Look for **"Places API"** with "New" label or look for the one with the most recent icon
4. Click on it to open the API page
5. Click **ENABLE**
6. Wait 1-2 minutes for enabling to complete (this is important!)
7. Go back to APIs & Services → Library and verify it shows as "Enabled"

**If you enabled it recently:** Google can take 1-2 minutes to propagate the change. If you get a 403 error, wait a moment and try again.

---

## Step 3: Create API Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy the API Key (you'll see a blue info box showing your key)
4. Click anywhere outside the box to close it

---

## Step 4: Configure Environment Variables

1. Navigate to `server/` directory:
   ```bash
   cd server
   ```

2. Open `server/.env.google-places` and replace the placeholder:
   ```bash
   GOOGLE_PLACES_API_KEY=your_actual_api_key_here
   ```

   Replace `your_actual_api_key_here` with the key from Step 3.

3. Save the file

---

## Step 5: Run the Seeding Script

Make sure your MySQL database is running and connected, then:

```bash
cd server
node scripts/seed-google-places-restaurants.js
```

Expected output:
```
🔍 Searching for restaurants in Honolulu...
✅ Found 60 restaurants in search results

✅ [1/50] Inserted "Restaurant Name" (ID: 123)
✅ [2/50] Inserted "Another Restaurant" (ID: 124)
⏭️  [3/50] Skipping "Known Restaurant" (already exists)
...

==================================================
📊 Seeding Summary
==================================================
✅ Inserted: 48
⏭️  Skipped: 2
❌ Errors: 0
==================================================

✨ Restaurants have been successfully imported from Google Places!
```

---

## Step 6: Verify the Data

Check that restaurants were added:

```bash
mysql -u root -p food_review_app -e "SELECT COUNT(*) as total, COUNT(DISTINCT image_url) as with_images FROM restaurants;"
```

Expected result: Should show restaurants with image URLs populated.

---

## Step 7: Test in the App

1. Start your development server:
   ```bash
   cd client
   npm run dev
   ```

2. Go to `http://localhost:3000/restaurants`
3. You should see real restaurant images and data from Honolulu

---

## Troubleshooting

### API Key Error
```
Error: GOOGLE_PLACES_API_KEY not set in .env.google-places
```
**Solution:** Make sure you've added your API key to `server/.env.google-places`

### Places API (New) Not Enabled (403 Forbidden)
```
Error: API request failed: 403 Places API (New) has not been used in project X before or it is disabled
```
**Solution:**
- Go to the Google provided link in the error message, or navigate to [Google Cloud Console](https://console.cloud.google.com/)
- Go to **APIs & Services** → **Library**
- Search for "Places API"
- Make sure you enable **Places API (New)** (not the legacy one)
- Wait 1-2 minutes for the change to propagate
- Try running the script again

### Invalid API Key (403 Forbidden)
```
Error: API request failed: 403 Request denied
```
**Solution:** 
- Verify API key is correct (copy from Cloud Console → Credentials)
- Make sure Places API (New) is enabled in APIs & Services
- Check that billing is enabled for your project

### Rate Limiting (429 Too Many Requests)
**Solution:** Script automatically adds delays between requests. If you see this, wait a few minutes and try again.

### No Images Showing
**Possible causes:**
- Photos not available for restaurants (some may not have photos)
- Photo URLs might be expired (Google URLs have expiration times)

**Solution:** Re-run the seeding script to refresh image URLs.

---

## Setting Up Billing (if needed)

Google Cloud provides **$300 in free credits** for new accounts:

1. Go to **Billing** in Cloud Console
2. Click **Link Billing Account**
3. Complete the setup (requires credit card for verification only)
4. Your $300 credit should be applied automatically

The seeding of 50 restaurants will cost minimal to nothing (well under the free tier).

---

## Data Included

Each restaurant imported includes:

- ✅ Name
- ✅ Address
- ✅ Phone number
- ✅ Cuisine type (detected from Google Places categories)
- ✅ Opening hours (formatted as JSON)
- ✅ Image URL (first available photo from Google)
- ✅ Google Places rating (can be added to aggregated ratings)

---

## What Gets Stored

The script creates or updates restaurant records with:

```sql
INSERT INTO restaurants (
  name, 
  cuisine, 
  address, 
  phone, 
  image_url, 
  hours, 
  rating_source
) VALUES (...)
```

- `rating_source` is set to `"google_places"`
- Restaurants are checked for duplicates before insertion
- Images are stored as direct Google Photo URLs

---

## Script Details

**File:** `server/scripts/seed-google-places-restaurants.js`

**What it does:**
1. Searches for restaurants within 15km radius of Honolulu
2. Gets details including phone, hours, and photos
3. Checks if restaurant already exists before adding
4. Inserts into database with Google Places metadata
5. Handles rate limiting with 100ms delays
6. Reports summary of inserted/skipped/errors

**Search parameters:**
- Location: Honolulu (21.3099°N, 157.9581°W)
- Radius: 15 km
- Type: Restaurant
- Max results: 50

---

## Next Steps

After successful seeding:

1. **View restaurants:** Go to `/restaurants` to see real data
2. **Add reviews:** Test the review system with real restaurants
3. **Manage images:** Images are cached by Google (may expire)
4. **Update data:** Re-run script to get latest info and refresh images

---

## Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Cloud Console](https://console.cloud.google.com/)
- [Pricing & Quotas](https://developers.google.com/maps/billing-and-pricing/pricing)

---

## Notes

- Google provides **50 free requests per day** with Places API (free tier)
- Seeding 50 restaurants will use your quota quickly
- After free tier, costs are ~$0.032 per request (very cheap for local development)
- Consider reducing search radius or result limit if costs are a concern
- Images are served directly from Google (no storage needed)

---

**Questions?** Check the troubleshooting section above or review the script output for error messages.
