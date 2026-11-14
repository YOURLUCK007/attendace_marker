"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or invalid token" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret-key");
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.verifyToken = verifyToken;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user?.role) {
            return res.status(403).json({ message: "Unauthorized - no role" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden - insufficient permissions" });
        }
        next();
    };
};
exports.authorize = authorize;
exports.default = { verifyToken: exports.verifyToken, authorize: exports.authorize };
