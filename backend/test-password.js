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

// Test password verification
const testPassword = async () => {
  try {
    console.log("\n=== TESTING PASSWORD VERIFICATION ===");

    // Find the test customer
    const customer = await User.findOne({ email: "customer@test.com" }).select(
      "+password"
    );

    if (!customer) {
      console.log("❌ Customer not found");
      return;
    }

    console.log("✅ Customer found:", customer.email);
    console.log("Password hash:", customer.password);

    // Test with correct password
    const isCorrectPassword = await bcrypt.compare(
      "Customer@123",
      customer.password
    );
    console.log("Correct password test:", isCorrectPassword);

    // Test with wrong password
    const isWrongPassword = await bcrypt.compare(
      "WrongPassword",
      customer.password
    );
    console.log("Wrong password test:", isWrongPassword);

    // Create a new hash for comparison
    const newHash = await bcrypt.hash("Customer@123", 12);
    console.log("New hash:", newHash);

    const isNewHashCorrect = await bcrypt.compare("Customer@123", newHash);
    console.log("New hash test:", isNewHashCorrect);
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await testPassword();
  await mongoose.disconnect();
  console.log("\n✅ Password test completed");
};

main().catch(console.error);
