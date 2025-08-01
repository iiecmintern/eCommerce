const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/notification/notificationController");
const { protect, restrictTo } = require("../../middleware/auth/auth");
const { body } = require("express-validator");

// Validation middleware
const validateOrderStatusUpdate = [
  body("newStatus")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage("Invalid order status"),
  body("trackingNumber")
    .optional()
    .isString()
    .withMessage("Tracking number must be a string"),
];

const validateBulkNotification = [
  body("subject")
    .isString()
    .isLength({ min: 1, max: 200 })
    .withMessage("Subject is required and must be between 1-200 characters"),
  body("templateName")
    .isString()
    .isIn([
      "orderConfirmation",
      "passwordReset",
      "orderStatusUpdate",
      "welcomeEmail",
    ])
    .withMessage("Invalid template name"),
  body("data").isObject().withMessage("Data must be an object"),
  body("userIds")
    .isArray({ min: 1 })
    .withMessage("User IDs must be an array with at least one user"),
];

// Public routes
router.post("/test", notificationController.testEmailService);

// Protected routes
router.post(
  "/password-reset",
  body("email").isEmail().withMessage("Valid email is required"),
  notificationController.sendPasswordReset
);

// Order-related notifications (vendor/admin only)
router.post(
  "/orders/:orderId/confirmation",
  protect,
  restrictTo("vendor", "admin"),
  notificationController.sendOrderConfirmation
);

router.post(
  "/orders/:orderId/status-update",
  protect,
  restrictTo("vendor", "admin"),
  validateOrderStatusUpdate,
  notificationController.sendOrderStatusUpdate
);

// User management notifications (admin only)
router.post(
  "/users/:userId/welcome",
  protect,
  restrictTo("admin"),
  notificationController.sendWelcomeEmail
);

// Bulk notifications (admin only)
router.post(
  "/bulk",
  protect,
  restrictTo("admin"),
  validateBulkNotification,
  notificationController.sendBulkNotification
);

module.exports = router;
