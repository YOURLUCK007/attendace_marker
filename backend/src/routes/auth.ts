import express from "express";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Authenticate user and return token
  res.json({ token: "mock-jwt-token", user: { id: "1", email, role: "ADMIN" } });
});

// Get current user
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: res.locals.user });
});

export default router;