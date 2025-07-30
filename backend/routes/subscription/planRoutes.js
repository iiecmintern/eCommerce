const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth/auth");
const {
  getPlans,
  getPlanById,
  getPlanByType,
  createPlan,
  updatePlan,
  deletePlan,
  comparePlans,
} = require("../../controllers/subscription/planController");

// Public routes
router.get("/", getPlans);
router.get("/compare", comparePlans);
router.get("/type/:type", getPlanByType);
router.get("/:id", getPlanById);

// Protected routes (Admin only)
router.post("/", protect, createPlan);
router.put("/:id", protect, updatePlan);
router.delete("/:id", protect, deletePlan);

module.exports = router;
