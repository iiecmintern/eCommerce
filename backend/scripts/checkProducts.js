const mongoose = require("mongoose");
const Product = require("../models/product/Product");
require("dotenv").config();

const checkProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log("✅ Connected to MongoDB");

    // Get all products
    const products = await Product.find({}).select(
      "name category status isPublished"
    );
    console.log("\n📦 All Products:");
    products.forEach((product) => {
      console.log(
        `   - ${product.name} (${product.category}) - Status: ${product.status} - Published: ${product.isPublished}`
      );
    });

    // Get distinct categories
    const categories = await Product.distinct("category");
    console.log("\n📂 All Categories:", categories);

    // Get published categories
    const publishedCategories = await Product.distinct("category", {
      status: "active",
      isPublished: true,
    });
    console.log("\n✅ Published Categories:", publishedCategories);
  } catch (error) {
    console.error("❌ Error checking products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

// Run the script
checkProducts();
