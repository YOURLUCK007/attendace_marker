"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ClassSessionSchema = new mongoose_1.Schema({
    class: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: Date, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    status: {
        type: String,
        enum: ["OPEN", "MARKED", "SUBMITTED"],
        default: "OPEN"
    },
    attendanceRecords: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "AttendanceRecord" }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("ClassSession", ClassSessionSchema);
