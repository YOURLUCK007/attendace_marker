const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    registerNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: { type: String, required: true },
    course: { type: String },
    currentSemester: { type: String },
    profile: { type: String, required: true },
    attendanceRecords: [{ type: Schema.Types.ObjectId, ref: "AttendanceRecord" }],
    internalMarks: [{ type: Schema.Types.ObjectId, ref: "InternalMarks" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);