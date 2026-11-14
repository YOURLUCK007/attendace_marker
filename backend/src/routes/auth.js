const express = require("express");
const router = express.Router();

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Authenticate user and return token
  res.json({ token: "mock-jwt-token", user: { id: "1", email, role: "ADMIN" } });
});

// Get current user
router.get("/me", (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;