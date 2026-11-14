const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AcademicYearSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicYear", AcademicYearSchema);