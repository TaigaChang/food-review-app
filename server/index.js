import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authenticateToken from "./middleware/authenticate_token.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Public health endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Example unprotected API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the API" });
});

// Example protected endpoint — requires a valid JWT
app.get("/api/protected", authenticateToken, (req, res) => {
  // `authenticateToken` attaches the decoded token payload to `req.user`.
  res.json({ message: "Protected route accessed", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));