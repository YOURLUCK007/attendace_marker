"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    registerNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: { type: String, required: true },
    course: { type: String },
    currentSemester: { type: String },
    profile: { type: String, required: true },
    attendanceRecords: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "AttendanceRecord" }],
    internalMarks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "InternalMarks" }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Student", StudentSchema);
