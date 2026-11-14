const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SemesterSchema = new Schema(
  {
    name: { type: String, required: true },
    year: { type: Schema.Types.ObjectId, ref: "AcademicYear" },
    code: { type: String },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Semester", SemesterSchema);