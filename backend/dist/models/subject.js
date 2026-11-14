"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, min: 1 },
    department: { type: String, required: true },
    faculty: { type: mongoose_1.Schema.Types.ObjectId, ref: "Faculty" },
    classes: [{ type: String }],
    attendanceSessions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ClassSession" }],
    internalAssessments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "InternalAssessment" }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Subject", SubjectSchema);
