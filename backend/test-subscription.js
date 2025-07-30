const mongoose = require("mongoose");
const Plan = require("./models/subscription/Plan");
const Subscription = require("./models/subscription/Subscription");
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

const testSubscriptionSystem = async () => {
  try {
    console.log("🧪 Testing subscription system...");

    // Test 1: Create demo plans
    console.log("\n1. Creating demo plans...");
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
    ];

    // Clear existing plans
    await Plan.deleteMany({});
    console.log("✅ Cleared existing plans");

    // Create new plans
    const createdPlans = await Plan.insertMany(plans);
    console.log(`✅ Created ${createdPlans.length} plans`);

    // Test 2: Test plan methods
    console.log("\n2. Testing plan methods...");
    const activePlans = await Plan.getActivePlans();
    console.log(`✅ Found ${activePlans.length} active plans`);

    const starterPlan = await Plan.getByType("starter");
    console.log(`✅ Found starter plan: ${starterPlan.name}`);

    // Test 3: Test plan virtuals
    console.log("\n3. Testing plan virtuals...");
    console.log(
      `✅ Starter plan monthly: ${starterPlan.formattedPricing.monthly.formatted}`
    );
    console.log(
      `✅ Starter plan annual: ${starterPlan.formattedPricing.annual.formatted}`
    );
    console.log(`✅ Annual savings: ${starterPlan.annualSavings.percentage}%`);

    // Test 4: Test subscription creation
    console.log("\n4. Testing subscription creation...");
    const testUserId = new mongoose.Types.ObjectId();

    const subscription = await Subscription.create({
      user: testUserId,
      plan: starterPlan._id,
      billingCycle: "monthly",
      amount: starterPlan.pricing.monthly,
      currency: starterPlan.pricing.currency,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    console.log(`✅ Created subscription: ${subscription._id}`);
    console.log(`✅ Subscription status: ${subscription.statusDisplay}`);
    console.log(`✅ Trial days remaining: ${subscription.trialDaysRemaining}`);

    // Test 5: Test subscription methods
    console.log("\n5. Testing subscription methods...");
    const userSubscription = await Subscription.getByUser(testUserId);
    console.log(`✅ Found user subscription: ${userSubscription._id}`);

    // Test 6: Test subscription cancellation
    console.log("\n6. Testing subscription cancellation...");
    await subscription.cancel(true);
    console.log(
      `✅ Subscription cancelled at period end: ${subscription.cancelAtPeriodEnd}`
    );

    console.log("\n🎉 All subscription system tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
};

const main = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.log("❌ Could not connect to database. Exiting...");
    process.exit(1);
  }

  await testSubscriptionSystem();
};

main();
