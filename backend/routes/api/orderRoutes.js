const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect, restrictTo } = require("../../middleware/auth/auth");
const {
  createOrder,
  processPayment,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  addTrackingInfo,
  cancelOrder,
  getOrderStats,
} = require("../../controllers/order/orderController");

// Simplified validation middleware for creating order
const validateCreateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.productId").notEmpty().withMessage("Product ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("shippingAddress.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("shippingAddress.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("shippingAddress.email")
    .isEmail()
    .withMessage("Valid email is required"),
  body("shippingAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),
  body("shippingAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),
  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  body("shippingAddress.zipCode")
    .trim()
    .notEmpty()
    .withMessage("ZIP code is required"),
  body("paymentMethod")
    .isIn(["cod", "card", "upi"])
    .withMessage("Invalid payment method"),
  body("subtotal")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be a positive number"),
  body("total")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number"),
];

// Validation middleware for payment processing
const validatePayment = [
  body("paymentMethod")
    .isIn(["cod", "card", "upi"])
    .withMessage("Invalid payment method"),
  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed"])
    .withMessage("Invalid payment status"),
  body("transactionId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Transaction ID cannot be empty"),
];

// Validation middleware for updating order status
const validateUpdateStatus = [
  body("status")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
    ])
    .withMessage("Invalid order status"),
  body("note")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Status note cannot exceed 200 characters"),
];

// Validation middleware for updating payment status
const validateUpdatePayment = [
  body("status")
    .isIn(["pending", "processing", "completed", "failed", "refunded"])
    .withMessage("Invalid payment status"),
  body("transactionId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Transaction ID is required for completed payments"),
  body("gateway")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Payment gateway is required for completed payments"),
  body("refundAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Refund amount must be a positive number"),
  body("refundReason")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Refund reason cannot exceed 200 characters"),
];

// Validation middleware for adding tracking info
const validateTrackingInfo = [
  body("trackingNumber")
    .trim()
    .notEmpty()
    .withMessage("Tracking number is required"),
  body("trackingUrl").optional().isURL().withMessage("Invalid tracking URL"),
  body("carrier")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Carrier name is required"),
];

// Validation middleware for cancelling order
const validateCancelOrder = [
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Cancellation reason cannot exceed 200 characters"),
];

// Public routes (none for orders - all require authentication)

// Protected routes - Customer can create orders and view their own
router.post(
  "/",
  protect,
  restrictTo("customer"),
  validateCreateOrder,
  createOrder
);

// Payment processing route
router.post(
  "/:id/payment",
  protect,
  restrictTo("customer"),
  validatePayment,
  processPayment
);

router.get("/my", protect, restrictTo("customer"), getAllOrders);
router.get("/my/:id", protect, restrictTo("customer"), getOrder);
router.post(
  "/my/:id/cancel",
  protect,
  restrictTo("customer"),
  validateCancelOrder,
  cancelOrder
);

// Protected routes - Vendor can view and manage their orders
router.get("/vendor", protect, restrictTo("vendor"), getAllOrders);
router.get("/vendor/:id", protect, restrictTo("vendor"), getOrder);
router.patch(
  "/vendor/:id/status",
  protect,
  restrictTo("vendor"),
  validateUpdateStatus,
  updateOrderStatus
);
router.patch(
  "/vendor/:id/payment",
  protect,
  restrictTo("vendor"),
  validateUpdatePayment,
  updatePaymentStatus
);
router.patch(
  "/vendor/:id/tracking",
  protect,
  restrictTo("vendor"),
  validateTrackingInfo,
  addTrackingInfo
);
router.post(
  "/vendor/:id/cancel",
  protect,
  restrictTo("vendor"),
  validateCancelOrder,
  cancelOrder
);
router.get("/vendor/stats", protect, restrictTo("vendor"), getOrderStats);

// Protected routes - Admin can view and manage all orders
router.get("/", protect, restrictTo("admin"), getAllOrders);
router.get("/:id", protect, restrictTo("admin"), getOrder);
router.patch(
  "/:id/status",
  protect,
  restrictTo("admin"),
  validateUpdateStatus,
  updateOrderStatus
);
router.patch(
  "/:id/payment",
  protect,
  restrictTo("admin"),
  validateUpdatePayment,
  updatePaymentStatus
);
router.patch(
  "/:id/tracking",
  protect,
  restrictTo("admin"),
  validateTrackingInfo,
  addTrackingInfo
);
router.post(
  "/:id/cancel",
  protect,
  restrictTo("admin"),
  validateCancelOrder,
  cancelOrder
);
router.get("/stats", protect, restrictTo("admin"), getOrderStats);

module.exports = router;
