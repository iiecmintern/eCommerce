const mongoose = require("mongoose");
const Product = require("../models/product/Product");
const Store = require("../models/store/Store");
const User = require("../models/user/User");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Sample stores
const sampleStores = [
  {
    name: "TechGadgets Pro",
    description: "Premium electronics and gadgets store",
    category: "Electronics",
    location: "Mumbai, India",
    rating: 4.5,
    totalSales: 15000,
    contact: {
      phone: "+91-9876543210",
      email: "contact@techgadgetspro.com",
    },
  },
  {
    name: "Fashion Forward",
    description: "Trendy fashion and accessories",
    category: "Fashion",
    location: "Delhi, India",
    rating: 4.2,
    totalSales: 8500,
    contact: {
      phone: "+91-9876543211",
      email: "hello@fashionforward.com",
    },
  },
  {
    name: "Home & Living",
    description: "Quality home decor and furniture",
    category: "Home & Kitchen",
    location: "Bangalore, India",
    rating: 4.7,
    totalSales: 12000,
    contact: {
      phone: "+91-9876543212",
      email: "info@homeandliving.com",
    },
  },
  {
    name: "Sports Zone",
    description: "Sports equipment and fitness gear",
    category: "Sports & Outdoors",
    location: "Chennai, India",
    rating: 4.3,
    totalSales: 6500,
    contact: {
      phone: "+91-9876543213",
      email: "support@sportszone.com",
    },
  },
  {
    name: "Book Haven",
    description: "Books, stationery, and educational materials",
    category: "Books",
    location: "Kolkata, India",
    rating: 4.6,
    totalSales: 9200,
    contact: {
      phone: "+91-9876543214",
      email: "books@bookhaven.com",
    },
  },
];

