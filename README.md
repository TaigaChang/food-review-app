# food-review-app Taiga Chang 10/25/2025

Create an app that works similarly to yelp with some changes. The first change would be to instead of using a metric like 5 stars, we would use a 100 point systems with different categories like taste, ingredients, ambiance, pricing.

The second change would be that it would find similar ratings to the food you found to show you if that is actually what you would want to rate it.

Finally, instead of a restaurant being able to rest on its laurels, it would have a system where you can find the ratings of the restaurant within 1 year or 1 month, so that you would know if the quality of the food has changed over time.

 High-Level System Architecture

 Tech Stack: 

*  Frontend:  React
*  Backend:  Node.js + Express
*  Database:  SQL (PostgreSQL or MySQL)
*  Authentication:  JSON Web Tokens (JWT)
*  Hosting (optional): 

---

 System Overview

1.  Users 

   * Sign up, log in, and authenticate with JWT.
   * Can rate restaurants on a 100-point scale across multiple categories .
   * Can browse restaurants, read reviews, and filter by  recent ratings (1 month / 1 year) .

2.  Restaurants 

   * Each restaurant has metadata (name, address, cuisine type, etc.)
   * Ratings over time can be aggregated to track quality trends .

3.  Reviews 

   * Each review includes:

     * Ratings for Taste, Ingredients, Ambiance, Pricing 
     * Optional text comment
     * Timestamp

4.  Recommendation Engine 

   * When a user rates a dish, find  similar dishes  or restaurants based on average rating (e.g. 	similarity between taste/ingredient/ambiance/pricing scores).


Database Design (SQL Schema)

# Tables

  users 

| column        | type         | details         |
| ------------- | ------------ | --------------- |
| id (PK)       | INT AUTO_INC | primary key     |
| name          | VARCHAR(100) | user's name     |
| email         | VARCHAR(255) | unique          |
| password_hash | VARCHAR(255) | hashed password |
| created_at    | TIMESTAMP    | default now()   |

---

  restaurants 

| column     | type         | details       |
| ---------- | ------------ | ------------- |
| id (PK)    | INT AUTO_INC | primary key   |
| name       | VARCHAR(255) |               |
| address    | VARCHAR(255) |               |
| cuisine    | VARCHAR(100) |               |
| created_at | TIMESTAMP    | default now() |

---

  reviews 

| column             | type         | details                    |
| ------------------ | ------------ | -------------------------- |
| id (PK)            | INT AUTO_INC | primary key                |
| user_id (FK)       | INT          | references users(id)       |
| restaurant_id (FK) | INT          | references restaurants(id) |
| taste              | INT (0–100)  |                            |
| ingredients        | INT (0–100)  |                            |
| ambiance           | INT (0–100)  |                            |
| pricing            | INT (0–100)  |                            |
| comment            | TEXT         | optional                   |
| created_at         | TIMESTAMP    | default now()              |

---

  aggregated_ratings (optional materialized view or cached table) 

| restaurant_id | avg_taste | avg_ingredients | avg_ambiance | avg_pricing | avg_overall | period | updated_at |
|----------------|------------|-----------------|---------------|---------------|--------------|-------------|
| 1 | 82 | 75 | 90 | 70 | 79 | '1_year' | ... |
| 1 | 88 | 80 | 85 | 78 | 82 | '1_month' | ... |


Authentication Flow


 Frontend (React): 

1. User signs up → sends POST `/api/auth/signup`
2. User logs in → sends POST `/api/auth/login`
3. Backend returns a  JWT 
4. Token is stored in localStorage or HttpOnly cookie
5. Protected routes send token in Authorization header (`Bearer <token>`)

 Backend (Node.js / Express): 

* Middleware `authenticateToken` checks JWT before protected routes (like adding reviews).

 Endpoints: 

* `POST /api/auth/signup`
* `POST /api/auth/login`
* `GET /api/auth/me` → returns current user info

 Example Middleware: 

```js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};
```


Backend API Routes

| Method | Endpoint                                    | Description                      |
| ------ | ------------------------------------------- | -------------------------------- |
| `POST` | `/api/auth/signup`                          | Create a user                    |
| `POST` | `/api/auth/login`                           | Login and receive token          |
| `GET`  | `/api/auth/me`                              | Return current authenticated user info |
| `GET`  | `/api/restaurants`                          | List restaurants                 |
| `GET`  | `/api/restaurants/:id`                      | Get restaurant details + ratings |
| `POST` | `/api/reviews`                              | Add review (protected)           |
| `GET`  | `/api/reviews/restaurant/:id`               | Get reviews for a restaurant     |
| `GET`  | `/api/restaurants/:id/trends?period=1month` | Get time-based rating averages   |
| `GET`  | `/api/recommendations/:restaurantId`        | Get similar restaurants          |

Recommendation Logic (Simplified)

Use cosine similarity between restaurant rating vectors:

```js
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val 2, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val 2, 0));
  return dot / (magA * magB);
}
```

Store each restaurant’s average vector:

```js
[taste_avg, ingredients_avg, ambiance_avg, pricing_avg]
```

Then compare the target restaurant’s vector against others to find top matches.


Frontend Architecture (React)

 Pages: 

* `/login` — user login
* `/signup` — user signup
* `/restaurants` — restaurant list
* `/restaurants/:id` — restaurant details, reviews, trends, and similar restaurants
* `/add-review/:restaurantId` — review form

 State: 

* Global Auth State (`user`, `token`)
* Restaurant Data & Filters (period: "1month" or "1year")

 API Service Layer Example: 

```js
// api.js
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

 Component Example (Ratings Overview): 

```jsx
function RatingBar({ label, value }) {
  return (
    <div className="rating-bar">
      <span>{label}</span>
      <progress value={value} max="100">{value}</progress>
      <span>{value}</span>
    </div>
  );
}
```
Time-Based Ratings (Trend Analysis)

 Backend Query Example (PostgreSQL): 

```sql
SELECT
  AVG(taste) as avg_taste,
  AVG(ingredients) as avg_ingredients,
  AVG(ambiance) as avg_ambiance,
  AVG(pricing) as avg_pricing
FROM reviews
WHERE restaurant_id = $1
  AND created_at >= NOW() - INTERVAL '1 month';
```

Frontend can toggle between “Last Month” and “Last Year”.


Summary of Design

| Layer             | Tool               | Purpose                        |
| ----------------- | ------------------ | ------------------------------ |
| Frontend          | React              | UI, routing, token handling    |
| Backend           | Express            | REST API, auth, business logic |
| Database          | SQL                | Persistent storage             |
| Auth              | JWT                | Secure user sessions           |
| Trend Analysis    | SQL + date filters | Quality over time              |
| Similarity Engine | Node.js            | Recommend similar restaurants  |


