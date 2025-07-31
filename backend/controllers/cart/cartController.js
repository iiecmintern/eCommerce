const Cart = require("../../models/cart/Cart");
const Product = require("../../models/product/Product");
const User = require("../../models/user/User");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.getOrCreateCart(userId);

    // Populate product details for each item
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name price originalPrice images vendor store inStock maxQuantity description",
    });

    // Format response
    const formattedItems = populatedCart.items.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.unitPrice,
      originalPrice: item.originalPrice,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      vendor: item.product.vendor || "Unknown Vendor",
      store: item.product.store || "Unknown Store",
      inStock: item.product.inStock,
      maxQuantity: item.product.maxQuantity || 999,
      totalPrice: item.totalPrice,
      discount: item.discount,
      variant: item.variant,
    }));

    res.status(200).json({
      success: true,
      data: {
        items: formattedItems,
        totalItems: populatedCart.totalItems,
        subtotal: populatedCart.subtotal,
        totalDiscount: populatedCart.totalDiscount,
        total: populatedCart.total,
        appliedCoupon: populatedCart.appliedCoupon,
      },
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving cart",
      error: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    const userId = req.user.id;

    // Validate product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // Check quantity limits
    const maxQuantity = product.maxQuantity || 999;
    if (quantity > maxQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum quantity allowed is ${maxQuantity}`,
      });
    }

    // Get or create cart
    let cart = await Cart.getOrCreateCart(userId);

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > maxQuantity) {
        return res.status(400).json({
          success: false,
          message: `Maximum quantity allowed is ${maxQuantity}`,
        });
      }
      await cart.updateItemQuantity(productId, newQuantity);
    } else {
      // Add new item
      await cart.addItem(productId, quantity, variant);
    }

    // Update item prices with current product prices
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name price originalPrice images vendor store inStock maxQuantity",
    });

    // Update prices for all items
    for (let item of updatedCart.items) {
      item.unitPrice = item.product.price;
      item.originalPrice = item.product.originalPrice;
      item.totalPrice = item.unitPrice * item.quantity;
      item.discount = (item.originalPrice || item.unitPrice) - item.unitPrice;
    }

    await updatedCart.save();

    // Format response
    const formattedItems = updatedCart.items.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.unitPrice,
      originalPrice: item.originalPrice,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      vendor: item.product.vendor || "Unknown Vendor",
      store: item.product.store || "Unknown Store",
      inStock: item.product.inStock,
      maxQuantity: item.product.maxQuantity || 999,
      totalPrice: item.totalPrice,
      discount: item.discount,
      variant: item.variant,
    }));

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        items: formattedItems,
        totalItems: updatedCart.totalItems,
        subtotal: updatedCart.subtotal,
        totalDiscount: updatedCart.totalDiscount,
        total: updatedCart.total,
        appliedCoupon: updatedCart.appliedCoupon,
      },
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    // Get cart
    const cart = await Cart.getOrCreateCart(userId);

    // Check if item exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Get product to check stock and limits
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    const maxQuantity = product.maxQuantity || 999;
    if (quantity > maxQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum quantity allowed is ${maxQuantity}`,
      });
    }

    // Update quantity
    await cart.updateItemQuantity(productId, quantity);

    // Get updated cart with populated products
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name price originalPrice images vendor store inStock maxQuantity",
    });

    // Format response
    const formattedItems = updatedCart.items.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.unitPrice,
      originalPrice: item.originalPrice,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      vendor: item.product.vendor || "Unknown Vendor",
      store: item.product.store || "Unknown Store",
      inStock: item.product.inStock,
      maxQuantity: item.product.maxQuantity || 999,
      totalPrice: item.totalPrice,
      discount: item.discount,
      variant: item.variant,
    }));

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: {
        items: formattedItems,
        totalItems: updatedCart.totalItems,
        subtotal: updatedCart.subtotal,
        totalDiscount: updatedCart.totalDiscount,
        total: updatedCart.total,
        appliedCoupon: updatedCart.appliedCoupon,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
      error: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.getOrCreateCart(userId);

    // Check if item exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Remove item
    await cart.removeItem(productId);

    // Get updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name price originalPrice images vendor store inStock maxQuantity",
    });

    // Format response
    const formattedItems = updatedCart.items.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.unitPrice,
      originalPrice: item.originalPrice,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      vendor: item.product.vendor || "Unknown Vendor",
      store: item.product.store || "Unknown Store",
      inStock: item.product.inStock,
      maxQuantity: item.product.maxQuantity || 999,
      totalPrice: item.totalPrice,
      discount: item.discount,
      variant: item.variant,
    }));

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: {
        items: formattedItems,
        totalItems: updatedCart.totalItems,
        subtotal: updatedCart.subtotal,
        totalDiscount: updatedCart.totalDiscount,
        total: updatedCart.total,
        appliedCoupon: updatedCart.appliedCoupon,
      },
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.getOrCreateCart(userId);

    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        items: [],
        totalItems: 0,
        subtotal: 0,
        totalDiscount: 0,
        total: 0,
        appliedCoupon: null,
      },
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const cart = await Cart.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Add items before applying coupon",
      });
    }

    // Mock coupon validation (replace with real coupon system)
    const mockCoupons = {
      SAVE10: { discount: 10, type: "percentage" },
      SAVE20: { discount: 20, type: "percentage" },
      FLAT50: { discount: 50, type: "fixed" },
      WELCOME: { discount: 15, type: "percentage" },
    };

    const coupon = mockCoupons[code.toUpperCase()];

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Calculate discount amount
    const discountAmount =
      coupon.type === "percentage"
        ? (cart.subtotal * coupon.discount) / 100
        : Math.min(coupon.discount, cart.subtotal);

    // Apply coupon
    await cart.applyCoupon(code.toUpperCase(), discountAmount, coupon.type);

    // Get updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name price originalPrice images vendor store inStock maxQuantity",
    });

    // Format response
    const formattedItems = updatedCart.items.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.unitPrice,
      originalPrice: item.originalPrice,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      vendor: item.product.vendor || "Unknown Vendor",
      store: item.product.store || "Unknown Store",
      inStock: item.product.inStock,
      maxQuantity: item.product.maxQuantity || 999,
      totalPrice: item.totalPrice,
      discount: item.discount,
      variant: item.variant,
    }));

    res.status(200).json({
      success: true,
      message: `Coupon applied! ${coupon.discount}${
        coupon.type === "percentage" ? "%" : "₹"
      } off`,
      data: {
        items: formattedItems,
        totalItems: updatedCart.totalItems,
        subtotal: updatedCart.subtotal,
        totalDiscount: updatedCart.totalDiscount,
        total: updatedCart.total,
        appliedCoupon: updatedCart.appliedCoupon,
      },
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({
      success: false,
      message: "Error applying coupon",
      error: error.message,
    });
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.getOrCreateCart(userId);

    if (!cart.appliedCoupon) {
      return res.status(400).json({
        success: false,
        message: "No coupon applied to cart",
      });
    }

    await cart.removeCoupon();

    // Get updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select:
        "name price originalPrice images vendor store inStock maxQuantity",
    });

    // Format response
    const formattedItems = updatedCart.items.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.unitPrice,
      originalPrice: item.originalPrice,
      image: item.product.images?.[0] || "",
      quantity: item.quantity,
      vendor: item.product.vendor || "Unknown Vendor",
      store: item.product.store || "Unknown Store",
      inStock: item.product.inStock,
      maxQuantity: item.product.maxQuantity || 999,
      totalPrice: item.totalPrice,
      discount: item.discount,
      variant: item.variant,
    }));

    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      data: {
        items: formattedItems,
        totalItems: updatedCart.totalItems,
        subtotal: updatedCart.subtotal,
        totalDiscount: updatedCart.totalDiscount,
        total: updatedCart.total,
        appliedCoupon: updatedCart.appliedCoupon,
      },
    });
  } catch (error) {
    console.error("Error removing coupon:", error);
    res.status(500).json({
      success: false,
      message: "Error removing coupon",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
};
