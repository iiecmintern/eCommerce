const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth/auth");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../../controllers/auth/profileController");

// Apply authentication middleware to all profile routes
router.use(protect);

// Get user profile
router.get("/", getProfile);

// Update user profile
router.put("/", updateProfile);

// Change password
router.put("/password", changePassword);

module.exports = router;
