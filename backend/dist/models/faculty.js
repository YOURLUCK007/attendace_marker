"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FacultySchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: { type: String, required: true },
    subjects: [{ type: String }],
    classAssignments: [{ type: String }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Faculty", FacultySchema);
