import express from "express";
import authenticateToken from "../middleware/authenticate_token.js";
import { signupHandler, loginHandler } from "../services/auth-service.js";
const router = express.Router();

// Public routes (no auth required)
router.post("/signup", signupHandler);

router.post("/login", loginHandler);

// Test endpoint to verify routing
router.get("/test", (req, res) => {
    res.json({ message: "Auth routes working" });
});

// Get user by ID (public - for review attribution)
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const pool = (await import('../db.js')).default;
    
    const [rows] = await pool.query(
      'SELECT id, name_first, name_last, email FROM users WHERE id = ?',
      [userId]
    );
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Protected routes (require auth)
router.get('/me', authenticateToken, (req, res) => {
  // assume authenticateToken sets req.user = { id, email, name_first, name_last, ... }
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { id, email, name_first, name_last } = req.user;
  res.json({ user: { id, email, name_first, name_last } });
});

export default router;


