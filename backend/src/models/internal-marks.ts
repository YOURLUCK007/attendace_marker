import mongoose, { Document, model, Schema } from "mongoose";

export interface IInternalMarks extends Document {
  student: string;
  subject: string;
  assessment?: string;
  obtainedMarks: number;
  attendancePercentage: number;
  finalGrade?: string;
}

const InternalMarksSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    assessment: { type: Schema.Types.ObjectId, ref: "InternalAssessment" },
    obtainedMarks: { type: Number, required: true },
    attendancePercentage: { type: Number, required: true },
    finalGrade: { type: String },
  },
  { timestamps: true }
);

export default model<IInternalMarks>("InternalMarks", InternalMarksSchema);