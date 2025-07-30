const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect, restrictTo } = require("../../middleware/auth/auth");
const {
  getAllStores,
  getStore,
  getFeaturedStores,
  searchStores,
  createStore,
  updateStore,
  getMyStore,
  updateStoreStatus,
  getStoreProducts,
  verifyStore,
  getAllStoresForAdmin,
} = require("../../controllers/store/storeController");

// Validation middleware
const validateStore = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Store name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Store description cannot exceed 1000 characters"),
  body("tagline")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Tagline cannot exceed 200 characters"),
  body("contact.email").isEmail().withMessage("Valid email is required"),
  body("contact.phone")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Valid Indian phone number is required"),
  body("contact.address.street")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),
  body("contact.address.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("contact.address.state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  body("contact.address.pincode")
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Valid Indian pincode is required"),
  body("business.type")
    .optional()
    .isIn([
      "Individual",
      "Partnership",
      "Private Limited",
      "Public Limited",
      "LLP",
      "Other",
    ])
    .withMessage("Invalid business type"),
  body("business.gstNumber")
    .optional()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage("Valid GST number is required"),
  body("business.panNumber")
    .optional()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage("Valid PAN number is required"),
  body("settings.currency")
    .optional()
    .isIn(["INR", "USD", "EUR", "GBP"])
    .withMessage("Invalid currency"),
  body("settings.language")
    .optional()
    .isIn(["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa"])
    .withMessage("Invalid language"),
  body("payment.acceptedMethods")
    .optional()
    .isArray()
    .withMessage("Accepted payment methods must be an array"),
  body("payment.acceptedMethods.*")
    .optional()
    .isIn(["cod", "online", "upi", "card", "netbanking", "wallet"])
    .withMessage("Invalid payment method"),
  body("shipping.freeShippingThreshold")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Free shipping threshold must be a positive number"),
  body("shipping.defaultShippingCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Default shipping cost must be a positive number"),
  body("shipping.processingTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Processing time must be a non-negative integer"),
  body("seo.metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters"),
  body("seo.metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),
  body("social.website")
    .optional()
    .isURL()
    .withMessage("Valid website URL is required"),
  body("social.facebook")
    .optional()
    .isURL()
    .withMessage("Valid Facebook URL is required"),
  body("social.instagram")
    .optional()
    .isURL()
    .withMessage("Valid Instagram URL is required"),
  body("social.twitter")
    .optional()
    .isURL()
    .withMessage("Valid Twitter URL is required"),
  body("social.youtube")
    .optional()
    .isURL()
    .withMessage("Valid YouTube URL is required"),
  body("social.linkedin")
    .optional()
    .isURL()
    .withMessage("Valid LinkedIn URL is required"),
];

const validateStoreUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Store name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Store description cannot exceed 1000 characters"),
  body("tagline")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Tagline cannot exceed 200 characters"),
  body("contact.email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required"),
  body("contact.phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Valid Indian phone number is required"),
  body("business.gstNumber")
    .optional()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage("Valid GST number is required"),
  body("business.panNumber")
    .optional()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage("Valid PAN number is required"),
  body("settings.currency")
    .optional()
    .isIn(["INR", "USD", "EUR", "GBP"])
    .withMessage("Invalid currency"),
  body("payment.acceptedMethods")
    .optional()
    .isArray()
    .withMessage("Accepted payment methods must be an array"),
  body("payment.acceptedMethods.*")
    .optional()
    .isIn(["cod", "online", "upi", "card", "netbanking", "wallet"])
    .withMessage("Invalid payment method"),
  body("shipping.freeShippingThreshold")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Free shipping threshold must be a positive number"),
  body("shipping.defaultShippingCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Default shipping cost must be a positive number"),
  body("seo.metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters"),
  body("seo.metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),
];

const validateStatusUpdate = [
  body("status")
    .isIn(["pending", "active", "suspended", "closed"])
    .withMessage("Invalid status"),
];

// Public routes
router.get("/", getAllStores);
router.get("/featured", getFeaturedStores);
router.get("/search", searchStores);
router.get("/:id", getStore);
router.get("/:id/products", getStoreProducts);

// Protected routes (Vendor and Admin)
router.use(protect);
router.use(restrictTo("vendor", "admin"));

// Vendor store management
router.get("/vendor/my-store", getMyStore);
router.post("/", validateStore, createStore);
router.put("/:id", validateStoreUpdate, updateStore);
router.patch("/:id/status", validateStatusUpdate, updateStoreStatus);

// Protected routes (Admin only)
router.use(restrictTo("admin"));

// Admin store management
router.get("/admin/all", getAllStoresForAdmin);
router.patch("/:id/verify", verifyStore);

module.exports = router;
