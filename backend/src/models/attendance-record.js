const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceRecordSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    classSession: { type: Schema.Types.ObjectId, ref: "ClassSession", required: true },
    status: { 
      type: String, 
      enum: ["PRESENT", "ABSENT", "ON_DUTY", "APPROVED_LEAVE", "CANCELLED_SESSION"],
      required: true 
    },
    markedAt: { type: Date, default: Date.now },
    markedBy: { type: Schema.Types.ObjectId, ref: "Faculty" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AttendanceRecord", AttendanceRecordSchema);