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
  // Variant management
  getProductVariants,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  updateVariantStock,
  bulkUpdateVariants,
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

// Variant validation middleware
const validateVariant = [
  body("options")
    .isArray({ min: 1 })
    .withMessage("At least one variant option is required"),
  body("options.*.type")
    .isIn(["color", "size", "material", "storage", "style", "other"])
    .withMessage("Invalid variant type"),
  body("options.*.name")
    .trim()
    .notEmpty()
    .withMessage("Variant option name is required"),
  body("options.*.value")
    .trim()
    .notEmpty()
    .withMessage("Variant option value is required"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Variant price must be a positive number"),
  body("compareAtPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Variant compare price must be a positive number"),
  body("costPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Variant cost price must be a positive number"),
  body("stockQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Variant stock quantity must be a non-negative integer"),
  body("lowStockThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Low stock threshold must be a non-negative integer"),
  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Variant SKU must be between 3 and 50 characters"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Variant images must be an array"),
  body("images.*.url")
    .optional()
    .isURL()
    .withMessage("Invalid variant image URL"),
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Variant weight must be a positive number"),
];

const validateVariantUpdate = [
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Variant price must be a positive number"),
  body("compareAtPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Variant compare price must be a positive number"),
  body("costPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Variant cost price must be a positive number"),
  body("stockQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Variant stock quantity must be a non-negative integer"),
  body("lowStockThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Low stock threshold must be a non-negative integer"),
  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Variant SKU must be between 3 and 50 characters"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const validateVariantStockUpdate = [
  body("quantity")
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a positive number"),
  body("operation")
    .optional()
    .isIn(["increase", "decrease"])
    .withMessage("Operation must be 'increase' or 'decrease'"),
];

const validateBulkVariantUpdate = [
  body("variants")
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),
  body("variants.*.combination")
    .trim()
    .notEmpty()
    .withMessage("Variant combination is required"),
];

// Public routes
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProduct);
router.get("/:id/variants", getProductVariants);

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

// Variant management routes
router.post("/:id/variants", validateVariant, addProductVariant);
router.put(
  "/:id/variants/:combination",
  validateVariantUpdate,
  updateProductVariant
);
router.delete("/:id/variants/:combination", deleteProductVariant);
router.patch(
  "/:id/variants/:combination/stock",
  validateVariantStockUpdate,
  updateVariantStock
);
router.put("/:id/variants/bulk", validateBulkVariantUpdate, bulkUpdateVariants);

module.exports = router;
