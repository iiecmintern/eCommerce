const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Order Information
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Customer Information
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },

    // Order Items (simplified)
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
        image: String,
        vendor: String,
        store: String,
        total: {
          type: Number,
          required: true,
          min: [0, "Total cannot be negative"],
        },
      },
    ],

    // Shipping Address
    shippingAddress: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
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
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "India",
      },
    },

    // Payment Information
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi"],
      required: true,
    },

    // Pricing Breakdown
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: [0, "Subtotal cannot be negative"],
      },
      discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
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

    // Payment Details
    payment: {
      method: {
        type: String,
        enum: ["cod", "card", "upi"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      transactionId: String,
      amount: {
        type: Number,
        required: true,
      },
      paidAt: Date,
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Status History
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Tracking Information
    tracking: {
      trackingNumber: String,
      trackingUrl: String,
      carrier: String,
      addedAt: Date,
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
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment status display
orderSchema.virtual("paymentStatusDisplay").get(function () {
  const statusMap = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
  };
  return statusMap[this.payment.status] || this.payment.status;
});

// Virtual for customer full name
orderSchema.virtual("customerFullName").get(function () {
  return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number if not provided
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `ORD${timestamp}${random}`;
  }

  // Update status history if status changed
  if (this.isModified("status") && this.statusHistory) {
    this.statusHistory.push({
      status: this.status,
      note: `Order status updated to ${this.status}`,
      updatedAt: new Date(),
    });
  }

  next();
});

// Static method to find orders by customer
orderSchema.statics.findByCustomer = function (customerId) {
  return this.find({ customer: customerId }).sort({ createdAt: -1 });
};

// Instance method to update order status
orderSchema.methods.updateStatus = function (
  newStatus,
  note = "",
  updatedBy = null
) {
  this.status = newStatus;

  // Add to status history
  if (!this.statusHistory) {
    this.statusHistory = [];
  }

  this.statusHistory.push({
    status: newStatus,
    note: note || `Order status updated to ${newStatus}`,
    updatedBy,
    updatedAt: new Date(),
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
  this.tracking = {
    ...this.tracking,
    ...trackingData,
    addedAt: new Date(),
  };

  return this.save();
};

module.exports = mongoose.model("Order", orderSchema);
