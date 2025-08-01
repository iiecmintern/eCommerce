const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Product description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },

    // Vendor Information
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },

    // Category and Classification
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Books",
        "Sports & Outdoors",
        "Health & Beauty",
        "Toys & Games",
        "Food & Beverage",
        "Art & Crafts",
        "Automotive",
        "Business & Industrial",
        "Other",
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Pricing Information (Indian Market)
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare at price cannot be negative"],
    },
    costPrice: {
      type: Number,
      min: [0, "Cost price cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR", "GBP"],
    },

    // GST Information (Indian Tax System)
    gstRate: {
      type: Number,
      default: 18, // Default GST rate
      min: [0, "GST rate cannot be negative"],
      max: [28, "GST rate cannot exceed 28%"],
    },
    gstIncluded: {
      type: Boolean,
      default: true, // Price includes GST by default
    },

    // Inventory Management
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
    allowBackorders: {
      type: Boolean,
      default: false,
    },

    // Product Variants - Enhanced Structure
    variants: [
      {
        // Variant combination (e.g., "Red-Large-Cotton")
        combination: {
          type: String,
          required: true,
          trim: true,
        },
        // Individual variant options
        options: [
          {
            type: {
              type: String,
              required: true,
              enum: ["color", "size", "material", "storage", "style", "other"],
            },
            name: {
              type: String,
              required: true,
              trim: true,
            },
            value: {
              type: String,
              required: true,
              trim: true,
            },
            // For color variants, store hex code
            hexCode: String,
            // For size variants, store measurements
            measurements: {
              length: Number,
              width: Number,
              height: Number,
              weight: Number,
            },
          },
        ],
        // Variant-specific pricing
        price: {
          type: Number,
          min: [0, "Variant price cannot be negative"],
        },
        compareAtPrice: {
          type: Number,
          min: [0, "Variant compare price cannot be negative"],
        },
        costPrice: {
          type: Number,
          min: [0, "Variant cost price cannot be negative"],
        },
        // Variant-specific inventory
        stockQuantity: {
          type: Number,
          default: 0,
          min: [0, "Stock quantity cannot be negative"],
        },
        lowStockThreshold: {
          type: Number,
          default: 5,
          min: [0, "Low stock threshold cannot be negative"],
        },
        // Variant-specific SKU
        sku: {
          type: String,
          trim: true,
        },
        // Variant-specific images
        images: [
          {
            url: {
              type: String,
              required: true,
            },
            alt: String,
            isPrimary: {
              type: Boolean,
              default: false,
            },
            order: {
              type: Number,
              default: 0,
            },
          },
        ],
        // Variant availability
        isActive: {
          type: Boolean,
          default: true,
        },
        // Variant-specific weight and dimensions
        weight: {
          type: Number,
          min: [0, "Weight cannot be negative"],
        },
        dimensions: {
          length: Number,
          width: Number,
          height: Number,
        },
      },
    ],

    // Variant configuration
    variantConfig: {
      // Available variant types for this product
      types: [
        {
          type: String,
          enum: ["color", "size", "material", "storage", "style", "other"],
        },
      ],
      // Whether variants are required for purchase
      required: {
        type: Boolean,
        default: false,
      },
      // Default variant (if any)
      defaultVariant: String,
    },

    // Images and Media
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    thumbnail: {
      type: String,
    },

    // Product Specifications
    specifications: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],

    // Shipping Information
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingClass: {
      type: String,
      enum: ["Standard", "Express", "Premium", "Free"],
      default: "Standard",
    },

    // SEO and Marketing
    metaTitle: {
      type: String,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    // Status and Visibility
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },

    // Ratings and Reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price && this.price) {
    return Math.round(
      ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
    );
  }
  return 0;
});

// Virtual for final price (including GST if not included)
productSchema.virtual("finalPrice").get(function () {
  if (!this.price) return 0;
  if (this.gstIncluded) {
    return this.price;
  }
  return this.price + (this.price * (this.gstRate || 0)) / 100;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (!this.trackInventory) return "in_stock";
  if (!this.stockQuantity || this.stockQuantity <= 0) return "out_of_stock";
  if (this.stockQuantity <= (this.lowStockThreshold || 0)) return "low_stock";
  return "in_stock";
});

// Virtual for inStock boolean
productSchema.virtual("inStock").get(function () {
  if (!this.trackInventory) return true;
  return this.stockQuantity > 0;
});

// Enhanced virtuals for variant management
productSchema.virtual("hasVariants").get(function () {
  return this.variants && this.variants.length > 0;
});

productSchema.virtual("availableVariants").get(function () {
  if (!this.variants) return [];
  return this.variants.filter((variant) => variant.isActive !== false);
});

productSchema.virtual("variantTypes").get(function () {
  if (!this.variantConfig?.types) return [];
  return this.variantConfig.types;
});

productSchema.virtual("variantOptions").get(function () {
  if (!this.variants) return {};

  const options = {};
  this.variants.forEach((variant) => {
    variant.options.forEach((option) => {
      if (!options[option.type]) {
        options[option.type] = new Set();
      }
      options[option.type].add(option.value);
    });
  });

  // Convert Sets to Arrays
  Object.keys(options).forEach((key) => {
    options[key] = Array.from(options[key]);
  });

  return options;
});

productSchema.virtual("minVariantPrice").get(function () {
  if (!this.variants || this.variants.length === 0) {
    return this.price;
  }

  const activeVariants = this.variants.filter((v) => v.isActive !== false);
  if (activeVariants.length === 0) return this.price;

  return Math.min(...activeVariants.map((v) => v.price || this.price));
});

