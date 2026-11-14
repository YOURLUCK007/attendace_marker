import mongoose, { Document, model, Schema } from "mongoose";

export interface IAttendanceRecord extends Document {
  student: string;
  classSession: string;
  status: string;
  markedAt: Date;
  markedBy?: string;
}

const AttendanceRecordSchema: Schema = new Schema(
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

export default model<IAttendanceRecord>("AttendanceRecord", AttendanceRecordSchema);