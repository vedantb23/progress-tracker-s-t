const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    totalPlannedDays: { type: Number, required: true, default: 180 },
    daysElapsed: { type: Number, required: true, default: 90 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
