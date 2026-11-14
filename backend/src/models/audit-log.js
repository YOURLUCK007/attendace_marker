const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuditLogSchema = new Schema(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true }, // e.g., "STUDENT", "ATTENDANCE", "MARKS"
    entityId: { type: String, required: true },
    performedBy: { type: String, required: true }, // UUID of the user who performed the action
    performedByRole: { type: String, required: true }, // e.g., "ADMIN", "FACULTY"
    details: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);