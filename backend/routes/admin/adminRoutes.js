const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../../middleware/auth/auth");
const {
  getAdminStats,
  getRecentStores,
  getRecentActivities,
  getSystemHealth,
  getAnalytics,
  exportReport,
  getAllStores,
  getAllUsers,
  updateStoreStatus,
  updateUserStatus,
} = require("../../controllers/admin/adminController");

// All routes require authentication and admin role
router.use(protect);
router.use(restrictTo("admin"));

// Dashboard data endpoints
router.get("/stats", getAdminStats);
router.get("/stores/recent", getRecentStores);
router.get("/activities", getRecentActivities);
router.get("/system/health", getSystemHealth);
router.get("/analytics", getAnalytics);

// Report export
router.post("/reports/export", exportReport);

// Store management
router.get("/stores", getAllStores);
router.put("/stores/:storeId/status", updateStoreStatus);

// User management
router.get("/users", getAllUsers);
router.put("/users/:userId/status", updateUserStatus);

module.exports = router; 