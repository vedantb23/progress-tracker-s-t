const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('../models/Project');
const Category = require('../models/Category');
const Item = require('../models/Item');
const seedData = require('./seedData');

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDB() {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Clear existing data
    await Project.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing database collections.');

    // Create Project
    const project = await Project.create(seedData.project);
    console.log(`Created Project: ${project.title} (ID: ${project._id})`);

    // Create Categories & Items
    for (const catData of seedData.categories) {
      const category = await Category.create({
        projectId: project._id,
        name: catData.name,
        overallWeightage: catData.overallWeightage,
      });

      const itemsToInsert = catData.items.map((item) => ({
        categoryId: category._id,
        sNo: item.sNo,
        description: item.description,
        uom: item.uom,
        scopeQuantity: item.scopeQuantity,
        executedQuantity: item.executedQuantity,
        weightageFactor: item.weightageFactor,
      }));

      await Item.insertMany(itemsToInsert);
      console.log(`Seeded category "${category.name}" with ${itemsToInsert.length} items.`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDB();
