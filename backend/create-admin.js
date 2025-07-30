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

// Create admin user
const createAdmin = async () => {
  try {
    const adminData = {
      firstName: "Admin",
      lastName: "User",
      email: "admin@commerceforge.com",
      password: "Admin@123",
      role: "admin",
      isEmailVerified: true,
      isActive: true,
      agreeToTerms: true,
      agreeToMarketing: false,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      return;
    }

    // Create new admin user
    const admin = await User.create(adminData);
    console.log("✅ Admin user created successfully");
    console.log("Email:", admin.email);
    console.log("Password: Admin@123");
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createAdmin();
  await mongoose.disconnect();
  console.log("\n✅ Script completed");
};

main().catch(console.error);
