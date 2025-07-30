const mongoose = require("mongoose");
const User = require("../models/user/User");
const Store = require("../models/store/Store");
const Product = require("../models/product/Product");
require("dotenv").config();

// Demo stores data
const demoStores = [
  {
    name: "TechGadgets Pro",
    description:
      "Your one-stop shop for the latest electronics and gadgets. We offer premium quality products with excellent customer service.",
    tagline: "Innovation at Your Fingertips",
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
  },
  {
    name: "Fashion Forward",
    description:
      "Trendy fashion store offering the latest styles in clothing, accessories, and footwear for men and women.",
    tagline: "Style Meets Comfort",
    contact: {
      email: "hello@fashionforward.com",
      phone: "8765432109",
      address: {
        street: "456 Fashion Street, Mall Road",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
      },
    },
    business: {
      type: "Individual",
      gstNumber: "27AABCF5678B2Z6",
      panNumber: "AABCF5678B",
    },
    settings: {
      currency: "INR",
      language: "en",
      timezone: "Asia/Kolkata",
    },
    payment: {
      acceptedMethods: ["cod", "online", "upi", "card", "netbanking"],
    },
    shipping: {
      freeShippingThreshold: 1500,
      defaultShippingCost: 80,
      processingTime: 2,
    },
    appearance: {
      primaryColor: "#EC4899",
      secondaryColor: "#BE185D",
    },
    seo: {
      metaTitle: "Fashion Forward - Trendy Fashion Store",
      metaDescription:
        "Discover the latest fashion trends at Fashion Forward. Stylish clothing, accessories, and footwear for everyone.",
      keywords: ["fashion", "clothing", "accessories", "footwear", "trendy"],
    },
    social: {
      website: "https://fashionforward.com",
      instagram: "https://instagram.com/fashionforward",
      facebook: "https://facebook.com/fashionforward",
    },
    status: "active",
    isVerified: true,
    isPublished: true,
  },
  {
    name: "Home & Kitchen Essentials",
    description:
      "Premium home and kitchen products to make your life easier. Quality cookware, appliances, and home decor.",
    tagline: "Making Homes Beautiful",
    contact: {
      email: "info@homekitchen.com",
      phone: "7654321098",
      address: {
        street: "789 Home Lane, Residential Area",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        pincode: "110001",
      },
    },
    business: {
      type: "Partnership",
      gstNumber: "07AABCH9012C3Z7",
      panNumber: "AABCH9012C",
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
      freeShippingThreshold: 2000,
      defaultShippingCost: 100,
      processingTime: 1,
    },
    appearance: {
      primaryColor: "#10B981",
      secondaryColor: "#059669",
    },
    seo: {
      metaTitle: "Home & Kitchen Essentials - Premium Home Products",
      metaDescription:
        "Transform your home with premium kitchen and home products. Quality cookware, appliances, and decor items.",
      keywords: ["home", "kitchen", "cookware", "appliances", "decor"],
    },
    social: {
      website: "https://homekitchen.com",
      facebook: "https://facebook.com/homekitchen",
      instagram: "https://instagram.com/homekitchen",
    },
    status: "active",
    isVerified: true,
    isPublished: true,
  },
];

