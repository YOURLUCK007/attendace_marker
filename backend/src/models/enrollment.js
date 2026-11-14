const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
    academicYear: { type: Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: { type: String, default: "ACTIVE" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);