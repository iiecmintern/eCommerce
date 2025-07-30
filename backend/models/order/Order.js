const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Order Information
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    orderType: {
      type: String,
      enum: ["retail", "wholesale", "subscription"],
      default: "retail",
    },

    // Customer Information
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    guestCustomer: {
      name: String,
      email: String,
      phone: String,
    },

    // Store and Vendor Information
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
    },

    // Order Items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variant: {
          name: String,
          value: String,
          sku: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        unitPrice: {
          type: Number,
          required: true,
          min: [0, "Unit price cannot be negative"],
        },
        totalPrice: {
          type: Number,
          required: true,
          min: [0, "Total price cannot be negative"],
        },
        gstRate: {
          type: Number,
          default: 18,
        },
        gstAmount: {
          type: Number,
          default: 0,
        },
        discount: {
          type: Number,
          default: 0,
        },
        appliedCoupon: {
          code: String,
          discount: Number,
        },
      },
    ],

    // Pricing Breakdown
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: [0, "Subtotal cannot be negative"],
      },
      tax: {
        type: Number,
        default: 0,
        min: [0, "Tax cannot be negative"],
      },
      shipping: {
        type: Number,
        default: 0,
        min: [0, "Shipping cannot be negative"],
      },
      discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
      },
      couponDiscount: {
        type: Number,
        default: 0,
        min: [0, "Coupon discount cannot be negative"],
      },
      total: {
        type: Number,
        required: true,
        min: [0, "Total cannot be negative"],
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // Applied Coupon
    appliedCoupon: {
      code: String,
      discount: Number,
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
    },

    // Shipping Information
    shipping: {
      address: {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        email: String,
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          default: "India",
        },
        pincode: {
          type: String,
          required: true,
        },
        landmark: String,
      },
      method: {
        type: String,
        enum: ["standard", "express", "premium", "free"],
        default: "standard",
      },
      cost: {
        type: Number,
        default: 0,
      },
      estimatedDelivery: {
        type: Date,
      },
      trackingNumber: String,
      trackingUrl: String,
      carrier: String,
    },

    // Billing Information
    billing: {
      address: {
        name: String,
        phone: String,
        email: String,
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
      },
      gstNumber: String,
      panNumber: String,
    },

    // Payment Information
    payment: {
      method: {
        type: String,
        enum: ["cod", "online", "upi", "card", "netbanking", "wallet"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      gateway: String,
      amount: {
        type: Number,
        required: true,
      },
      paidAt: Date,
      refundAmount: {
        type: Number,
        default: 0,
      },
      refundReason: String,
      refundedAt: Date,
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // Notes and Comments
    notes: {
      customer: String,
      vendor: String,
      admin: String,
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
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for order total
orderSchema.virtual("totalAmount").get(function () {
  return this.pricing.total;
});

// Virtual for order status display
orderSchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Returned",
    refunded: "Refunded",
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment status display
orderSchema.virtual("paymentStatusDisplay").get(function () {
  const statusMap = {
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    failed: "Failed",
    refunded: "Refunded",
  };
  return statusMap[this.payment.status] || this.payment.status;
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ vendor: 1 });
orderSchema.index({ store: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "shipping.trackingNumber": 1 });

// Pre-save middleware to generate order number
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `ORD${timestamp}${random}`;
  }

  // Update status history
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }

  next();
});

// Static method to find orders by customer
orderSchema.statics.findByCustomer = function (customerId) {
  return this.find({ customer: customerId })
    .populate("store", "name")
    .populate("vendor", "firstName lastName")
    .populate("items.product", "name images price")
    .sort({ createdAt: -1 });
};

// Static method to find orders by vendor
orderSchema.statics.findByVendor = function (vendorId) {
  return this.find({ vendor: vendorId })
    .populate("customer", "firstName lastName email")
    .populate("items.product", "name images price")
    .sort({ createdAt: -1 });
};

// Static method to find orders by store
orderSchema.statics.findByStore = function (storeId) {
  return this.find({ store: storeId })
    .populate("customer", "firstName lastName email")
    .populate("items.product", "name images price")
    .sort({ createdAt: -1 });
};

// Instance method to calculate totals
orderSchema.methods.calculateTotals = function () {
  let subtotal = 0;
  let tax = 0;
  let discount = 0;

  this.items.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    tax += item.gstAmount || 0;
    discount += item.discount || 0;
  });

  this.pricing.subtotal = subtotal;
  this.pricing.tax = tax;
  this.pricing.discount = discount;
  this.pricing.total =
    subtotal +
    tax +
    this.pricing.shipping -
    discount -
    this.pricing.couponDiscount;

  return this.save();
};

// Instance method to update order status
orderSchema.methods.updateStatus = function (
  newStatus,
  note = "",
  updatedBy = null
) {
  this.status = newStatus;

  // Set specific timestamps
  switch (newStatus) {
    case "confirmed":
      this.confirmedAt = new Date();
      break;
    case "shipped":
      this.shippedAt = new Date();
      break;
    case "delivered":
      this.deliveredAt = new Date();
      break;
    case "cancelled":
      this.cancelledAt = new Date();
      break;
  }

  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy,
  });

  return this.save();
};

// Instance method to process payment
orderSchema.methods.processPayment = function (paymentData) {
  this.payment = {
    ...this.payment,
    ...paymentData,
    paidAt: new Date(),
  };

  return this.save();
};

// Instance method to add tracking information
orderSchema.methods.addTracking = function (trackingData) {
  this.shipping = {
    ...this.shipping,
    ...trackingData,
  };

  return this.save();
};

module.exports = mongoose.model("Order", orderSchema);
