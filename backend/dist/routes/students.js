"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const student_1 = require("../models/student");
const router = express_1.default.Router();
// GET all students (admin only)
router.get("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const students = await student_1.Student.find().select("-password");
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching students" });
    }
});
// GET single student
router.get("/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const student = await student_1.Student.findById(req.params.id).select("-password");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching student" });
    }
});
// CREATE student
router.post("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const student = new student_1.Student(req.body);
        await student.save();
        res.status(201).json(student);
    }
    catch (error) {
        res.status(400).json({ message: "Error creating student" });
    }
});
// PATCH student
router.patch("/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const student = await student_1.Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating student" });
    }
});
// DELETE student
router.delete("/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN"), async (req, res) => {
    try {
        const student = await student_1.Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting student" });
    }
});
exports.default = router;
