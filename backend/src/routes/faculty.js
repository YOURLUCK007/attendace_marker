const express = require("express");
const router = express.Router();
const Faculty = require("../models/faculty");

// GET all faculty
router.get("/", (req, res) => {
  try {
    const faculty = Faculty.find().select("-password");
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

// GET single faculty
router.get("/:id", (req, res) => {
  try {
    const faculty = Faculty.findById(req.params.id).select("-password");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

// CREATE faculty
router.post("/", (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: "Error creating faculty" });
  }
});

// PATCH faculty
router.patch("/:id", (req, res) => {
  try {
    const faculty = Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error updating faculty" });
  }
});

module.exports = router;