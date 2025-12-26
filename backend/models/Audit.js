const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema({
  pdfId: String,
  beforeHash: String,
  afterHash: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Audit", AuditSchema);
