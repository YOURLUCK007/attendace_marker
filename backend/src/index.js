require("dotenv/config");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const facultyRoutes = require("./routes/faculty");
const attendanceRoutes = require("./routes/attendance");
const marksRoutes = require("./routes/marks");
const enrollmentRoutes = require("./routes/enrollments");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json({ limit: "10kb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});
app.use(limiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/marks", marksRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});