productSchema.virtual("maxVariantPrice").get(function () {
  if (!this.variants || this.variants.length === 0) {
    return this.price;
  }

  const activeVariants = this.variants.filter((v) => v.isActive !== false);
  if (activeVariants.length === 0) return this.price;

  return Math.max(...activeVariants.map((v) => v.price || this.price));
});

productSchema.virtual("variantPriceRange").get(function () {
  const min = this.minVariantPrice;
  const max = this.maxVariantPrice;

  if (min === max) {
    return `₹${min.toLocaleString()}`;
  }

  return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
});

// Indexes for better query performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ vendor: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ isPublished: 1, status: 1 });
productSchema.index({ isFeatured: 1, isPublished: 1 });
productSchema.index({ averageRating: -1, totalReviews: -1 });

// Pre-save middleware to generate slug if not provided
productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Set publishedAt when status changes to active
  if (
    this.isModified("status") &&
    this.status === "active" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

// Static method to find products by category
productSchema.statics.findByCategory = function (category) {
  return this.find({
    category,
    status: "active",
    isPublished: true,
  }).populate("vendor", "firstName lastName company");
};

// Static method to find featured products
productSchema.statics.findFeatured = function () {
  return this.find({
    isFeatured: true,
    status: "active",
    isPublished: true,
  }).populate("vendor", "firstName lastName company");
};

// Instance method to update stock
productSchema.methods.updateStock = function (
  quantity,
  operation = "decrease"
) {
  if (!this.trackInventory) return true;

  if (operation === "decrease") {
    if (this.stockQuantity < quantity && !this.allowBackorders) {
      throw new Error("Insufficient stock");
    }
    this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
  } else if (operation === "increase") {
    this.stockQuantity += quantity;
  }

  return this.save();
};

// Instance method to calculate final price
productSchema.methods.getFinalPrice = function () {
  if (this.gstIncluded) {
    return this.price;
  }
  return this.price + (this.price * this.gstRate) / 100;
};

// Enhanced instance methods for variant management
productSchema.methods.findVariant = function (combination) {
  if (!this.variants) return null;
  return this.variants.find((v) => v.combination === combination);
};

productSchema.methods.findVariantByOptions = function (options) {
  if (!this.variants) return null;

  return this.variants.find((variant) => {
    return variant.options.every((option) => {
      const matchingOption = options.find(
        (opt) => opt.type === option.type && opt.value === option.value
      );
      return matchingOption !== undefined;
    });
  });
};

productSchema.methods.updateVariantStock = function (
  combination,
  quantity,
  operation = "decrease"
) {
  const variant = this.findVariant(combination);
  if (!variant) {
    throw new Error("Variant not found");
  }

  if (operation === "decrease") {
    if (variant.stockQuantity < quantity && !this.allowBackorders) {
      throw new Error("Insufficient stock for variant");
    }
    variant.stockQuantity = Math.max(0, variant.stockQuantity - quantity);
  } else if (operation === "increase") {
    variant.stockQuantity += quantity;
  }

  return this.save();
};

productSchema.methods.getVariantPrice = function (combination) {
  const variant = this.findVariant(combination);
  if (!variant) return this.price;
  return variant.price || this.price;
};

productSchema.methods.getVariantStockStatus = function (combination) {
  const variant = this.findVariant(combination);
  if (!variant) return "out_of_stock";

  if (variant.stockQuantity <= 0) return "out_of_stock";
  if (variant.stockQuantity <= variant.lowStockThreshold) return "low_stock";
  return "in_stock";
};

productSchema.methods.generateVariantCombinations = function (variantTypes) {
  if (!variantTypes || variantTypes.length === 0) return [];

  const options = this.variantOptions;
  const combinations = [];

  // Generate all possible combinations
  const generateCombos = (currentCombo, typeIndex) => {
    if (typeIndex === variantTypes.length) {
      combinations.push([...currentCombo]);
      return;
    }

    const currentType = variantTypes[typeIndex];
    const typeOptions = options[currentType] || [];

    typeOptions.forEach((option) => {
      currentCombo.push({ type: currentType, value: option });
      generateCombos(currentCombo, typeIndex + 1);
      currentCombo.pop();
    });
  };

  generateCombos([], 0);
  return combinations;
};

productSchema.methods.addVariant = function (variantData) {
  if (!this.variants) {
    this.variants = [];
  }

  // Generate combination string
  const combination = variantData.options.map((opt) => opt.value).join("-");

  const newVariant = {
    combination,
    options: variantData.options,
    price: variantData.price || this.price,
    compareAtPrice: variantData.compareAtPrice,
    costPrice: variantData.costPrice,
    stockQuantity: variantData.stockQuantity || 0,
    lowStockThreshold: variantData.lowStockThreshold || 5,
    sku: variantData.sku,
    images: variantData.images || [],
    isActive: variantData.isActive !== false,
    weight: variantData.weight,
    dimensions: variantData.dimensions,
  };

  this.variants.push(newVariant);
  return this.save();
};

productSchema.methods.updateVariant = function (combination, updateData) {
  const variant = this.findVariant(combination);
  if (!variant) {
    throw new Error("Variant not found");
  }

  Object.assign(variant, updateData);
  return this.save();
};

productSchema.methods.removeVariant = function (combination) {
  const variantIndex = this.variants.findIndex(
    (v) => v.combination === combination
  );
  if (variantIndex === -1) {
    throw new Error("Variant not found");
  }

  this.variants.splice(variantIndex, 1);
  return this.save();
};

module.exports = mongoose.model("Product", productSchema);
