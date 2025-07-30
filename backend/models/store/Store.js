const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      maxlength: [100, "Store name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Store description cannot exceed 1000 characters"],
    },
    tagline: {
      type: String,
      maxlength: [200, "Tagline cannot exceed 200 characters"],
    },

    // Owner Information
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Store owner is required"],
    },

    // Contact Information
    contact: {
      email: {
        type: String,
        required: [true, "Store email is required"],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Store phone is required"],
      },
      address: {
        street: String,
        city: String,
        state: String,
        country: {
          type: String,
          default: "India",
        },
        pincode: String,
      },
    },

    // Business Information
    business: {
      type: {
        type: String,
        enum: [
          "Individual",
          "Partnership",
          "Private Limited",
          "Public Limited",
          "LLP",
          "Other",
        ],
        default: "Individual",
      },
      gstNumber: {
        type: String,
        trim: true,
      },
      panNumber: {
        type: String,
        trim: true,
      },
      businessLicense: {
        type: String,
        trim: true,
      },
    },

    // Store Settings
    settings: {
      currency: {
        type: String,
        default: "INR",
        enum: ["INR", "USD", "EUR", "GBP"],
      },
      language: {
        type: String,
        default: "en",
        enum: ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa"],
      },
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
      autoApproveReviews: {
        type: Boolean,
        default: false,
      },
      allowGuestCheckout: {
        type: Boolean,
        default: true,
      },
      requirePhoneVerification: {
        type: Boolean,
        default: false,
      },
    },

    // Payment Settings
    payment: {
      acceptedMethods: [
        {
          type: String,
          enum: ["cod", "online", "upi", "card", "netbanking", "wallet"],
          default: ["cod", "online"],
        },
      ],
      autoCapture: {
        type: Boolean,
        default: true,
      },
      allowPartialPayments: {
        type: Boolean,
        default: false,
      },
    },

    // Shipping Settings
    shipping: {
      freeShippingThreshold: {
        type: Number,
        default: 0,
      },
      defaultShippingCost: {
        type: Number,
        default: 0,
      },
      shippingZones: [
        {
          name: String,
          countries: [String],
          cost: Number,
          freeAbove: Number,
        },
      ],
      processingTime: {
        type: Number,
        default: 1, // days
        min: 0,
      },
    },

    // Store Appearance
    appearance: {
      logo: {
        type: String,
      },
      banner: {
        type: String,
      },
      theme: {
        primaryColor: {
          type: String,
          default: "#3B82F6",
        },
        secondaryColor: {
          type: String,
          default: "#1E40AF",
        },
      },
      customCSS: {
        type: String,
      },
    },

    // SEO and Marketing
    seo: {
      metaTitle: {
        type: String,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [String],
      slug: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
      },
    },

    // Social Media
    social: {
      website: String,
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String,
    },

    // Store Statistics
    stats: {
      totalProducts: {
        type: Number,
        default: 0,
      },
      totalOrders: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      totalCustomers: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },

    // Store Status
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Verification Information
    verification: {
      documentsSubmitted: {
        type: Boolean,
        default: false,
      },
      documentsVerified: {
        type: Boolean,
        default: false,
      },
      verificationDate: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
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

// Virtual for store URL
storeSchema.virtual("storeUrl").get(function () {
  return `/store/${this.slug}`;
});

// Virtual for store rating display
storeSchema.virtual("ratingDisplay").get(function () {
  if (!this.stats || this.stats.totalReviews === 0) return "No ratings yet";
  return `${(this.stats.averageRating || 0).toFixed(
    1
  )} (${this.stats.totalReviews} reviews)`;
});

// Indexes for better query performance
storeSchema.index({ slug: 1 });
storeSchema.index({ owner: 1 });
storeSchema.index({ status: 1, isPublished: 1 });
storeSchema.index({ isFeatured: 1, status: 1 });
storeSchema.index({ "stats.averageRating": -1, "stats.totalReviews": -1 });
storeSchema.index({ name: "text", description: "text" });

// Pre-save middleware to generate slug if not provided
storeSchema.pre("save", function (next) {
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

// Static method to find active stores
storeSchema.statics.findActive = function () {
  return this.find({
    status: "active",
    isPublished: true,
  }).populate("owner", "firstName lastName company");
};

// Static method to find featured stores
storeSchema.statics.findFeatured = function () {
  return this.find({
    isFeatured: true,
    status: "active",
    isPublished: true,
  }).populate("owner", "firstName lastName company");
};

// Instance method to update store statistics
storeSchema.methods.updateStats = function () {
  const Product = mongoose.model("Product");
  const Order = mongoose.model("Order");

  return Promise.all([
    Product.countDocuments({ store: this._id, status: "active" }),
    Order.countDocuments({
      store: this._id,
      status: { $in: ["completed", "delivered"] },
    }),
    Order.aggregate([
      {
        $match: {
          store: this._id,
          status: { $in: ["completed", "delivered"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.distinct("customer", { store: this._id }),
    Product.aggregate([
      { $match: { store: this._id, status: "active" } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$averageRating" },
          totalReviews: { $sum: "$totalReviews" },
        },
      },
    ]),
  ]).then(
    ([totalProducts, totalOrders, revenueResult, customers, ratingResult]) => {
      this.stats.totalProducts = totalProducts;
      this.stats.totalOrders = totalOrders;
      this.stats.totalRevenue = revenueResult[0]?.total || 0;
      this.stats.totalCustomers = customers.length;
      this.stats.averageRating = ratingResult[0]?.avgRating || 0;
      this.stats.totalReviews = ratingResult[0]?.totalReviews || 0;

      return this.save();
    }
  );
};

// Instance method to verify store
storeSchema.methods.verify = function (adminId) {
  this.isVerified = true;
  this.verification.documentsVerified = true;
  this.verification.verificationDate = new Date();
  this.verification.verifiedBy = adminId;
  this.status = "active";

  return this.save();
};

module.exports = mongoose.model("Store", storeSchema);
