const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    type: {
      type: String,
      enum: ["card", "paypal", "bank_transfer"],
      required: [true, "Payment method type is required"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    // Card details
    card: {
      brand: {
        type: String,
        enum: ["visa", "mastercard", "amex", "discover", "jcb", "diners_club"],
      },
      last4: {
        type: String,
        maxlength: 4,
      },
      expMonth: {
        type: Number,
        min: 1,
        max: 12,
      },
      expYear: {
        type: Number,
        min: 2020,
      },
      country: {
        type: String,
        maxlength: 2,
      },
    },
    // PayPal details
    paypal: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    // Bank transfer details
    bank: {
      accountHolderName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      routingNumber: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
    },
    // Stripe payment method ID
    stripePaymentMethodId: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Stripe customer ID
    stripeCustomerId: {
      type: String,
    },
    // Metadata
    metadata: {
      type: Map,
      of: String,
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
paymentMethodSchema.index({ user: 1 });
paymentMethodSchema.index({ isDefault: 1 });
paymentMethodSchema.index({ stripePaymentMethodId: 1 });
paymentMethodSchema.index({ isActive: 1 });

// Virtual for display name
paymentMethodSchema.virtual("displayName").get(function () {
  if (this.type === "card" && this.card) {
    return `${this.card.brand} ending in ${this.card.last4}`;
  }
  if (this.type === "paypal" && this.paypal) {
    return `PayPal (${this.paypal.email})`;
  }
  if (this.type === "bank_transfer" && this.bank) {
    return `${this.bank.bankName} - ${this.bank.accountNumber.slice(-4)}`;
  }
  return "Payment Method";
});

// Virtual for masked details
paymentMethodSchema.virtual("maskedDetails").get(function () {
  if (this.type === "card" && this.card) {
    return {
      brand: this.card.brand,
      last4: this.card.last4,
      expMonth: this.card.expMonth,
      expYear: this.card.expYear,
    };
  }
  if (this.type === "paypal" && this.paypal) {
    return {
      email: this.paypal.email,
    };
  }
  if (this.type === "bank_transfer" && this.bank) {
    return {
      bankName: this.bank.bankName,
      last4: this.bank.accountNumber.slice(-4),
    };
  }
  return {};
});

// Instance method to set as default
paymentMethodSchema.methods.setAsDefault = async function () {
  // Remove default from other payment methods for this user
  await this.constructor.updateMany(
    { user: this.user, _id: { $ne: this._id } },
    { isDefault: false }
  );

  // Set this as default
  this.isDefault = true;
  return this.save();
};

// Instance method to deactivate
paymentMethodSchema.methods.deactivate = function () {
  this.isActive = false;
  if (this.isDefault) {
    this.isDefault = false;
  }
  return this.save();
};

// Static method to get user's payment methods
paymentMethodSchema.statics.getByUser = function (userId) {
  return this.find({ user: userId, isActive: true }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

// Static method to get user's default payment method
paymentMethodSchema.statics.getDefaultByUser = function (userId) {
  return this.findOne({ user: userId, isDefault: true, isActive: true });
};

// Pre-save middleware to ensure only one default payment method per user
paymentMethodSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Ensure virtual fields are serialized
paymentMethodSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    // Remove sensitive information
    delete ret.stripePaymentMethodId;
    delete ret.stripeCustomerId;
    return ret;
  },
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
