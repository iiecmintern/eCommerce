const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  logout, 
  forgotPassword, 
  resetPassword 
} = require('../../controllers/auth/authController');
const { protect } = require('../../middleware/auth/auth');
const { 
  registerValidation, 
  loginValidation, 
  forgotPasswordValidation, 
  resetPasswordValidation 
} = require('../../utils/validation');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router; 