import express from "express";
import { verifyToken, authorize } from "../middleware/auth";
import { Faculty } from "../models/faculty";

const router = express.Router();

// GET all faculty
router.get("/", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const faculty = await Faculty.find().select("-password");
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

// GET single faculty
router.get("/:id", verifyToken, authorize("ADMIN", "FACULTY"), async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).select("-password");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

// CREATE faculty
router.post("/", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: "Error creating faculty" });
  }
});

// PATCH faculty
router.patch("/:id", verifyToken, authorize("ADMIN"), async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error updating faculty" });
  }
});

export default router;