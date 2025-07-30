const mongoose = require("mongoose");
const User = require("../models/user/User");
const Store = require("../models/store/Store");
const Product = require("../models/product/Product");
require("dotenv").config();

const demoProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals.",
    price: 2499,
    category: "Electronics",
    sku: "WH-BT-001",
    stockQuantity: 45,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        alt: "Wireless Bluetooth Headphones",
      },
    ],
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: "Battery Life", value: "20 hours" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Noise Cancellation", value: "Active" },
    ],
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking watch with heart rate monitoring, GPS, and water resistance. Track your workouts and health metrics.",
    price: 8999,
    category: "Electronics",
    sku: "SFW-001",
    stockQuantity: 23,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        alt: "Smart Fitness Watch",
      },
    ],
    isActive: true,
    isFeatured: false,
    specifications: [
      { name: "Display", value: "1.4 inch AMOLED" },
      { name: "Water Resistance", value: "5ATM" },
      { name: "Battery Life", value: "7 days" },
    ],
  },
  {
    name: "USB-C Fast Charging Cable",
    description:
      "High-speed USB-C charging cable with data transfer capabilities. Compatible with all modern devices.",
    price: 299,
    category: "Electronics",
    sku: "USB-C-001",
    stockQuantity: 150,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
        alt: "USB-C Fast Charging Cable",
      },
    ],
    isActive: true,
    isFeatured: false,
    specifications: [
      { name: "Length", value: "1 meter" },
      { name: "Data Transfer", value: "480 Mbps" },
      { name: "Charging Speed", value: "3A" },
    ],
  },
  {
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging pad compatible with Qi-enabled devices. Sleek design with LED indicator.",
    price: 1299,
    category: "Electronics",
    sku: "WCP-001",
    stockQuantity: 67,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/6214448/pexels-photo-6214448.jpeg",
        alt: "Wireless Charging Pad",
      },
    ],
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: "Output Power", value: "10W" },
      { name: "Compatibility", value: "Qi Standard" },
      { name: "Material", value: "Silicone" },
    ],
  },
];

const createVendorProducts = async () => {
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

    // Find the vendor's store
    const store = await Store.findOne({ owner: vendor._id });
    if (!store) {
      console.log(
        "❌ Store not found for vendor. Please run createVendorStore.js first."
      );
      return;
    }

    console.log(`✅ Found store: ${store.name}`);

    // Clear existing products for this vendor
    await Product.deleteMany({ vendor: vendor._id });
    console.log("🗑️  Cleared existing vendor products");

    // Create products with vendor and store reference
    const productsWithVendor = demoProducts.map((product) => ({
      ...product,
      vendor: vendor._id,
      store: store._id,
    }));

    const createdProducts = await Product.create(productsWithVendor);
    console.log("✅ Created vendor products:");

    createdProducts.forEach((product) => {
      console.log(
        `   - ${product.name} (₹${product.price}) - Stock: ${product.stockQuantity}`
      );
    });

    console.log("\n🎉 Vendor products created successfully!");
    console.log(`📊 Total products: ${createdProducts.length}`);
  } catch (error) {
    console.error("❌ Error creating vendor products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the script
createVendorProducts();
