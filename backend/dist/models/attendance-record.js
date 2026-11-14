"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AttendanceRecordSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    classSession: { type: mongoose_1.Schema.Types.ObjectId, ref: "ClassSession", required: true },
    status: {
        type: String,
        enum: ["PRESENT", "ABSENT", "ON_DUTY", "APPROVED_LEAVE", "CANCELLED_SESSION"],
        required: true
    },
    markedAt: { type: Date, default: Date.now },
    markedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Faculty" },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("AttendanceRecord", AttendanceRecordSchema);
