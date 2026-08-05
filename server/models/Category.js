const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true }, // e.g. Indoor, Outdoor, Cables, Telecom
    overallWeightage: { type: Number, required: true }, // e.g., 40 for 40%
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
