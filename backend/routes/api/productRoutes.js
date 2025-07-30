const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect, restrictTo } = require("../../middleware/auth/auth");
const {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  updateProductStatus,
  updateProductStock,
  getCategories,
} = require("../../controllers/product/productController");

// Validation middleware
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Product name must be between 3 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),
  body("category")
    .isIn([
      "Electronics",
      "Fashion",
      "Home & Kitchen",
      "Books",
      "Sports & Outdoors",
      "Health & Beauty",
      "Toys & Games",
      "Food & Beverage",
      "Art & Crafts",
      "Automotive",
      "Business & Industrial",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stockQuantity")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
  body("gstRate")
    .optional()
    .isFloat({ min: 0, max: 28 })
    .withMessage("GST rate must be between 0 and 28"),
  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*.url").optional().isURL().withMessage("Invalid image URL"),
  body("specifications")
    .optional()
    .isArray()
    .withMessage("Specifications must be an array"),
  body("specifications.*.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Specification name is required"),
  body("specifications.*.value")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Specification value is required"),
];

const validateProductUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Product name must be between 3 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),
  body("category")
    .optional()
    .isIn([
      "Electronics",
      "Fashion",
      "Home & Kitchen",
      "Books",
      "Sports & Outdoors",
      "Health & Beauty",
      "Toys & Games",
      "Food & Beverage",
      "Art & Crafts",
      "Automotive",
      "Business & Industrial",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stockQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
  body("gstRate")
    .optional()
    .isFloat({ min: 0, max: 28 })
    .withMessage("GST rate must be between 0 and 28"),
];

const validateStatusUpdate = [
  body("status")
    .isIn(["draft", "active", "inactive", "archived"])
    .withMessage("Invalid status"),
];

const validateStockUpdate = [
  body("stockQuantity")
    .isFloat({ min: 0 })
    .withMessage("Stock quantity must be a non-negative number"),
  body("operation")
    .optional()
    .isIn(["set", "increase", "decrease"])
    .withMessage("Invalid operation"),
];

// Public routes
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProduct);

// Protected routes (Vendor and Admin)
router.use(protect);
router.use(restrictTo("vendor", "admin"));

// Vendor product management
router.get("/vendor/my-products", getMyProducts);
router.post("/", validateProduct, createProduct);
router.put("/:id", validateProductUpdate, updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/status", validateStatusUpdate, updateProductStatus);
router.patch("/:id/stock", validateStockUpdate, updateProductStock);

module.exports = router;