// Sample products (simplified without complex variants)
const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    description: "Latest iPhone with advanced camera system and A17 Pro chip",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    price: 149999,
    compareAtPrice: 139999,
    tags: ["smartphone", "iphone", "apple", "camera", "5g"],
    store: null, // Will be set after store creation
    sku: "IP15PM-256-NT",
    stockQuantity: 25,
    rating: 4.8,
    reviewCount: 1250,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description:
      "Premium Android smartphone with S Pen and advanced AI features",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Samsung",
    price: 129999,
    compareAtPrice: 119999,
    tags: ["smartphone", "samsung", "galaxy", "s-pen", "ai"],
    store: null,
    sku: "SGS24U-256-TG",
    stockQuantity: 30,
    rating: 4.7,
    reviewCount: 890,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max technology",
    category: "Sports & Outdoors",
    subcategory: "Footwear",
    brand: "Nike",
    price: 12999,
    compareAtPrice: 9999,
    tags: ["shoes", "nike", "running", "air-max", "sports"],
    store: null,
    sku: "NAM270-7-BW",
    stockQuantity: 45,
    rating: 4.5,
    reviewCount: 567,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with responsive Boost midsole",
    category: "Sports & Outdoors",
    subcategory: "Footwear",
    brand: "Adidas",
    price: 15999,
    compareAtPrice: 12999,
    tags: ["shoes", "adidas", "running", "ultraboost", "boost"],
    store: null,
    sku: "AUB22-8-CB",
    stockQuantity: 28,
    rating: 4.6,
    reviewCount: 423,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-fit jeans with timeless style",
    category: "Fashion",
    subcategory: "Clothing",
    brand: "Levi's",
    price: 3999,
    compareAtPrice: 2999,
    tags: ["jeans", "levis", "denim", "casual", "clothing"],
    store: null,
    sku: "L501-32x32-DB",
    stockQuantity: 60,
    rating: 4.4,
    reviewCount: 789,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Zara Cotton T-Shirt",
    description: "Comfortable cotton t-shirt with modern fit",
    category: "Fashion",
    subcategory: "Clothing",
    brand: "Zara",
    price: 1499,
    compareAtPrice: 999,
    tags: ["tshirt", "zara", "cotton", "casual", "clothing"],
    store: null,
    sku: "ZCT-M-WH",
    stockQuantity: 80,
    rating: 4.2,
    reviewCount: 456,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "IKEA MALM Bed Frame",
    description: "Modern bed frame with storage drawers",
    category: "Home & Kitchen",
    subcategory: "Furniture",
    brand: "IKEA",
    price: 15999,
    compareAtPrice: 12999,
    tags: ["bed", "ikea", "furniture", "storage", "bedroom"],
    store: null,
    sku: "IM-QS-WH",
    stockQuantity: 12,
    rating: 4.3,
    reviewCount: 234,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Philips Hue Smart Bulb",
    description: "Smart LED bulb with voice control and app connectivity",
    category: "Electronics",
    subcategory: "Smart Home",
    brand: "Philips",
    price: 2499,
    compareAtPrice: 1999,
    tags: ["smart-bulb", "philips", "hue", "led", "smart-home"],
    store: null,
    sku: "PH-WA-E27",
    stockQuantity: 100,
    rating: 4.7,
    reviewCount: 678,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "The Alchemist by Paulo Coelho",
    description: "Bestselling novel about following your dreams",
    category: "Books",
    subcategory: "Fiction",
    brand: "HarperCollins",
    price: 399,
    compareAtPrice: 299,
    tags: ["book", "fiction", "paulo-coelho", "novel", "inspiration"],
    store: null,
    sku: "TAC-PB-EN",
    stockQuantity: 200,
    rating: 4.8,
    reviewCount: 2345,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Think and Grow Rich by Napoleon Hill",
    description: "Classic self-help book on success principles",
    category: "Books",
    subcategory: "Self-Help",
    brand: "Simon & Schuster",
    price: 299,
    compareAtPrice: 199,
    tags: ["book", "self-help", "success", "motivation", "business"],
    store: null,
    sku: "TAGR-PB-EN",
    stockQuantity: 150,
    rating: 4.6,
    reviewCount: 1890,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "MacBook Pro 14-inch",
    description: "Powerful laptop for professionals with M3 Pro chip",
    category: "Electronics",
    subcategory: "Computers",
    brand: "Apple",
    price: 249999,
    compareAtPrice: 229999,
    tags: ["laptop", "macbook", "apple", "m3", "professional"],
    store: null,
    sku: "MBP14-M3P-512",
    stockQuantity: 15,
    rating: 4.9,
    reviewCount: 456,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Premium noise-cancelling wireless headphones",
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    price: 34999,
    compareAtPrice: 29999,
    tags: ["headphones", "sony", "wireless", "noise-cancelling", "audio"],
    store: null,
    sku: "SWH1000XM5-BL",
    stockQuantity: 35,
    rating: 4.8,
    reviewCount: 789,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Puma RS-X Sneakers",
    description: "Retro-inspired sneakers with bold design",
    category: "Fashion",
    subcategory: "Footwear",
    brand: "Puma",
    price: 8999,
    compareAtPrice: 6999,
    tags: ["sneakers", "puma", "retro", "casual", "fashion"],
    store: null,
    sku: "PRSX-BW-42",
    stockQuantity: 55,
    rating: 4.3,
    reviewCount: 234,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat for home workouts",
    category: "Sports & Outdoors",
    subcategory: "Fitness",
    brand: "Lululemon",
    price: 3999,
    compareAtPrice: 2999,
    tags: ["yoga", "mat", "fitness", "workout", "non-slip"],
    store: null,
    sku: "YM-PREM-BL",
    stockQuantity: 120,
    rating: 4.5,
    reviewCount: 345,
    isAvailable: true,
    isPublished: true,
  },
  {
    name: "Coffee Maker Automatic",
    description: "Programmable coffee maker with thermal carafe",
    category: "Home & Kitchen",
    subcategory: "Appliances",
    brand: "Philips",
    price: 8999,
    compareAtPrice: 7499,
    tags: ["coffee", "maker", "automatic", "programmable", "kitchen"],
    store: null,
    sku: "CMA-12CUP-BL",
    stockQuantity: 25,
    rating: 4.4,
    reviewCount: 178,
    isAvailable: true,
    isPublished: true,
  },
];

async function createSearchTestData() {
  try {
    console.log("🚀 Creating search test data...\n");

    // Clear existing data
    await Product.deleteMany({});
    await Store.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create stores
    const createdStores = [];
    for (const storeData of sampleStores) {
      const store = new Store({
        ...storeData,
        owner: new mongoose.Types.ObjectId(), // Dummy owner ID
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedStore = await store.save();
      createdStores.push(savedStore);
      console.log(`✅ Created store: ${storeData.name}`);
    }

    // Create products with store references
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i];
      const storeIndex = i % createdStores.length;

      const product = new Product({
        ...productData,
        store: createdStores[storeIndex]._id,
        vendor: createdStores[storeIndex].owner,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedProduct = await product.save();
      console.log(
        `✅ Created product: ${productData.name} (Store: ${createdStores[storeIndex].name})`
      );
    }

    console.log("\n🎉 Search test data created successfully!");
    console.log(`📊 Created ${createdStores.length} stores`);
    console.log(`📦 Created ${sampleProducts.length} products`);

    // Display some sample data for verification
    const totalProducts = await Product.countDocuments();
    const totalStores = await Store.countDocuments();

    console.log(`\n📈 Database Summary:`);
    console.log(`   - Total Products: ${totalProducts}`);
    console.log(`   - Total Stores: ${totalStores}`);

    // Show sample products by category
    const categories = await Product.distinct("category");
    console.log(`\n🏷️  Available Categories: ${categories.join(", ")}`);

    // Show sample brands
    const brands = await Product.distinct("brand");
    console.log(`🏭 Available Brands: ${brands.join(", ")}`);
  } catch (error) {
    console.error("❌ Error creating search test data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

createSearchTestData();
