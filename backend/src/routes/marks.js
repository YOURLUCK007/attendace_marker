const express = require("express");
const router = express.Router();
const InternalMarks = require("../models/internal-marks");
const InternalAssessment = require("../models/internal-assessment");
const Student = require("../models/student");
const Subject = require("../models/subject");

// GET all marks
router.get("/", (req, res) => {
  try {
    const marks = InternalMarks.find()
      .populate("studentId", "firstName lastName registerNumber")
      .populate("subjectId", "name code")
      .populate("assessmentId", "name type");
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching marks" });
  }
});

// GET marks by student
router.get("/students/:id", (req, res) => {
  try {
    const marks = InternalMarks.find({ studentId: req.params.id })
      .populate("subjectId", "name code")
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student marks" });
  }
});

// GET marks by subject
router.get("/subject/:id", (req, res) => {
  try {
    const marks = InternalMarks.find({ subjectId: req.params.id })
      .populate("studentId", "firstName lastName registerNumber")
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject marks" });
  }
});

// Create internal assessment
router.post("/assessments", (req, res) => {
  try {
    const assessment = new InternalAssessment(req.body);
    assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    res.status(400).json({ message: "Error creating assessment" });
  }
});

// Calculate and save marks
router.post("/calculate", (req, res) => {
  try {
    const { subjectId, academicYearId, semesterId } = req.body;
    
    // Get all students enrolled in the subject
    const students = Student.find({
      currentSemesterId: semesterId,
      departmentId: req.body.departmentId
    }).select("_id registerNumber firstName lastName");
    
    const results = [];
    
    for (const student of students) {
      // Get attendance percentage
      const attendanceRecords = AttendanceRecord.find({
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
      const subject = Subject.findById(subjectId);
      const assessment = InternalAssessment.findOne({
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
        if (percentage >= 95) finalGrade = "A+";
        else if (percentage >= 90) finalGrade = "A";
        else if (percentage >= 85) finalGrade = "B";
        else if (percentage >= 80) finalGrade = "C";
        else if (percentage >= 70) finalGrade = "D";
        else finalGrade = "F";
      }
      
      const markRecord = new InternalMarks({
        studentId: student._id,
        subjectId,
        assessmentId: assessment?._id,
        obtainedMarks,
        attendancePercentage: parseFloat(attendancePercentage),
        finalGrade
      });
      markRecord.save();
      
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
  } catch (error) {
    res.status(500).json({ message: "Error calculating marks" });
  }
});

module.exports = router;