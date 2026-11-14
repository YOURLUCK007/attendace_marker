const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);