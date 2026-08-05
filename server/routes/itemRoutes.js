const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Category = require('../models/Category');
const Project = require('../models/Project');
const { calculateItemStats } = require('../utils/calculations');

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { executedQuantity } = req.body;

    if (executedQuantity === undefined || isNaN(Number(executedQuantity))) {
      return res.status(400).json({ error: 'Valid executedQuantity is required' });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.executedQuantity = Math.max(0, Number(executedQuantity));
    await item.save();

    const category = await Category.findById(item.categoryId);
    let timelineProgress = 0;
    if (category) {
      const project = await Project.findById(category.projectId);
      if (project && project.totalPlannedDays > 0) {
        timelineProgress = (project.daysElapsed / project.totalPlannedDays) * 100;
      }
    }

    const updatedStats = calculateItemStats(item, timelineProgress);

    res.json({
      message: 'Item progress updated successfully',
      item: updatedStats,
    });
  } catch (error) {
    console.error('Error updating item progress:', error);
    res.status(500).json({ error: 'Failed to update item progress' });
  }
});

module.exports = router;
