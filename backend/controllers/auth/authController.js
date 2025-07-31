const User = require("../../models/user/User");
const {
  generateToken,
  generateRandomToken,
  hashToken,
} = require("../../utils/auth");
const { validationResult } = require("express-validator");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      password,
      role,
      agreeToTerms,
      agreeToMarketing,
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user already exists
    try {
      const existingUser = await User.emailExists(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
      return res.status(500).json({
        success: false,
        message: "Error checking user existence",
      });
    }

    // Create new user
    let user;
    try {
      user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        company,
        password,
        role: role || "customer",
        agreeToTerms,
        agreeToMarketing,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error creating user account",
      });
    }

    // Generate JWT token
    let token;
    try {
      token = generateToken(user._id, user.role);
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({
        success: false,
        message: "Error generating authentication token",
      });
    }

    // Update last login
    try {
      user.lastLogin = new Date();
      await user.save();
    } catch (error) {
      console.error("Error updating last login:", error);
      // Don't fail the registration for this error
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          company: user.company,
          phone: user.phone,
          profilePicture: user.profilePicture,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists and password is correct
    let user;
    try {
      user = await User.findOne({ email }).select("+password");
    } catch (error) {
      console.error("Error finding user:", error);
      return res.status(500).json({
        success: false,
        message: "Error finding user account",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password is correct
    let isPasswordCorrect;
    try {
      isPasswordCorrect = await user.correctPassword(password, user.password);
    } catch (error) {
      console.error("Error comparing password:", error);
      return res.status(500).json({
        success: false,
        message: "Error verifying password",
      });
    }

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    let token;
    try {
      token = generateToken(user._id, user.role);
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({
        success: false,
        message: "Error generating authentication token",
      });
    }

    // Update last login
    try {
      user.lastLogin = new Date();
      await user.save();
    } catch (error) {
      console.error("Error updating last login:", error);
      // Don't fail the login for this error
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          company: user.company,
          phone: user.phone,
          profilePicture: user.profilePicture,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    let user;
    try {
      user = await User.findById(req.user.id);
    } catch (error) {
      console.error("Error finding user:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving user data",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          company: user.company,
          phone: user.phone,
          profilePicture: user.profilePicture,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success response
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user;
    try {
      user = await User.findOne({ email });
    } catch (error) {
      console.error("Error finding user for password reset:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing password reset request",
      });
    }

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent",
      });
    }

    // Generate reset token
    let resetToken;
    try {
      resetToken = generateRandomToken();
    } catch (error) {
      console.error("Error generating reset token:", error);
      return res.status(500).json({
        success: false,
        message: "Error generating password reset token",
      });
    }

    // Hash token and save to user
    try {
      user.passwordResetToken = hashToken(resetToken);
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
    } catch (error) {
      console.error("Error saving reset token:", error);
      return res.status(500).json({
        success: false,
        message: "Error saving password reset token",
      });
    }

    // TODO: Send email with reset token
    console.log("Password reset token:", resetToken);

    res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during password reset",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Hash the token to compare with stored hash
    let hashedToken;
    try {
      hashedToken = hashToken(token);
    } catch (error) {
      console.error("Error hashing reset token:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing reset token",
      });
    }

    // Find user with valid reset token
    let user;
    try {
      user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    } catch (error) {
      console.error("Error finding user with reset token:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing password reset",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password and clear reset token
    try {
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during password reset",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
