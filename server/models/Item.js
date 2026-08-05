const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    sNo: { type: Number },
    description: { type: String, required: true },
    uom: { type: String, required: true }, // Unit of Measurement
    scopeQuantity: { type: Number, required: true, default: 0 },
    executedQuantity: { type: Number, required: true, default: 0 },
    weightageFactor: { type: Number, required: true, default: 0 }, // e.g. 0.12 or 0.05
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
