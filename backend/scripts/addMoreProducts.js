const mongoose = require("mongoose");
const User = require("../models/user/User");
const Store = require("../models/store/Store");
const Product = require("../models/product/Product");
require("dotenv").config();

const additionalProducts = [
  {
    name: "Premium Cotton T-Shirt",
    description:
      "Comfortable and stylish cotton t-shirt perfect for everyday wear. Available in multiple colors and sizes.",
    price: 899,
    category: "Fashion",
    sku: "TSH-002",
    stockQuantity: 120,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
        alt: "Premium Cotton T-Shirt",
      },
    ],
    isActive: true,
    isFeatured: true,
    isPublished: true,
    specifications: [
      { name: "Material", value: "100% Cotton" },
      { name: "Fit", value: "Regular" },
      { name: "Care", value: "Machine Washable" },
    ],
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Eco-friendly stainless steel water bottle with excellent insulation. Keeps drinks cold for 24 hours.",
    price: 599,
    category: "Home & Kitchen",
    sku: "WB-002",
    stockQuantity: 85,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg",
        alt: "Stainless Steel Water Bottle",
      },
    ],
    isActive: true,
    isFeatured: false,
    isPublished: true,
    specifications: [
      { name: "Capacity", value: "750ml" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Insulation", value: "24 hours" },
    ],
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat with excellent grip and cushioning. Perfect for yoga, pilates, and fitness activities.",
    price: 1299,
    category: "Sports & Outdoors",
    sku: "YM-002",
    stockQuantity: 45,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg",
        alt: "Yoga Mat Premium",
      },
    ],
    isActive: true,
    isFeatured: true,
    isPublished: true,
    specifications: [
      { name: "Thickness", value: "6mm" },
      { name: "Material", value: "TPE" },
      { name: "Size", value: "183cm x 61cm" },
    ],
  },
  {
    name: "Organic Face Cream",
    description:
      "Natural and organic face cream with anti-aging properties. Suitable for all skin types.",
    price: 799,
    category: "Health & Beauty",
    sku: "FC-002",
    stockQuantity: 60,
    status: "active",
    images: [
      {
        url: "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
        alt: "Organic Face Cream",
      },
    ],
    isActive: true,
    isFeatured: false,
    isPublished: true,
    specifications: [
      { name: "Volume", value: "50ml" },
      { name: "Skin Type", value: "All Types" },
      { name: "Ingredients", value: "Organic" },
    ],
  },
];

const addMoreProducts = async () => {
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

    // Create products with vendor and store reference
    const productsWithVendor = additionalProducts.map((product) => ({
      ...product,
      vendor: vendor._id,
      store: store._id,
    }));

    const createdProducts = await Product.create(productsWithVendor);
    console.log("✅ Created additional products:");

    createdProducts.forEach((product) => {
      console.log(
        `   - ${product.name} (${product.category}) - ₹${product.price} - Stock: ${product.stockQuantity}`
      );
    });

    console.log("\n🎉 Additional products created successfully!");
    console.log(`📊 Total new products: ${createdProducts.length}`);

    // Show updated categories
    const categories = await Product.distinct("category", {
      status: "active",
      isPublished: true,
    });
    console.log(`📂 Available categories: ${categories.join(", ")}`);
  } catch (error) {
    console.error("❌ Error creating additional products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the script
addMoreProducts();
