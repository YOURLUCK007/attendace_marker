import express from "express";
import { verifyToken, authorize } from "../middleware/auth";
import { Enrollment, Student, Course, Semester } from "../models";

const router = express.Router();

// GET all enrollments
router.get("/", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("studentId", "firstName lastName registerNumber")
      .populate("courseId", "name code")
      .populate("semesterId", "name");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments" });
  }
});

// GET enrollment by student
router.get("/students/:id", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.id })
      .populate("courseId", "name code")
      .populate("semesterId", "name");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student enrollments" });
  }
});

// CREATE enrollment
router.post("/", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: "Error creating enrollment" });
  }
});

// PATCH enrollment status
router.patch("/:id/status", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
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

export default router;