// Demo products data
const demoProducts = [
  // TechGadgets Pro Products
  {
    name: "iPhone 15 Pro Max",
    description:
      "The most advanced iPhone ever with A17 Pro chip, 48MP camera, and titanium design. Experience the future of mobile technology.",
    shortDescription: "Latest iPhone with A17 Pro chip and 48MP camera",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 149999,
    compareAtPrice: 159999,
    costPrice: 120000,
    currency: "INR",
    gstRate: 18,
    gstIncluded: true,
    sku: "IP15PM-256-BLACK",
    barcode: "1234567890123",
    stockQuantity: 25,
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        alt: "iPhone 15 Pro Max",
        isPrimary: true,
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        alt: "iPhone 15 Pro Max Side View",
        isPrimary: false,
        order: 1,
      },
    ],
    specifications: [
      { name: "Storage", value: "256GB" },
      { name: "Color", value: "Natural Titanium" },
      { name: "Screen Size", value: "6.7 inches" },
      { name: "Processor", value: "A17 Pro" },
      { name: "Camera", value: "48MP Main + 12MP Ultra Wide + 12MP Telephoto" },
    ],
    weight: 221,
    dimensions: {
      length: 159.9,
      width: 76.7,
      height: 8.25,
    },
    shippingClass: "Express",
    metaTitle: "iPhone 15 Pro Max - Latest iPhone with A17 Pro Chip",
    metaDescription:
      "Buy iPhone 15 Pro Max with A17 Pro chip, 48MP camera, and titanium design. Best price guaranteed.",
    tags: ["iphone", "smartphone", "apple", "5g", "camera"],
    status: "active",
    isPublished: true,
    isFeatured: true,
    isBestSeller: true,
    averageRating: 4.8,
    totalReviews: 156,
  },
  {
    name: "MacBook Air M2",
    description:
      "Ultra-thin and ultra-powerful laptop with M2 chip. Perfect for work, creativity, and entertainment with all-day battery life.",
    shortDescription: "Ultra-thin laptop with M2 chip and all-day battery",
    category: "Electronics",
    subcategory: "Laptops",
    price: 114900,
    compareAtPrice: 124900,
    costPrice: 90000,
    currency: "INR",
    gstRate: 18,
    gstIncluded: true,
    sku: "MBA-M2-512-SPACE",
    barcode: "1234567890124",
    stockQuantity: 15,
    lowStockThreshold: 3,
    trackInventory: true,
    allowBackorders: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        alt: "MacBook Air M2",
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { name: "Storage", value: "512GB SSD" },
      { name: "Memory", value: "8GB Unified Memory" },
      { name: "Processor", value: "Apple M2 chip" },
      { name: "Display", value: "13.6-inch Liquid Retina display" },
      { name: "Battery", value: "Up to 18 hours" },
    ],
    weight: 1247,
    dimensions: {
      length: 304.1,
      width: 215.0,
      height: 11.3,
    },
    shippingClass: "Express",
    metaTitle: "MacBook Air M2 - Ultra-thin Laptop with M2 Chip",
    metaDescription:
      "Buy MacBook Air M2 with ultra-thin design, M2 chip, and all-day battery life. Perfect for work and creativity.",
    tags: ["macbook", "laptop", "apple", "m2", "ultrabook"],
    status: "active",
    isPublished: true,
    isFeatured: true,
    isBestSeller: false,
    averageRating: 4.9,
    totalReviews: 89,
  },
  // Fashion Forward Products
  {
    name: "Premium Cotton T-Shirt",
    description:
      "Comfortable and stylish cotton t-shirt perfect for everyday wear. Available in multiple colors and sizes.",
    shortDescription: "Comfortable cotton t-shirt for everyday wear",
    category: "Fashion",
    subcategory: "Clothing",
    price: 899,
    compareAtPrice: 1299,
    costPrice: 400,
    currency: "INR",
    gstRate: 12,
    gstIncluded: true,
    sku: "TS-COTTON-BLACK-M",
    barcode: "1234567890125",
    stockQuantity: 100,
    lowStockThreshold: 20,
    trackInventory: true,
    allowBackorders: true,
    variants: [
      {
        name: "Color",
        value: "Black",
        price: 899,
        stockQuantity: 30,
        sku: "TS-COTTON-BLACK-M",
      },
      {
        name: "Color",
        value: "White",
        price: 899,
        stockQuantity: 25,
        sku: "TS-COTTON-WHITE-M",
      },
      {
        name: "Color",
        value: "Navy",
        price: 899,
        stockQuantity: 25,
        sku: "TS-COTTON-NAVY-M",
      },
      {
        name: "Color",
        value: "Grey",
        price: 899,
        stockQuantity: 20,
        sku: "TS-COTTON-GREY-M",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Premium Cotton T-Shirt",
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { name: "Material", value: "100% Cotton" },
      { name: "Fit", value: "Regular Fit" },
      { name: "Care", value: "Machine wash cold" },
      { name: "Origin", value: "Made in India" },
    ],
    weight: 150,
    shippingClass: "Standard",
    metaTitle: "Premium Cotton T-Shirt - Comfortable Everyday Wear",
    metaDescription:
      "Buy premium cotton t-shirt for comfortable everyday wear. Available in multiple colors and sizes.",
    tags: ["t-shirt", "cotton", "casual", "comfortable", "fashion"],
    status: "active",
    isPublished: true,
    isFeatured: false,
    isBestSeller: true,
    averageRating: 4.5,
    totalReviews: 234,
  },
  {
    name: "Designer Denim Jeans",
    description:
      "High-quality denim jeans with perfect fit and comfort. Classic design that never goes out of style.",
    shortDescription: "High-quality denim jeans with perfect fit",
    category: "Fashion",
    subcategory: "Clothing",
    price: 2499,
    compareAtPrice: 3499,
    costPrice: 1200,
    currency: "INR",
    gstRate: 12,
    gstIncluded: true,
    sku: "JEANS-DENIM-BLUE-32",
    barcode: "1234567890126",
    stockQuantity: 50,
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorders: false,
    variants: [
      {
        name: "Size",
        value: "30",
        price: 2499,
        stockQuantity: 10,
        sku: "JEANS-DENIM-BLUE-30",
      },
      {
        name: "Size",
        value: "32",
        price: 2499,
        stockQuantity: 15,
        sku: "JEANS-DENIM-BLUE-32",
      },
      {
        name: "Size",
        value: "34",
        price: 2499,
        stockQuantity: 15,
        sku: "JEANS-DENIM-BLUE-34",
      },
      {
        name: "Size",
        value: "36",
        price: 2499,
        stockQuantity: 10,
        sku: "JEANS-DENIM-BLUE-36",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
        alt: "Designer Denim Jeans",
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { name: "Material", value: "100% Cotton Denim" },
      { name: "Fit", value: "Slim Fit" },
      { name: "Style", value: "Straight Leg" },
      { name: "Care", value: "Machine wash cold" },
    ],
    weight: 400,
    shippingClass: "Standard",
    metaTitle: "Designer Denim Jeans - Perfect Fit and Comfort",
    metaDescription:
      "Buy high-quality denim jeans with perfect fit and comfort. Classic design that never goes out of style.",
    tags: ["jeans", "denim", "casual", "fashion", "comfortable"],
    status: "active",
    isPublished: true,
    isFeatured: true,
    isBestSeller: false,
    averageRating: 4.7,
    totalReviews: 167,
  },
  // Home & Kitchen Products
  {
    name: "Non-Stick Cookware Set",
    description:
      "Complete non-stick cookware set with 5 pieces. Perfect for everyday cooking with easy cleaning and even heat distribution.",
    shortDescription: "Complete non-stick cookware set with 5 pieces",
    category: "Home & Kitchen",
    subcategory: "Cookware",
    price: 3999,
    compareAtPrice: 5999,
    costPrice: 2000,
    currency: "INR",
    gstRate: 18,
    gstIncluded: true,
    sku: "COOKWARE-NS-5PC",
    barcode: "1234567890127",
    stockQuantity: 30,
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorders: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
        alt: "Non-Stick Cookware Set",
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { name: "Material", value: "Aluminum with Non-Stick Coating" },
      { name: "Pieces", value: "5 pieces" },
      {
        name: "Includes",
        value: "Frying pan, Saucepan, Casserole, Spatula, Ladle",
      },
      { name: "Heat Resistance", value: "Up to 250°C" },
      { name: "Warranty", value: "2 years" },
    ],
    weight: 2500,
    shippingClass: "Standard",
    metaTitle: "Non-Stick Cookware Set - Complete 5 Piece Set",
    metaDescription:
      "Buy complete non-stick cookware set with 5 pieces. Perfect for everyday cooking with easy cleaning.",
    tags: ["cookware", "non-stick", "kitchen", "cooking", "pots"],
    status: "active",
    isPublished: true,
    isFeatured: true,
    isBestSeller: true,
    averageRating: 4.6,
    totalReviews: 198,
  },
  {
    name: "Smart Coffee Maker",
    description:
      "Programmable coffee maker with built-in grinder and thermal carafe. Perfect for coffee lovers who want convenience and quality.",
    shortDescription: "Programmable coffee maker with built-in grinder",
    category: "Home & Kitchen",
    subcategory: "Appliances",
    price: 8999,
    compareAtPrice: 11999,
    costPrice: 5000,
    currency: "INR",
    gstRate: 18,
    gstIncluded: true,
    sku: "COFFEE-SMART-PRO",
    barcode: "1234567890128",
    stockQuantity: 12,
    lowStockThreshold: 3,
    trackInventory: true,
    allowBackorders: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
        alt: "Smart Coffee Maker",
        isPrimary: true,
        order: 0,
      },
    ],
    specifications: [
      { name: "Capacity", value: "12 cups" },
      {
        name: "Features",
        value: "Built-in grinder, Programmable timer, Thermal carafe",
      },
      { name: "Power", value: "1000W" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Warranty", value: "1 year" },
    ],
    weight: 3500,
    shippingClass: "Express",
    metaTitle: "Smart Coffee Maker - Programmable with Built-in Grinder",
    metaDescription:
      "Buy smart coffee maker with built-in grinder and thermal carafe. Perfect for coffee lovers.",
    tags: ["coffee", "maker", "appliance", "kitchen", "smart"],
    status: "active",
    isPublished: true,
    isFeatured: false,
    isBestSeller: false,
    averageRating: 4.4,
    totalReviews: 76,
  },
];

