const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../../middleware/auth/auth");
const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} = require("../../controllers/cart/cartController");

// Validation middleware for adding item to cart
const validateAddItem = [
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("quantity")
    .optional()
    .isInt({ min: 1, max: 999 })
    .withMessage("Quantity must be between 1 and 999"),
  body("variant")
    .optional()
    .isObject()
    .withMessage("Variant must be an object"),
];

// Validation middleware for updating item quantity
const validateUpdateQuantity = [
  body("quantity")
    .isInt({ min: 0, max: 999 })
    .withMessage("Quantity must be between 0 and 999"),
];

// Validation middleware for applying coupon
const validateCoupon = [
  body("code")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "Coupon code is required and must be between 1 and 50 characters"
    ),
];

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", protect, getCart);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post("/items", protect, validateAddItem, addItemToCart);

// @route   PUT /api/cart/items/:productId
// @desc    Update item quantity in cart
// @access  Private
router.put(
  "/items/:productId",
  protect,
  validateUpdateQuantity,
  updateItemQuantity
);

// @route   DELETE /api/cart/items/:productId
// @desc    Remove item from cart
// @access  Private
router.delete("/items/:productId", protect, removeItemFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete("/", protect, clearCart);

// @route   POST /api/cart/coupon
// @desc    Apply coupon to cart
// @access  Private
router.post("/coupon", protect, validateCoupon, applyCoupon);

// @route   DELETE /api/cart/coupon
// @desc    Remove coupon from cart
// @access  Private
router.delete("/coupon", protect, removeCoupon);

module.exports = router;
