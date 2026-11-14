"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const faculty_1 = require("../models/faculty");
const router = express_1.default.Router();
// GET all faculty
router.get("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const faculty = await faculty_1.Faculty.find().select("-password");
        res.json(faculty);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching faculty" });
    }
});
// GET single faculty
router.get("/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const faculty = await faculty_1.Faculty.findById(req.params.id).select("-password");
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.json(faculty);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching faculty" });
    }
});
// CREATE faculty
router.post("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const faculty = new faculty_1.Faculty(req.body);
        await faculty.save();
        res.status(201).json(faculty);
    }
    catch (error) {
        res.status(400).json({ message: "Error creating faculty" });
    }
});
// PATCH faculty
router.patch("/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const faculty = await faculty_1.Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.json(faculty);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating faculty" });
    }
});
exports.default = router;
