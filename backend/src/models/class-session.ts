import mongoose, { Document, model, Schema } from "mongoose";

export interface IClassSession extends Document {
  class: string;
  subject: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  status: string;
  attendanceRecords: string[];
}

const ClassSessionSchema: Schema = new Schema(
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

export default model<IClassSession>("ClassSession", ClassSessionSchema);