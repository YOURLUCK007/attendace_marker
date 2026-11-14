const express = require("express");
const router = express.Router();
const ClassSession = require("../models/class-session");
const AttendanceRecord = require("../models/attendance-record");

// GET attendance records
router.get("/", (req, res) => {
  try {
    const records = AttendanceRecord.find()
      .populate("studentId", "firstName lastName email")
      .populate("classSessionId", "className subjectName");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance records" });
  }
});

// GET attendance by student
router.get("/students/:id", (req, res) => {
  try {
    const records = AttendanceRecord.find({ studentId: req.params.id })
      .populate("classSessionId", "className subjectName date")
      .sort({ markedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student attendance" });
  }
});

// GET attendance by subject/class
router.get("/subject/:id", (req, res) => {
  try {
    const records = AttendanceRecord.find({
      classSessionId: req.params.id
    })
      .populate("studentId", "firstName lastName email");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject attendance" });
  }
});

// Create attendance session
router.post("/sessions", (req, res) => {
  try {
    const { classId, subjectId, date, status } = req.body;
    const session = new ClassSession({
      classId,
      subjectId,
      date: new Date(date),
      status: status || "OPEN"
    });
    session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: "Error creating attendance session" });
  }
});

// Mark attendance
router.post("/sessions/:id/mark", (req, res) => {
  try {
    const { sessionId } = req.params;
    const { studentId, status } = req.body;
    
    // Check if student already marked
    const existing = AttendanceRecord.findOne({
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
    record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance" });
  }
});

// Submit attendance
router.post("/sessions/:id/submit", (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Update session status to SUBMITTED
    ClassSession.findByIdAndUpdate(sessionId, { status: "SUBMITTED" });
    
    res.json({ message: "Attendance submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting attendance" });
  }
});

module.exports = router;