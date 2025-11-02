import express from "express";
import authenticateToken from "../middleware/authenticate_token.js";
import { signupHandler } from "../services/auth-service.js";
const router = express.Router();

// Public routes (no auth required)
router.post("/signup", (req, res, next) => {
    // console.log('Router received body:', req.body); // Debug log
    signupHandler(req, res, next);
});

router.post("/login", (req, res) => {
    res.status(501).json({ message: "Login not implemented yet" });
});

// Test endpoint to verify routing
router.get("/test", (req, res) => {
    res.json({ message: "Auth routes working" });
});

// Protected routes (require auth)
router.get("/me", authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

export default router;


