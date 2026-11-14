const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, min: 1 },
    department: { type: String, required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty" },
    classes: [{ type: String }],
    attendanceSessions: [{ type: Schema.Types.ObjectId, ref: "ClassSession" }],
    internalAssessments: [{ type: Schema.Types.ObjectId, ref: "InternalAssessment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);