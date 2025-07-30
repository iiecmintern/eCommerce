const mongoose = require("mongoose");
const User = require("./models/user/User");
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

// Test login function
const testLogin = async (email, password) => {
  try {
    console.log(`\n🔍 Testing login for: ${email}`);

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log("✅ User found:", {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      hasPassword: !!user.password,
    });

    // Test password
    const isPasswordValid = await user.correctPassword(password, user.password);
    console.log(`🔐 Password valid: ${isPasswordValid}`);

    if (isPasswordValid) {
      console.log("✅ Login would succeed");
    } else {
      console.log("❌ Login would fail - incorrect password");
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();

  // Test with your admin credentials
  console.log("\n=== LOGIN DEBUG TEST ===");

  // Replace these with your actual admin credentials
  const testEmail = "aman@gmail.com"; // Replace with your email
  const testPassword = "Aman@123"; // Replace with your password

  await testLogin(testEmail, testPassword);

  // List all users in database
  console.log("\n=== ALL USERS IN DATABASE ===");
  const allUsers = await User.find({}).select("-password");
  allUsers.forEach((user, index) => {
    console.log(
      `${index + 1}. ${user.firstName} ${user.lastName} (${
        user.email
      }) - Role: ${user.role}`
    );
  });

  await mongoose.disconnect();
  console.log("\n✅ Test completed");
};

main().catch(console.error);
