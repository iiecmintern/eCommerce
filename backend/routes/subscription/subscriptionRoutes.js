const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth/auth");
const {
  getMySubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getExpiringSubscriptions,
} = require("../../controllers/subscription/subscriptionController");

// User routes (protected)
router.get("/me", protect, getMySubscription);
router.post("/", protect, createSubscription);
router.put("/:id", protect, updateSubscription);
router.post("/:id/cancel", protect, cancelSubscription);
router.post("/:id/reactivate", protect, reactivateSubscription);

// Admin routes (protected)
router.get("/", protect, getAllSubscriptions);
router.get("/expiring", protect, getExpiringSubscriptions);
router.get("/:id", protect, getSubscriptionById);

module.exports = router;
