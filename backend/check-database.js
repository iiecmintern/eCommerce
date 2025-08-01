const mongoose = require("mongoose");
const Product = require("./models/product/Product");
const Store = require("./models/store/Store");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function checkDatabase() {
  try {
    console.log("🔍 Checking database contents...\n");

    const productCount = await Product.countDocuments();
    const storeCount = await Store.countDocuments();

    console.log(`📊 Database Summary:`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Stores: ${storeCount}`);

    if (productCount > 0) {
      const products = await Product.find().limit(5);
      console.log("\n📦 Sample Products:");
      products.forEach((product, index) => {
        console.log(
          `   ${index + 1}. ${product.name} - ₹${product.price} (${
            product.category
          })`
        );
      });
    }

    if (storeCount > 0) {
      const stores = await Store.find().limit(3);
      console.log("\n🏪 Sample Stores:");
      stores.forEach((store, index) => {
        console.log(`   ${index + 1}. ${store.name} - ${store.category}`);
      });
    }
  } catch (error) {
    console.error("❌ Error checking database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

checkDatabase();
