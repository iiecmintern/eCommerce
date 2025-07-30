const mongoose = require("mongoose");
const Product = require("../models/product/Product");
require("dotenv").config();

const publishProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log("✅ Connected to MongoDB");

    // Update all products to be published
    const result = await Product.updateMany(
      { status: "active" },
      {
        isPublished: true,
        publishedAt: new Date(),
      }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} products to published status`
    );

    // Get published categories
    const publishedCategories = await Product.distinct("category", {
      status: "active",
      isPublished: true,
    });
    console.log("\n✅ Published Categories:", publishedCategories);

    // Show all products with their status
    const products = await Product.find({}).select(
      "name category status isPublished"
    );
    console.log("\n📦 All Products:");
    products.forEach((product) => {
      console.log(
        `   - ${product.name} (${product.category}) - Status: ${product.status} - Published: ${product.isPublished}`
      );
    });
  } catch (error) {
    console.error("❌ Error publishing products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

// Run the script
publishProducts();
