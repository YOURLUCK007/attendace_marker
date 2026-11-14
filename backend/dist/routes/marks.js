"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const models_1 = require("../models");
const router = express_1.default.Router();
// GET all marks
router.get("/", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const marks = await models_1.InternalMarks.find()
            .populate("studentId", "firstName lastName registerNumber")
            .populate("subjectId", "name code")
            .populate("assessmentId", "name type");
        res.json(marks);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching marks" });
    }
});
// GET marks by student
router.get("/students/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const marks = await models_1.InternalMarks.find({ studentId: req.params.id })
            .populate("subjectId", "name code")
            .sort({ createdAt: -1 });
        res.json(marks);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching student marks" });
    }
});
// GET marks by subject
router.get("/subject/:id", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const marks = await models_1.InternalMarks.find({ subjectId: req.params.id })
            .populate("studentId", "firstName lastName registerNumber")
            .sort({ createdAt: -1 });
        res.json(marks);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching subject marks" });
    }
});
// Create internal assessment
router.post("/assessments", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const assessment = new models_1.InternalAssessment(req.body);
        await assessment.save();
        res.status(201).json(assessment);
    }
    catch (error) {
        res.status(400).json({ message: "Error creating assessment" });
    }
});
// Calculate and save marks
router.post("/calculate", auth_1.verifyToken, (0, auth_1.authorize)("ADMIN", "FACULTY"), async (req, res) => {
    try {
        const { subjectId, academicYearId, semesterId } = req.body;
        // Get all students enrolled in the subject
        const students = await models_1.Student.find({
            currentSemesterId: semesterId,
            departmentId: req.body.departmentId
        }).select("_id registerNumber firstName lastName");
        const results = [];
        for (const student of students) {
            // Get attendance percentage
            const attendanceRecords = await AttendanceRecord.find({
                studentId: student._id,
                classSessionId: { $exists: true }
            });
            let presentCount = 0;
            let totalEligible = 0;
            attendanceRecords.forEach(record => {
                if (record.status === "PRESENT") {
                    presentCount++;
                }
                if (record.status !== "CANCELLED_SESSION") {
                    totalEligible++;
                }
            });
            const attendancePercentage = totalEligible > 0
                ? (presentCount / totalEligible * 100).toFixed(2)
                : 0;
            // Get subject and assessment
            const subject = await models_1.Subject.findById(subjectId);
            const assessment = await models_1.InternalAssessment.findOne({
                subjectId,
                academicYearId,
                semesterId
            });
            let obtainedMarks = 0;
            let finalGrade = "F";
            if (assessment) {
                const { marksPerRange, maxMarks } = assessment;
                // Simple calculation based on attendance percentage
                obtainedMarks = Math.round((parseFloat(attendancePercentage) / 100) * maxMarks);
                // Determine grade based on ranges
                const percentage = parseFloat(attendancePercentage);
                if (percentage >= 95)
                    finalGrade = "A+";
                else if (percentage >= 90)
                    finalGrade = "A";
                else if (percentage >= 85)
                    finalGrade = "B";
                else if (percentage >= 80)
                    finalGrade = "C";
                else if (percentage >= 70)
                    finalGrade = "D";
                else
                    finalGrade = "F";
            }
            const markRecord = new models_1.InternalMarks({
                studentId: student._id,
                subjectId,
                assessmentId: assessment?._id,
                obtainedMarks,
                attendancePercentage: parseFloat(attendancePercentage),
                finalGrade
            });
            await markRecord.save();
            results.push({
                studentId: student._id,
                registerNumber: student.registerNumber,
                name: `${student.firstName} ${student.lastName}`,
                attendancePercentage,
                obtainedMarks,
                maxMarks: assessment?.maxMarks || 10,
                finalGrade
            });
        }
        res.json({ message: "Marks calculated successfully", results });
    }
    catch (error) {
        res.status(500).json({ message: "Error calculating marks" });
    }
});
exports.default = router;
