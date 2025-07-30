const mongoose = require("mongoose");
const User = require("./models/user/User");
const Store = require("./models/store/Store");
const Product = require("./models/product/Product");
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

// Setup test data
const setupTestData = async () => {
  try {
    console.log("\n=== SETTING UP TEST DATA ===");

    // Create a test vendor
    const vendorData = {
      firstName: "Test",
      lastName: "Vendor",
      email: "vendor@test.com",
      phone: "9876543210",
      role: "vendor",
      isActive: true,
      agreeToTerms: true,
      password: await bcrypt.hash("Vendor@123", 12),
    };

    let vendor = await User.findOne({ email: vendorData.email });
    if (!vendor) {
      vendor = new User(vendorData);
      await vendor.save();
      console.log("✅ Test vendor created:", vendor.email);
    } else {
      console.log("✅ Test vendor already exists:", vendor.email);
    }

    // Create a test customer
    const customerData = {
      firstName: "Test",
      lastName: "Customer",
      email: "customer@test.com",
      phone: "9876543211",
      role: "customer",
      isActive: true,
      agreeToTerms: true,
      password: await bcrypt.hash("Customer@123", 12),
    };

    let customer = await User.findOne({ email: customerData.email });
    if (!customer) {
      customer = new User(customerData);
      await customer.save();
      console.log("✅ Test customer created:", customer.email);
    } else {
      console.log("✅ Test customer already exists:", customer.email);
    }

    // Create a test store
    const storeData = {
      name: "Test Electronics Store",
      description: "A test store for electronics and gadgets",
      owner: vendor._id,
      vendor: vendor._id,
      contact: {
        email: "store@test.com",
        phone: "9876543212",
        address: {
          street: "123 Test Street",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          pincode: "400001",
        },
      },
      settings: {
        currency: "INR",
        timezone: "Asia/Kolkata",
      },
      status: "active",
      isVerified: true,
    };

    let store = await Store.findOne({ vendor: vendor._id });
    if (!store) {
      store = new Store(storeData);
      await store.save();
      console.log("✅ Test store created:", store.name);
    } else {
      console.log("✅ Test store already exists:", store.name);
    }

    // Create test products
    const productsData = [
      {
        name: "Test Smartphone",
        description: "A high-quality test smartphone with advanced features",
        price: 25000,
        compareAtPrice: 30000,
        costPrice: 20000,
        sku: "PHONE-001",
        barcode: "1234567890123",
        stockQuantity: 50,
        lowStockThreshold: 5,
        weight: 0.2,
        dimensions: {
          length: 15,
          width: 7,
          height: 1,
        },
        category: "Electronics",
        subcategory: "Smartphones",
        brand: "TestBrand",
        gstRate: 18,
        status: "active",
        isPublished: true,
        isFeatured: false,
        store: store._id,
        vendor: vendor._id,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Smartphone+1",
            alt: "Test Smartphone",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://via.placeholder.com/400x400?text=Smartphone+2",
            alt: "Test Smartphone Side View",
            isPrimary: false,
            order: 2,
          },
        ],
        tags: ["smartphone", "electronics", "mobile"],
      },
      {
        name: "Test Laptop",
        description: "A powerful test laptop for work and gaming",
        price: 45000,
        compareAtPrice: 55000,
        costPrice: 35000,
        sku: "LAPTOP-001",
        barcode: "1234567890124",
        stockQuantity: 25,
        lowStockThreshold: 3,
        weight: 2.5,
        dimensions: {
          length: 35,
          width: 25,
          height: 2,
        },
        category: "Electronics",
        subcategory: "Laptops",
        brand: "TestBrand",
        gstRate: 18,
        status: "active",
        isPublished: true,
        isFeatured: true,
        store: store._id,
        vendor: vendor._id,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Laptop+1",
            alt: "Test Laptop",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://via.placeholder.com/400x400?text=Laptop+2",
            alt: "Test Laptop Side View",
            isPrimary: false,
            order: 2,
          },
        ],
        tags: ["laptop", "electronics", "computer"],
      },
      {
        name: "Test Headphones",
        description: "Premium wireless headphones with noise cancellation",
        price: 5000,
        compareAtPrice: 7000,
        costPrice: 3500,
        sku: "HEADPHONES-001",
        barcode: "1234567890125",
        stockQuantity: 100,
        lowStockThreshold: 10,
        weight: 0.3,
        dimensions: {
          length: 20,
          width: 15,
          height: 8,
        },
        category: "Electronics",
        subcategory: "Audio",
        brand: "TestBrand",
        gstRate: 18,
        status: "active",
        isPublished: true,
        isFeatured: false,
        store: store._id,
        vendor: vendor._id,
        images: [
          {
            url: "https://via.placeholder.com/400x400?text=Headphones+1",
            alt: "Test Headphones",
            isPrimary: true,
            order: 1,
          },
        ],
        tags: ["headphones", "audio", "wireless"],
      },
    ];

    for (const productData of productsData) {
      let product = await Product.findOne({ sku: productData.sku });
      if (!product) {
        product = new Product(productData);
        await product.save();
        console.log("✅ Test product created:", product.name);
      } else {
        console.log("✅ Test product already exists:", product.name);
      }
    }

    console.log("\n=== TEST DATA SUMMARY ===");
    console.log("Vendor:", vendor.email, "(Password: Vendor@123)");
    console.log("Customer:", customer.email, "(Password: Customer@123)");
    console.log("Store:", store.name);

    const productCount = await Product.countDocuments({ vendor: vendor._id });
    console.log("Products:", productCount);

    console.log("\n✅ Test data setup completed successfully!");
  } catch (error) {
    console.error("❌ Setup error:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await setupTestData();
  await mongoose.disconnect();
  console.log("\n✅ Setup completed");
};

main().catch(console.error);
