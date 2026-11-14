"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const models_1 = require("../models");
const router = express_1.default.Router();
// GET all enrollments
router.get("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const enrollments = await models_1.Enrollment.find()
            .populate("studentId", "firstName lastName registerNumber")
            .populate("courseId", "name code")
            .populate("semesterId", "name");
        res.json(enrollments);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching enrollments" });
    }
});
// GET enrollment by student
router.get("/students/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const enrollments = await models_1.Enrollment.find({ studentId: req.params.id })
            .populate("courseId", "name code")
            .populate("semesterId", "name");
        res.json(enrollments);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching student enrollments" });
    }
});
// CREATE enrollment
router.post("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const enrollment = new models_1.Enrollment(req.body);
        await enrollment.save();
        res.status(201).json(enrollment);
    }
    catch (error) {
        res.status(400).json({ message: "Error creating enrollment" });
    }
});
// PATCH enrollment status
router.patch("/:id/status", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const enrollment = await models_1.Enrollment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate("studentId", "firstName lastName registerNumber");
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json(enrollment);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating enrollment" });
    }
});
exports.default = router;
