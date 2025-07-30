const mongoose = require("mongoose");
const User = require("../models/user/User");
const Store = require("../models/store/Store");
require("dotenv").config();

const createVendorStore = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log("✅ Connected to MongoDB");

    // Find the vendor user
    const vendor = await User.findOne({
      email: "vendor@demo.com",
      role: "vendor",
    });
    if (!vendor) {
      console.log(
        "❌ Vendor user not found. Please run createDemoUsers.js first."
      );
      return;
    }

    console.log(`✅ Found vendor: ${vendor.firstName} ${vendor.lastName}`);

    // Check if store already exists
    const existingStore = await Store.findOne({ owner: vendor._id });
    if (existingStore) {
      console.log("✅ Store already exists for this vendor");
      console.log(`   Store: ${existingStore.name}`);
      return existingStore;
    }

    // Create store for vendor
    const storeData = {
      name: "TechGadgets Pro",
      description:
        "Your one-stop shop for the latest electronics and gadgets. We offer premium quality products with excellent customer service.",
      tagline: "Innovation at Your Fingertips",
      owner: vendor._id,
      contact: {
        email: "contact@techgadgetspro.com",
        phone: "9876543210",
        address: {
          street: "123 Tech Park, Electronic City",
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
          pincode: "560100",
        },
      },
      business: {
        type: "Private Limited",
        gstNumber: "29AABCT1234A1Z5",
        panNumber: "AABCT1234A",
      },
      settings: {
        currency: "INR",
        language: "en",
        timezone: "Asia/Kolkata",
      },
      payment: {
        acceptedMethods: ["cod", "online", "upi", "card"],
      },
      shipping: {
        freeShippingThreshold: 1000,
        defaultShippingCost: 50,
        processingTime: 1,
      },
      appearance: {
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF",
      },
      seo: {
        metaTitle: "TechGadgets Pro - Premium Electronics Store",
        metaDescription:
          "Buy the latest electronics and gadgets from TechGadgets Pro. Premium quality products with excellent customer service.",
        keywords: [
          "electronics",
          "gadgets",
          "smartphones",
          "laptops",
          "accessories",
        ],
      },
      social: {
        website: "https://techgadgetspro.com",
        facebook: "https://facebook.com/techgadgetspro",
        instagram: "https://instagram.com/techgadgetspro",
      },
      status: "active",
      isVerified: true,
      isPublished: true,
    };

    const store = await Store.create(storeData);
    console.log("✅ Created store for vendor:");
    console.log(`   Store: ${store.name}`);
    console.log(`   Status: ${store.status}`);
    console.log(`   Verified: ${store.isVerified}`);

    return store;
  } catch (error) {
    console.error("❌ Error creating vendor store:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the script
createVendorStore();
