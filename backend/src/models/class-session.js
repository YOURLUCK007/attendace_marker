const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSessionSchema = new Schema(
  {
    class: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: Date, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { 
      type: String, 
      enum: ["OPEN", "MARKED", "SUBMITTED"], 
      default: "OPEN" 
    },
    attendanceRecords: [{ type: Schema.Types.ObjectId, ref: "AttendanceRecord" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassSession", ClassSessionSchema);