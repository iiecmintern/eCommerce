const mongoose = require("mongoose");
const Plan = require("../models/subscription/Plan");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    return false;
  }
};

const plans = [
  {
    name: "Starter",
    description: "Perfect for new businesses and side projects",
    type: "starter",
    pricing: {
      monthly: 29,
      annual: 299,
      currency: "USD",
    },
    features: {
      products: "1000",
      storage: "10GB",
      analytics: true,
      multiCurrency: false,
      apiAccess: false,
      whiteLabel: false,
      customIntegrations: false,
      prioritySupport: false,
      dedicatedSupport: false,
    },
    limits: {
      maxProducts: 1000,
      maxStorageGB: 10,
      maxApiCalls: 0,
      maxUsers: 1,
    },
    isPopular: false,
    trialDays: 14,
    sortOrder: 1,
  },
  {
    name: "Professional",
    description: "Best for growing businesses and established stores",
    type: "professional",
    pricing: {
      monthly: 79,
      annual: 799,
      currency: "USD",
    },
    features: {
      products: "10000",
      storage: "100GB",
      analytics: true,
      multiCurrency: true,
      apiAccess: false,
      whiteLabel: false,
      customIntegrations: false,
      prioritySupport: true,
      dedicatedSupport: false,
    },
    limits: {
      maxProducts: 10000,
      maxStorageGB: 100,
      maxApiCalls: 0,
      maxUsers: 5,
    },
    isPopular: true,
    trialDays: 14,
    sortOrder: 2,
  },
  {
    name: "Enterprise",
    description: "For large businesses with advanced needs",
    type: "enterprise",
    pricing: {
      monthly: 299,
      annual: 2999,
      currency: "USD",
    },
    features: {
      products: "unlimited",
      storage: "unlimited",
      analytics: true,
      multiCurrency: true,
      apiAccess: true,
      whiteLabel: true,
      customIntegrations: true,
      prioritySupport: true,
      dedicatedSupport: true,
    },
    limits: {
      maxProducts: 0, // 0 means unlimited
      maxStorageGB: 0, // 0 means unlimited
      maxApiCalls: 0, // 0 means unlimited
      maxUsers: 0, // 0 means unlimited
    },
    isPopular: false,
    trialDays: 14,
    sortOrder: 3,
  },
];

const createDemoPlans = async () => {
  try {
    console.log("🚀 Starting to create demo plans...");

    // Clear existing plans
    await Plan.deleteMany({});
    console.log("✅ Cleared existing plans");

    // Create new plans
    const createdPlans = await Plan.insertMany(plans);
    console.log(`✅ Created ${createdPlans.length} demo plans`);

    // Display created plans
    createdPlans.forEach((plan) => {
      console.log(`📋 ${plan.name} - $${plan.pricing.monthly}/month`);
    });

    console.log("🎉 Demo plans created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating demo plans:", error);
    process.exit(1);
  }
};

const main = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.log("❌ Could not connect to database. Exiting...");
    process.exit(1);
  }

  await createDemoPlans();
};

main();
