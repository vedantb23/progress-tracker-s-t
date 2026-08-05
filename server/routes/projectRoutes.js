const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Category = require('../models/Category');
const Item = require('../models/Item');
const { calculateItemStats } = require('../utils/calculations');

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    const results = await Promise.all(
      projects.map(async (project) => {
        const categories = await Category.find({ projectId: project._id });
        const categoryIds = categories.map((c) => c._id);
        const items = await Item.find({ categoryId: { $in: categoryIds } });

        const timelineProgress =
          project.totalPlannedDays > 0
            ? (project.daysElapsed / project.totalPlannedDays) * 100
            : 0;

        let overallProjectEarnedProgress = 0;
        let totalItems = items.length;
        let laggingItemsCount = 0;

        for (const category of categories) {
          const catItems = items.filter(
            (i) => i.categoryId.toString() === category._id.toString()
          );

          let catEarnedProgress = 0;
          let catTotalScope = 0;
          let catTotalExecuted = 0;

          catItems.forEach((item) => {
            const stats = calculateItemStats(item, timelineProgress);
            catEarnedProgress += stats.earnedProgress;
            catTotalScope += item.scopeQuantity;
            catTotalExecuted += item.executedQuantity;
            if (stats.isLagging) laggingItemsCount++;
          });

          const catPercentProgress =
            catTotalScope > 0
              ? (catTotalExecuted / catTotalScope) * 100
              : catEarnedProgress;

          const catContributionToProject =
            catPercentProgress * (category.overallWeightage / 100);

          overallProjectEarnedProgress += catContributionToProject;
        }

        return {
          ...project.toObject(),
          timelineProgress: Number(timelineProgress.toFixed(2)),
          overallProgress: Number(Math.min(100, overallProjectEarnedProgress).toFixed(2)),
          totalItems,
          laggingItemsCount,
          categoryCount: categories.length,
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, location, totalPlannedDays, daysElapsed } = req.body;

    if (!title || !location) {
      return res.status(400).json({ error: 'Title and location are required' });
    }

    const project = await Project.create({
      title,
      location,
      totalPlannedDays: Number(totalPlannedDays) || 180,
      daysElapsed: Number(daysElapsed) || 0,
    });

    const defaultCategories = [
      { name: 'Indoor Work', overallWeightage: 40 },
      { name: 'Outdoor Work', overallWeightage: 30 },
      { name: 'Cables', overallWeightage: 20 },
      { name: 'Telecom', overallWeightage: 10 },
    ];

    for (const cat of defaultCategories) {
      await Category.create({
        projectId: project._id,
        name: cat.name,
        overallWeightage: cat.overallWeightage,
      });
    }

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.get('/:id/dashboard', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const categories = await Category.find({ projectId: id });
    const timelineProgress =
      project.totalPlannedDays > 0
        ? (project.daysElapsed / project.totalPlannedDays) * 100
        : 0;

    let overallProjectEarnedProgress = 0;
    const categorySummaries = [];
    const chartDataByCategory = {};

    for (const category of categories) {
      const items = await Item.find({ categoryId: category._id }).sort({ sNo: 1 });

      let catEarnedProgress = 0;
      let catTotalScope = 0;
      let catTotalExecuted = 0;
      let catLaggingCount = 0;

      const processedItems = items.map((item) => {
        const stats = calculateItemStats(item, timelineProgress);
        catEarnedProgress += stats.earnedProgress;
        catTotalScope += item.scopeQuantity;
        catTotalExecuted += item.executedQuantity;
        if (stats.isLagging) catLaggingCount++;
        return stats;
      });

      const catPercentProgress =
        catTotalScope > 0
          ? (catTotalExecuted / catTotalScope) * 100
          : catEarnedProgress;

      const catContributionToProject =
        catPercentProgress * (category.overallWeightage / 100);

      overallProjectEarnedProgress += catContributionToProject;

      categorySummaries.push({
        categoryId: category._id,
        name: category.name,
        overallWeightage: category.overallWeightage,
        earnedProgress: Number(catContributionToProject.toFixed(2)),
        percentProgress: Number(catPercentProgress.toFixed(2)),
        totalScope: catTotalScope,
        totalExecuted: catTotalExecuted,
        laggingItemsCount: catLaggingCount,
        itemCount: items.length,
      });

      chartDataByCategory[category.name] = processedItems.map((item) => ({
        id: item._id,
        description: item.description,
        scopeQuantity: item.scopeQuantity,
        executedQuantity: item.executedQuantity,
        percentProgress: item.percentProgress,
        uom: item.uom,
        isLagging: item.isLagging,
      }));
    }

    res.json({
      project: {
        ...project.toObject(),
        timelineProgress: Number(timelineProgress.toFixed(2)),
        overallProgress: Number(Math.min(100, overallProjectEarnedProgress).toFixed(2)),
      },
      categorySummaries,
      chartDataByCategory,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const timelineProgress =
      project.totalPlannedDays > 0
        ? (project.daysElapsed / project.totalPlannedDays) * 100
        : 0;

    let categoryFilter = { projectId: id };
    if (category) {
      categoryFilter.name = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    const categories = await Category.find(categoryFilter);
    const categoryIds = categories.map((c) => c._id);

    const items = await Item.find({ categoryId: { $in: categoryIds } })
      .populate('categoryId', 'name overallWeightage')
      .sort({ sNo: 1 });

    const processedItems = items.map((item) =>
      calculateItemStats(item, timelineProgress)
    );

    res.json({
      project: {
        ...project.toObject(),
        timelineProgress: Number(timelineProgress.toFixed(2)),
      },
      items: processedItems,
    });
  } catch (error) {
    console.error('Error fetching project items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.post('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description, uom, scopeQuantity, executedQuantity, weightageFactor } = req.body;

    if (!description || !uom || !categoryName) {
      return res.status(400).json({ error: 'Category name, description, and UOM are required' });
    }

    let category = await Category.findOne({
      projectId: id,
      name: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') },
    });

    if (!category) {
      category = await Category.create({
        projectId: id,
        name: categoryName,
        overallWeightage: 10,
      });
    }

    const count = await Item.countDocuments({ categoryId: category._id });

    const newItem = await Item.create({
      categoryId: category._id,
      sNo: count + 1,
      description,
      uom,
      scopeQuantity: Number(scopeQuantity) || 0,
      executedQuantity: Number(executedQuantity) || 0,
      weightageFactor: Number(weightageFactor) || 0.01,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

module.exports = router;
