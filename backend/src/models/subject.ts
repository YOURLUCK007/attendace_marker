import mongoose, { Document, model, Schema } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  credits: number;
  department: string;
  faculty?: string;
  classes: string[];
  attendanceSessions: string[];
  internalAssessments: string[];
}

const SubjectSchema: Schema = new Schema(
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

export default model<ISubject>("Subject", SubjectSchema);