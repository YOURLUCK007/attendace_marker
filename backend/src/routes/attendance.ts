import express from "express";
import { verifyToken, authorize } from "../middleware/auth";
import { ClassSession, AttendanceRecord } from "../models";

const router = express.Router();

// GET attendance records
router.get("/", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const records = await AttendanceRecord.find()
      .populate("studentId", "firstName lastName email")
      .populate("classSessionId", "className subjectName");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance records" });
  }
});

// GET attendance by student
router.get("/students/:id", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const records = await AttendanceRecord.find({ studentId: req.params.id })
      .populate("classSessionId", "className subjectName date")
      .sort({ markedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student attendance" });
  }
});

// GET attendance by subject/class
router.get("/subject/:id", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const records = await AttendanceRecord.find({
      classSessionId: req.params.id
    })
      .populate("studentId", "firstName lastName email");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject attendance" });
  }
});

// Create attendance session
router.post("/sessions", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const { classId, subjectId, date, status } = req.body;
    const session = new ClassSession({
      classId,
      subjectId,
      date: new Date(date),
      status: status || "OPEN"
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: "Error creating attendance session" });
  }
});

// Mark attendance
router.post("/sessions/:id/mark", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { studentId, status } = req.body;
    
    // Check if student already marked
    const existing = await AttendanceRecord.findOne({
      classSessionId: sessionId,
      studentId
    });
    
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this student" });
    }
    
    const record = new AttendanceRecord({
      classSessionId: sessionId,
      studentId,
      status: status || "PRESENT"
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance" });
  }
});

// Submit attendance
router.post("/sessions/:id/submit", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Update session status to SUBMITTED
    await ClassSession.findByIdAndUpdate(sessionId, { status: "SUBMITTED" });
    
    res.json({ message: "Attendance submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting attendance" });
  }
});

export default router;