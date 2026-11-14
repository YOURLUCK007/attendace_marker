"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InternalMarksSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subject", required: true },
    assessment: { type: mongoose_1.Schema.Types.ObjectId, ref: "InternalAssessment" },
    obtainedMarks: { type: Number, required: true },
    attendancePercentage: { type: Number, required: true },
    finalGrade: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("InternalMarks", InternalMarksSchema);
