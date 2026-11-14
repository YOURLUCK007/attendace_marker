"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const students_1 = __importDefault(require("./routes/students"));
const faculty_1 = __importDefault(require("./routes/faculty"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const marks_1 = __importDefault(require("./routes/marks"));
const enrollments_1 = __importDefault(require("./routes/enrollments"));
const errorHandler = require('./middleware/errorHandler');
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json({ limit: "10kb" }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per window
});
app.use(limiter);
// Routes
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/students", students_1.default);
app.use("/api/v1/faculty", faculty_1.default);
app.use("/api/v1/attendance", attendance_1.default);
app.use("/api/v1/marks", marks_1.default);
app.use("/api/v1/enrollments", enrollments_1.default);
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
