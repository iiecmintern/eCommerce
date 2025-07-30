const User = require("../../models/user/User");
const { catchAsync } = require("../../utils/helpers");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Get user profile
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: "Profile retrieved successfully",
    data: user,
  });
});

// Update user profile
const updateProfile = catchAsync(async (req, res) => {
  const { firstName, lastName, phone, company } = req.body;

  // Validate required fields
  if (!firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: "First name and last name are required",
    });
  }

  // Update user profile
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      phone,
      company,
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

// Change password
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  // Validate new password length
  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters long",
    });
  }

  // Validate new password complexity (same as registration)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // Update password (let the model's pre-save middleware handle hashing)
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});

// Upload profile picture
const uploadProfilePicture = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file provided",
    });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Delete old profile picture if it exists
  if (user.profilePicture) {
    const oldImagePath = path.join(
      __dirname,
      "../../uploads/avatars",
      path.basename(user.profilePicture)
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  // Update user with new profile picture path
  const imageUrl = `/uploads/avatars/${req.file.filename}`;
  user.profilePicture = imageUrl;
  await user.save();

  res.json({
    success: true,
    message: "Profile picture uploaded successfully",
    data: {
      profilePicture: imageUrl,
    },
  });
});

// Delete profile picture
const deleteProfilePicture = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!user.profilePicture) {
    return res.status(400).json({
      success: false,
      message: "No profile picture to delete",
    });
  }

  // Delete file from filesystem
  const imagePath = path.join(
    __dirname,
    "../../uploads/avatars",
    path.basename(user.profilePicture)
  );
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  // Remove profile picture from user
  user.profilePicture = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Profile picture deleted successfully",
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
};
