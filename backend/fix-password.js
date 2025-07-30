const mongoose = require("mongoose");
const User = require("./models/user/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Fix customer password
const fixPassword = async () => {
  try {
    console.log("\n=== FIXING CUSTOMER PASSWORD ===");

    // Find the test customer
    const customer = await User.findOne({ email: "customer@test.com" });

    if (!customer) {
      console.log("❌ Customer not found");
      return;
    }

    console.log("✅ Customer found:", customer.email);

    // Update password (let the pre-save middleware hash it)
    customer.password = "Customer@123";
    await customer.save();

    console.log("✅ Password updated successfully");

    // Verify the password
    const isCorrectPassword = await bcrypt.compare(
      "Customer@123",
      customer.password
    );
    console.log("Password verification test:", isCorrectPassword);
  } catch (error) {
    console.error("❌ Fix error:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await fixPassword();
  await mongoose.disconnect();
  console.log("\n✅ Password fix completed");
};

main().catch(console.error);
