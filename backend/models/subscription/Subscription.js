const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "Plan is required"],
    },
    status: {
      type: String,
      enum: [
        "active",
        "cancelled",
        "past_due",
        "trialing",
        "incomplete",
        "incomplete_expired",
      ],
      default: "trialing",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      required: [true, "Billing cycle is required"],
    },
    currentPeriodStart: {
      type: Date,
      required: [true, "Current period start is required"],
    },
    currentPeriodEnd: {
      type: Date,
      required: [true, "Current period end is required"],
    },
    trialStart: {
      type: Date,
    },
    trialEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ["card", "paypal", "bank_transfer"],
      },
      last4: String,
      brand: String,
      expMonth: Number,
      expYear: Number,
    },
    amount: {
      type: Number,
      required: [true, "Subscription amount is required"],
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "INR", "EUR", "GBP"],
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripeCustomerId: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });

// Virtual for subscription status display
subscriptionSchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    active: "Active",
    cancelled: "Cancelled",
    past_due: "Past Due",
    trialing: "Trial",
    incomplete: "Incomplete",
    incomplete_expired: "Expired",
  };
  return statusMap[this.status] || this.status;
});

// Virtual for next billing date
subscriptionSchema.virtual("nextBillingDate").get(function () {
  if (this.status === "cancelled" || this.cancelAtPeriodEnd) {
    return this.currentPeriodEnd;
  }
  return this.currentPeriodEnd;
});

// Virtual for days remaining in trial
subscriptionSchema.virtual("trialDaysRemaining").get(function () {
  if (!this.trialEnd || this.status !== "trialing") {
    return 0;
  }
  const now = new Date();
  const trialEnd = new Date(this.trialEnd);
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for is in trial
subscriptionSchema.virtual("isInTrial").get(function () {
  return this.status === "trialing" && this.trialDaysRemaining > 0;
});

// Virtual for is active
subscriptionSchema.virtual("isActive").get(function () {
  return ["active", "trialing"].includes(this.status);
});

// Instance method to cancel subscription
subscriptionSchema.methods.cancel = function (cancelAtPeriodEnd = true) {
  this.cancelAtPeriodEnd = cancelAtPeriodEnd;
  this.cancelledAt = new Date();

  if (!cancelAtPeriodEnd) {
    this.status = "cancelled";
    this.endedAt = new Date();
  }

  return this.save();
};

// Instance method to reactivate subscription
subscriptionSchema.methods.reactivate = function () {
  this.cancelAtPeriodEnd = false;
  this.cancelledAt = undefined;
  this.status = "active";
  return this.save();
};

// Static method to get active subscriptions
subscriptionSchema.statics.getActiveSubscriptions = function () {
  return this.find({ status: { $in: ["active", "trialing"] } })
    .populate("user", "firstName lastName email")
    .populate("plan", "name type pricing");
};

// Static method to get subscription by user
subscriptionSchema.statics.getByUser = function (userId) {
  return this.findOne({ user: userId })
    .populate("plan")
    .sort({ createdAt: -1 });
};

// Static method to get expiring subscriptions
subscriptionSchema.statics.getExpiringSubscriptions = function (days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return this.find({
    currentPeriodEnd: { $lte: date },
    status: { $in: ["active", "trialing"] },
  }).populate("user", "firstName lastName email");
};

// Pre-save middleware to set trial dates if not provided
subscriptionSchema.pre("save", function (next) {
  if (this.isNew && !this.trialStart) {
    this.trialStart = new Date();
    this.currentPeriodStart = new Date();

    // Set trial end to 14 days from now
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);
    this.trialEnd = trialEnd;

    // Set current period end to trial end
    this.currentPeriodEnd = trialEnd;
  }

  next();
});

// Ensure virtual fields are serialized
subscriptionSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    return ret;
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
