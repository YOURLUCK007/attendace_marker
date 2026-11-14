const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SystemSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("SystemSettings", SystemSettingsSchema);