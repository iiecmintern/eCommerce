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

    // Product Variants
    variants: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        price: Number,
        stockQuantity: {
          type: Number,
          default: 0,
          min: 0,
        },
        sku: String,
      },
    ],

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

module.exports = mongoose.model("Product", productSchema);
