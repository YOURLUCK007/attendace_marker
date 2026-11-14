import mongoose, { Document, model, Schema } from "mongoose";

export interface IFaculty extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  subjects: string[];
  classAssignments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: { type: String, required: true },
    subjects: [{ type: String }],
    classAssignments: [{ type: String }],
  },
  { timestamps: true }
);

export default model<IFaculty>("Faculty", FacultySchema);