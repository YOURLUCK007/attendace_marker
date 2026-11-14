import express from "express";
import { verifyToken, authorize } from "../middleware/auth";
import { Student } from "../models/student";

const router = express.Router();

// GET all students (admin only)
router.get("/", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// GET single student
router.get("/:id", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student" });
  }
});

// CREATE student
router.post("/", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: "Error creating student" });
  }
});

// PATCH student
router.patch("/:id", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
});

// DELETE student
router.delete("/:id", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

export default router;