const mongoose = require("mongoose");
const Product = require("../models/product/Product");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Enhanced variant data for different product types
const enhancedVariants = {
  // Smartphone variants
  smartphone: {
    variantConfig: {
      types: ["color", "storage"],
      required: true,
      defaultVariant: "Titanium Black-256GB",
    },
    variants: [
      {
        combination: "Titanium Black-256GB",
        options: [
          {
            type: "color",
            name: "Color",
            value: "Titanium Black",
            hexCode: "#1a1a1a",
          },
          { type: "storage", name: "Storage", value: "256GB" },
        ],
        price: 124999,
        compareAtPrice: 149999,
        costPrice: 100000,
        stockQuantity: 50,
        lowStockThreshold: 10,
        sku: "SAMS24U-BLK-256",
        images: [
          {
            url: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
            alt: "Samsung Galaxy S24 Ultra Titanium Black 256GB",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 232,
        dimensions: { length: 163.4, width: 79.0, height: 8.6 },
      },
      {
        combination: "Titanium Black-512GB",
        options: [
          {
            type: "color",
            name: "Color",
            value: "Titanium Black",
            hexCode: "#1a1a1a",
          },
          { type: "storage", name: "Storage", value: "512GB" },
        ],
        price: 134999,
        compareAtPrice: 159999,
        costPrice: 110000,
        stockQuantity: 30,
        lowStockThreshold: 8,
        sku: "SAMS24U-BLK-512",
        images: [
          {
            url: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
            alt: "Samsung Galaxy S24 Ultra Titanium Black 512GB",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 232,
        dimensions: { length: 163.4, width: 79.0, height: 8.6 },
      },
      {
        combination: "Titanium Gray-256GB",
        options: [
          {
            type: "color",
            name: "Color",
            value: "Titanium Gray",
            hexCode: "#8a8a8a",
          },
          { type: "storage", name: "Storage", value: "256GB" },
        ],
        price: 124999,
        compareAtPrice: 149999,
        costPrice: 100000,
        stockQuantity: 25,
        lowStockThreshold: 8,
        sku: "SAMS24U-GRY-256",
        images: [
          {
            url: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
            alt: "Samsung Galaxy S24 Ultra Titanium Gray 256GB",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 232,
        dimensions: { length: 163.4, width: 79.0, height: 8.6 },
      },
      {
        combination: "Titanium Violet-256GB",
        options: [
          {
            type: "color",
            name: "Color",
            value: "Titanium Violet",
            hexCode: "#8b5cf6",
          },
          { type: "storage", name: "Storage", value: "256GB" },
        ],
        price: 124999,
        compareAtPrice: 149999,
        costPrice: 100000,
        stockQuantity: 20,
        lowStockThreshold: 5,
        sku: "SAMS24U-VIO-256",
        images: [
          {
            url: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg",
            alt: "Samsung Galaxy S24 Ultra Titanium Violet 256GB",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 232,
        dimensions: { length: 163.4, width: 79.0, height: 8.6 },
      },
    ],
  },

  // T-shirt variants
  tshirt: {
    variantConfig: {
      types: ["color", "size"],
      required: true,
      defaultVariant: "Black-S",
    },
    variants: [
      {
        combination: "Black-S",
        options: [
          { type: "color", name: "Color", value: "Black", hexCode: "#000000" },
          {
            type: "size",
            name: "Size",
            value: "S",
            measurements: { length: 26, width: 18, height: 1, weight: 150 },
          },
        ],
        price: 599,
        compareAtPrice: 999,
        costPrice: 300,
        stockQuantity: 100,
        lowStockThreshold: 20,
        sku: "TSHIRT-BLK-S",
        images: [
          {
            url: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
            alt: "Black T-Shirt Size S",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 150,
        dimensions: { length: 26, width: 18, height: 1 },
      },
      {
        combination: "Black-M",
        options: [
          { type: "color", name: "Color", value: "Black", hexCode: "#000000" },
          {
            type: "size",
            name: "Size",
            value: "M",
            measurements: { length: 28, width: 20, height: 1, weight: 160 },
          },
        ],
        price: 599,
        compareAtPrice: 999,
        costPrice: 300,
        stockQuantity: 150,
        lowStockThreshold: 25,
        sku: "TSHIRT-BLK-M",
        images: [
          {
            url: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
            alt: "Black T-Shirt Size M",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 160,
        dimensions: { length: 28, width: 20, height: 1 },
      },
      {
        combination: "White-S",
        options: [
          { type: "color", name: "Color", value: "White", hexCode: "#ffffff" },
          {
            type: "size",
            name: "Size",
            value: "S",
            measurements: { length: 26, width: 18, height: 1, weight: 150 },
          },
        ],
        price: 599,
        compareAtPrice: 999,
        costPrice: 300,
        stockQuantity: 80,
        lowStockThreshold: 15,
        sku: "TSHIRT-WHT-S",
        images: [
          {
            url: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
            alt: "White T-Shirt Size S",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 150,
        dimensions: { length: 26, width: 18, height: 1 },
      },
      {
        combination: "White-M",
        options: [
          { type: "color", name: "Color", value: "White", hexCode: "#ffffff" },
          {
            type: "size",
            name: "Size",
            value: "M",
            measurements: { length: 28, width: 20, height: 1, weight: 160 },
          },
        ],
        price: 599,
        compareAtPrice: 999,
        costPrice: 300,
        stockQuantity: 120,
        lowStockThreshold: 20,
        sku: "TSHIRT-WHT-M",
        images: [
          {
            url: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
            alt: "White T-Shirt Size M",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 160,
        dimensions: { length: 28, width: 20, height: 1 },
      },
    ],
  },

  // Laptop variants
  laptop: {
    variantConfig: {
      types: ["color", "storage", "ram"],
      required: true,
      defaultVariant: "Space Gray-512GB-8GB",
    },
    variants: [
      {
        combination: "Space Gray-512GB-8GB",
        options: [
          {
            type: "color",
            name: "Color",
            value: "Space Gray",
            hexCode: "#4a4a4a",
          },
          { type: "storage", name: "Storage", value: "512GB" },
          { type: "ram", name: "RAM", value: "8GB" },
        ],
        price: 89999,
        compareAtPrice: 109999,
        costPrice: 75000,
        stockQuantity: 15,
        lowStockThreshold: 5,
        sku: "MACBOOK-SG-512-8",
        images: [
          {
            url: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
            alt: "MacBook Pro Space Gray 512GB 8GB RAM",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 1400,
        dimensions: { length: 30.41, width: 21.24, height: 1.56 },
      },
      {
        combination: "Space Gray-1TB-16GB",
        options: [
          {
            type: "color",
            name: "Color",
            value: "Space Gray",
            hexCode: "#4a4a4a",
          },
          { type: "storage", name: "Storage", value: "1TB" },
          { type: "ram", name: "RAM", value: "16GB" },
        ],
        price: 119999,
        compareAtPrice: 139999,
        costPrice: 95000,
        stockQuantity: 10,
        lowStockThreshold: 3,
        sku: "MACBOOK-SG-1TB-16",
        images: [
          {
            url: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
            alt: "MacBook Pro Space Gray 1TB 16GB RAM",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 1400,
        dimensions: { length: 30.41, width: 21.24, height: 1.56 },
      },
      {
        combination: "Silver-512GB-8GB",
        options: [
          { type: "color", name: "Color", value: "Silver", hexCode: "#c0c0c0" },
          { type: "storage", name: "Storage", value: "512GB" },
          { type: "ram", name: "RAM", value: "8GB" },
        ],
        price: 89999,
        compareAtPrice: 109999,
        costPrice: 75000,
        stockQuantity: 12,
        lowStockThreshold: 4,
        sku: "MACBOOK-SLV-512-8",
        images: [
          {
            url: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
            alt: "MacBook Pro Silver 512GB 8GB RAM",
            isPrimary: true,
            order: 0,
          },
        ],
        isActive: true,
        weight: 1400,
        dimensions: { length: 30.41, width: 21.24, height: 1.56 },
      },
    ],
  },
};

async function addEnhancedVariants() {
  try {
    console.log("Starting to add enhanced variants to products...");

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;

    for (const product of products) {
      let variantData = null;

      // Determine variant type based on product name and category
      if (
        product.name.toLowerCase().includes("samsung") ||
        product.name.toLowerCase().includes("iphone") ||
        product.name.toLowerCase().includes("phone") ||
        product.category === "Electronics"
      ) {
        variantData = enhancedVariants.smartphone;
      } else if (
        product.name.toLowerCase().includes("shirt") ||
        product.name.toLowerCase().includes("tshirt") ||
        product.name.toLowerCase().includes("t-shirt") ||
        product.category === "Fashion"
      ) {
        variantData = enhancedVariants.tshirt;
      } else if (
        product.name.toLowerCase().includes("laptop") ||
        product.name.toLowerCase().includes("macbook") ||
        product.name.toLowerCase().includes("computer")
      ) {
        variantData = enhancedVariants.laptop;
      }

      if (variantData) {
        // Update product with enhanced variants
        product.variantConfig = variantData.variantConfig;
        product.variants = variantData.variants;

        await product.save();
        updatedCount++;
        console.log(`✅ Updated product: ${product.name}`);
      }
    }

    console.log(
      `\n🎉 Successfully updated ${updatedCount} products with enhanced variants!`
    );
    console.log("\nEnhanced variant features added:");
    console.log("✅ Color variants with hex codes");
    console.log("✅ Size variants with measurements");
    console.log("✅ Storage and RAM variants");
    console.log("✅ Variant-specific pricing");
    console.log("✅ Variant-specific inventory");
    console.log("✅ Variant-specific images");
    console.log("✅ Variant combinations");
    console.log("✅ Variant configuration");
  } catch (error) {
    console.error("Error adding enhanced variants:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the script
addEnhancedVariants();
