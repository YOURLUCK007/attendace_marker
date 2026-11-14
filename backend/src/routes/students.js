const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// GET all students (admin only)
router.get("/", (req, res) => {
  try {
    const students = Student.find().select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// GET single student
router.get("/:id", (req, res) => {
  try {
    const student = Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student" });
  }
});

// CREATE student
router.post("/", (req, res) => {
  try {
    const student = new Student(req.body);
    student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: "Error creating student" });
  }
});

// PATCH student
router.patch("/:id", (req, res) => {
  try {
    const student = Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
});

// DELETE student
router.delete("/:id", (req, res) => {
  try {
    const student = Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

module.exports = router;