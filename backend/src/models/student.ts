import mongoose, { Document, model, Schema } from "mongoose";

export interface IStudent extends Document {
  registerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  course?: string;
  currentSemester?: string;
  profile: string;
  attendanceRecords: string[];
  internalMarks: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
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

export default model<IStudent>("Student", StudentSchema);