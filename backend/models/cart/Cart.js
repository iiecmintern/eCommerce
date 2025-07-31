const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    max: [999, "Quantity cannot exceed 999"],
  },
  variant: {
    name: String,
    value: String,
    sku: String,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, "Unit price cannot be negative"],
  },
  originalPrice: {
    type: Number,
    min: [0, "Original price cannot be negative"],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, "Total price cannot be negative"],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    appliedCoupon: {
      code: {
        type: String,
        trim: true,
      },
      discount: {
        type: Number,
        default: 0,
        min: [0, "Coupon discount cannot be negative"],
      },
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, "Subtotal cannot be negative"],
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: [0, "Total discount cannot be negative"],
    },
    total: {
      type: Number,
      default: 0,
      min: [0, "Total cannot be negative"],
    },
    lastUpdated: {
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

// Virtual for total items count
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Pre-save middleware to calculate totals
cartSchema.pre("save", function (next) {
  this.lastUpdated = new Date();

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  // Calculate total discount from items
  const itemDiscounts = this.items.reduce((sum, item) => {
    const itemDiscount =
      (item.originalPrice || item.unitPrice) - item.unitPrice;
    return sum + itemDiscount * item.quantity;
  }, 0);

  // Add coupon discount
  this.totalDiscount = itemDiscounts + (this.appliedCoupon?.discount || 0);

  // Calculate final total
  this.total = this.subtotal - (this.appliedCoupon?.discount || 0);

  next();
});

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function (userId) {
  try {
    let cart = await this.findOne({ user: userId }).populate({
      path: "items.product",
      select:
        "name price originalPrice images vendor store inStock maxQuantity",
    });

    if (!cart) {
      cart = new this({
        user: userId,
        items: [],
        subtotal: 0,
        totalDiscount: 0,
        total: 0,
      });
      await cart.save();
    }

    return cart;
  } catch (error) {
    throw new Error(`Error getting or creating cart: ${error.message}`);
  }
};

// Instance method to add item to cart
cartSchema.methods.addItem = async function (
  productId,
  quantity = 1,
  variant = null
) {
  try {
    const existingItemIndex = this.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      this.items[existingItemIndex].quantity += quantity;
      this.items[existingItemIndex].updatedAt = new Date();
    } else {
      // Add new item
      this.items.push({
        product: productId,
        quantity,
        variant,
        unitPrice: 0, // Will be populated when saving
        totalPrice: 0, // Will be calculated
        addedAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Error adding item to cart: ${error.message}`);
  }
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
  try {
    const itemIndex = this.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      this.items[itemIndex].quantity = quantity;
      this.items[itemIndex].updatedAt = new Date();
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Error updating item quantity: ${error.message}`);
  }
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  try {
    this.items = this.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Error removing item from cart: ${error.message}`);
  }
};

// Instance method to clear cart
cartSchema.methods.clearCart = async function () {
  try {
    this.items = [];
    this.appliedCoupon = null;
    this.subtotal = 0;
    this.totalDiscount = 0;
    this.total = 0;
    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Error clearing cart: ${error.message}`);
  }
};

// Instance method to apply coupon
cartSchema.methods.applyCoupon = async function (
  couponCode,
  discount,
  discountType = "percentage"
) {
  try {
    this.appliedCoupon = {
      code: couponCode,
      discount,
      discountType,
      appliedAt: new Date(),
    };
    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Error applying coupon: ${error.message}`);
  }
};

// Instance method to remove coupon
cartSchema.methods.removeCoupon = async function () {
  try {
    this.appliedCoupon = null;
    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Error removing coupon: ${error.message}`);
  }
};

module.exports = mongoose.model("Cart", cartSchema);
