"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    // Authenticate user and return token
    res.json({ token: "mock-jwt-token", user: { id: "1", email, role: "ADMIN" } });
});
// Get current user
router.get("/me", auth_1.verifyToken, (req, res) => {
    res.json({ user: res.locals.user });
});
exports.default = router;
