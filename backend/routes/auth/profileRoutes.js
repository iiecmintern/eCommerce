const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth/auth");
const { uploadAvatar, handleUploadError } = require("../../middleware/upload");
const { changePasswordValidation } = require("../../utils/validation");
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
} = require("../../controllers/auth/profileController");

// Apply authentication middleware to all profile routes
router.use(protect);

// Get user profile
router.get("/", getProfile);

// Update user profile
router.put("/", updateProfile);

// Change password
router.put("/password", changePasswordValidation, changePassword);

// Upload profile picture
router.post(
  "/picture",
  uploadAvatar.single("profilePicture"),
  handleUploadError,
  uploadProfilePicture
);

// Delete profile picture
router.delete("/picture", deleteProfilePicture);

module.exports = router;
