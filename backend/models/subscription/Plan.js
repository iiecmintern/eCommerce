const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      maxlength: [100, "Plan name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Plan description is required"],
      maxlength: [500, "Plan description cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: ["starter", "professional", "enterprise"],
      required: [true, "Plan type is required"],
    },
    pricing: {
      monthly: {
        type: Number,
        required: [true, "Monthly price is required"],
        min: [0, "Monthly price cannot be negative"],
      },
      annual: {
        type: Number,
        required: [true, "Annual price is required"],
        min: [0, "Annual price cannot be negative"],
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "INR", "EUR", "GBP"],
      },
    },
    features: {
      products: {
        type: String,
        enum: ["1000", "10000", "unlimited"],
        required: [true, "Product limit is required"],
      },
      storage: {
        type: String,
        enum: ["10GB", "100GB", "unlimited"],
        required: [true, "Storage limit is required"],
      },
      analytics: {
        type: Boolean,
        default: false,
      },
      multiCurrency: {
        type: Boolean,
        default: false,
      },
      apiAccess: {
        type: Boolean,
        default: false,
      },
      whiteLabel: {
        type: Boolean,
        default: false,
      },
      customIntegrations: {
        type: Boolean,
        default: false,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
      dedicatedSupport: {
        type: Boolean,
        default: false,
      },
    },
    limits: {
      maxProducts: {
        type: Number,
        required: [true, "Maximum products limit is required"],
      },
      maxStorageGB: {
        type: Number,
        required: [true, "Maximum storage limit is required"],
      },
      maxApiCalls: {
        type: Number,
        default: 0, // 0 means unlimited
      },
      maxUsers: {
        type: Number,
        default: 1,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    trialDays: {
      type: Number,
      default: 14,
      min: [0, "Trial days cannot be negative"],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
planSchema.index({ type: 1 });
planSchema.index({ isActive: 1 });
planSchema.index({ sortOrder: 1 });

// Virtual for formatted pricing
planSchema.virtual("formattedPricing").get(function () {
  return {
    monthly: {
      amount: this.pricing.monthly,
      currency: this.pricing.currency,
      formatted: `${this.pricing.currency === "USD" ? "$" : "₹"}${
        this.pricing.monthly
      }`,
    },
    annual: {
      amount: this.pricing.annual,
      currency: this.pricing.currency,
      formatted: `${this.pricing.currency === "USD" ? "$" : "₹"}${
        this.pricing.annual
      }`,
      monthlyEquivalent: Math.round(this.pricing.annual / 12),
    },
  };
});

// Virtual for annual savings
planSchema.virtual("annualSavings").get(function () {
  const monthlyTotal = this.pricing.monthly * 12;
  const savings = monthlyTotal - this.pricing.annual;
  const savingsPercentage = Math.round((savings / monthlyTotal) * 100);
  return {
    amount: savings,
    percentage: savingsPercentage,
  };
});

// Static method to get active plans
planSchema.statics.getActivePlans = function () {
  return this.find({ isActive: true }).sort({ sortOrder: 1 });
};

// Static method to get plan by type
planSchema.statics.getByType = function (type) {
  return this.findOne({ type, isActive: true });
};

// Ensure virtual fields are serialized
planSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    return ret;
  },
});

module.exports = mongoose.model("Plan", planSchema);
