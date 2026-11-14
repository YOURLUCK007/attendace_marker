const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InternalAssessmentSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["INTERNAL_TEST_1", "INTERNAL_TEST_2", "ASSIGNMENT", "PROJECT", "PRACTICAL", "OTHER"], required: true },
    maxMarks: { type: Number, required: true },
    minAttendance: { type: Number },
    weight: { type: Number, default: 1.0 },
    semester: { type: Schema.Types.ObjectId, ref: "Semester" },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    academicYear: { type: Schema.Types.ObjectId, ref: "AcademicYear" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternalAssessment", InternalAssessmentSchema);