"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const models_1 = require("../models");
const router = express_1.default.Router();
// GET attendance records
router.get("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const records = await models_1.AttendanceRecord.find()
            .populate("studentId", "firstName lastName email")
            .populate("classSessionId", "className subjectName");
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching attendance records" });
    }
});
// GET attendance by student
router.get("/students/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const records = await models_1.AttendanceRecord.find({ studentId: req.params.id })
            .populate("classSessionId", "className subjectName date")
            .sort({ markedAt: -1 });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching student attendance" });
    }
});
// GET attendance by subject/class
router.get("/subject/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const records = await models_1.AttendanceRecord.find({
            classSessionId: req.params.id
        })
            .populate("studentId", "firstName lastName email");
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching subject attendance" });
    }
});
// Create attendance session
router.post("/sessions", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const { classId, subjectId, date, status } = req.body;
        const session = new models_1.ClassSession({
            classId,
            subjectId,
            date: new Date(date),
            status: status || "OPEN"
        });
        await session.save();
        res.status(201).json(session);
    }
    catch (error) {
        res.status(400).json({ message: "Error creating attendance session" });
    }
});
// Mark attendance
router.post("/sessions/:id/mark", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { studentId, status } = req.body;
        // Check if student already marked
        const existing = await models_1.AttendanceRecord.findOne({
            classSessionId: sessionId,
            studentId
        });
        if (existing) {
            return res.status(400).json({ message: "Attendance already marked for this student" });
        }
        const record = new models_1.AttendanceRecord({
            classSessionId: sessionId,
            studentId,
            status: status || "PRESENT"
        });
        await record.save();
        res.status(201).json(record);
    }
    catch (error) {
        res.status(500).json({ message: "Error marking attendance" });
    }
});
// Submit attendance
router.post("/sessions/:id/submit", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const { sessionId } = req.params;
        // Update session status to SUBMITTED
        await models_1.ClassSession.findByIdAndUpdate(sessionId, { status: "SUBMITTED" });
        res.json({ message: "Attendance submitted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error submitting attendance" });
    }
});
exports.default = router;
