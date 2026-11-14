const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InternalMarksSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    assessment: { type: Schema.Types.ObjectId, ref: "InternalAssessment" },
    obtainedMarks: { type: Number, required: true },
    attendancePercentage: { type: Number, required: true },
    finalGrade: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternalMarks", InternalMarksSchema);