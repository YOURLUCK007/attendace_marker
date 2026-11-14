const express = require("express");
const router = express.Router();
const Enrollment = require("../models/enrollment");
const Student = require("../models/student");
const Course = require("../models/course");
const Semester = require("../models/semester");
const AcademicYear = require("../models/academic-year");

// GET all enrollments
router.get("/", (req, res) => {
  try {
    const enrollments = Enrollment.find()
      .populate("studentId", "firstName lastName registerNumber")
      .populate("courseId", "name code")
      .populate("semesterId", "name");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments" });
  }
});

// GET enrollment by student
router.get("/students/:id", (req, res) => {
  try {
    const enrollments = Enrollment.find({ studentId: req.params.id })
      .populate("courseId", "name code")
      .populate("semesterId", "name");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student enrollments" });
  }
});

// CREATE enrollment
router.post("/", (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: "Error creating enrollment" });
  }
});

// PATCH enrollment status
router.patch("/:id/status", (req, res) => {
  try {
    const enrollment = Enrollment.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    ).populate("studentId", "firstName lastName registerNumber");
    
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error updating enrollment" });
  }
});

module.exports = router;