const createDemoData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing demo data
    console.log("🗑️ Clearing existing demo data...");
    await Store.deleteMany({
      name: { $in: demoStores.map((store) => store.name) },
    });
    await Product.deleteMany({
      name: { $in: demoProducts.map((product) => product.name) },
    });

    // Get vendor users
    const vendors = await User.find({ role: "vendor" }).limit(3);
    if (vendors.length < 3) {
      console.log("❌ Need at least 3 vendor users to create demo data");
      console.log("Please run the createDemoUsers script first");
      process.exit(1);
    }

    console.log("🏪 Creating demo stores...");
    const createdStores = [];

    for (let i = 0; i < demoStores.length; i++) {
      const storeData = {
        ...demoStores[i],
        owner: vendors[i]._id,
      };

      const store = new Store(storeData);
      await store.save();
      createdStores.push(store);
      console.log(`✅ Created store: ${store.name}`);
    }

    console.log("📦 Creating demo products...");

    // Assign products to stores
    const storeProductMapping = [
      { storeIndex: 0, productIndices: [0, 1] }, // TechGadgets Pro gets iPhone and MacBook
      { storeIndex: 1, productIndices: [2, 3] }, // Fashion Forward gets T-shirt and Jeans
      { storeIndex: 2, productIndices: [4, 5] }, // Home & Kitchen gets Cookware and Coffee Maker
    ];

    for (const mapping of storeProductMapping) {
      const store = createdStores[mapping.storeIndex];

      for (const productIndex of mapping.productIndices) {
        const productData = {
          ...demoProducts[productIndex],
          vendor: vendors[mapping.storeIndex]._id,
          store: store._id,
        };

        const product = new Product(productData);
        await product.save();
        console.log(`✅ Created product: ${product.name} for ${store.name}`);
      }
    }

    // Update store statistics
    console.log("📊 Updating store statistics...");
    for (const store of createdStores) {
      await store.updateStats();
      console.log(`✅ Updated stats for ${store.name}`);
    }

    console.log("🎉 Demo data created successfully!");
    console.log(
      `📊 Created ${createdStores.length} stores and ${demoProducts.length} products`
    );

    // Display summary
    console.log("\n📋 Demo Data Summary:");
    console.log("🏪 Stores:");
    createdStores.forEach((store) => {
      console.log(`  - ${store.name} (${store.contact.email})`);
    });

    console.log("\n📦 Products:");
    demoProducts.forEach((product) => {
      console.log(`  - ${product.name} (₹${product.price})`);
    });
  } catch (error) {
    console.error("❌ Error creating demo data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the script
if (require.main === module) {
  createDemoData();
}

module.exports = createDemoData;
