const mongoose = require("mongoose");
const Product = require("../models/product/Product");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function makeProductsFeatured() {
  try {
    console.log("🎯 Making products featured...\n");

    // Get all products
    const products = await Product.find({ isPublished: true });
    console.log(`📦 Found ${products.length} published products`);

    // Select some popular products to make featured
    const featuredProductNames = [
      "iPhone 15 Pro Max",
      "MacBook Pro 14-inch",
      "Samsung Galaxy S24 Ultra",
      "Nike Air Max 270",
    ];

    let updatedCount = 0;
    for (const productName of featuredProductNames) {
      const product = products.find((p) => p.name === productName);
      if (product) {
        await Product.findByIdAndUpdate(product._id, {
          isFeatured: true,
          isBestSeller: true,
        });
        console.log(`✅ Made "${productName}" featured`);
        updatedCount++;
      } else {
        console.log(`⚠️  Product "${productName}" not found`);
      }
    }

    // Also make some products best sellers
    const bestSellerNames = [
      "Levi's 501 Original Jeans",
      "The Alchemist by Paulo Coelho",
      "Philips Hue Smart Bulb",
    ];

    for (const productName of bestSellerNames) {
      const product = products.find((p) => p.name === productName);
      if (product) {
        await Product.findByIdAndUpdate(product._id, {
          isBestSeller: true,
        });
        console.log(`✅ Made "${productName}" best seller`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} products`);

    // Verify the changes
    const featuredProducts = await Product.find({ isFeatured: true });
    const bestSellers = await Product.find({ isBestSeller: true });

    console.log(`\n📊 Verification:`);
    console.log(`   - Featured products: ${featuredProducts.length}`);
    console.log(`   - Best sellers: ${bestSellers.length}`);
  } catch (error) {
    console.error("❌ Error making products featured:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

makeProductsFeatured();
