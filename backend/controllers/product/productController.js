const Product = require("../../models/product/Product");
const Store = require("../../models/store/Store");
const { validationResult } = require("express-validator");

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      vendor,
      featured,
      bestSeller,
    } = req.query;

    // Build query
    const query = {
      status: "active",
      isPublished: true,
    };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Vendor filter
    if (vendor) {
      query.vendor = vendor;
    }

    // Featured filter
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Best seller filter
    if (bestSeller === "true") {
      query.isBestSeller = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let products, total;
    try {
      products = await Product.find(query)
        .populate("vendor", "firstName lastName company")
        .populate("store", "name")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v");

      total = await Product.countDocuments(query);
    } catch (error) {
      console.error("Error executing product query:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching products from database",
      });
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let product;
    try {
      product = await Product.findOne({
        $or: [{ _id: id }, { slug: id }],
        status: "active",
        isPublished: true,
      })
        .populate("vendor", "firstName lastName company")
        .populate("store", "name")
        .select("-__v");
    } catch (error) {
      console.error("Error finding product:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving product from database",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const {
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Build query
    const query = {
      category: category,
      status: "active",
      isPublished: true,
    };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let products, total;
    try {
      products = await Product.find(query)
        .populate("vendor", "firstName lastName company")
        .populate("store", "name")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v");

      total = await Product.countDocuments(query);
    } catch (error) {
      console.error("Error executing category product query:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching products by category",
      });
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching products by category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    let products;
    try {
      products = await Product.find({
        isFeatured: true,
        status: "active",
        isPublished: true,
      })
        .populate("vendor", "firstName lastName company")
        .populate("store", "name")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .select("-__v");
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching featured products",
      });
    }

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching featured products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const {
      q,
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      sortBy = "relevance",
      sortOrder = "desc",
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Build query
    const query = {
      status: "active",
      isPublished: true,
      $text: { $search: q },
    };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sort = {};
    if (sortBy === "relevance") {
      sort = { score: { $meta: "textScore" } };
    } else {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let products, total;
    try {
      products = await Product.find(query)
        .populate("vendor", "firstName lastName company")
        .populate("store", "name")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v");

      total = await Product.countDocuments(query);
    } catch (error) {
      console.error("Error executing search query:", error);
      return res.status(500).json({
        success: false,
        message: "Error searching products",
      });
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while searching products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor)
const createProduct = async (req, res) => {
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

    const productData = {
      ...req.body,
      vendor: req.user.id,
    };

    // Check if vendor has a store
    let store;
    try {
      store = await Store.findOne({ owner: req.user.id });
    } catch (error) {
      console.error("Error finding vendor store:", error);
      return res.status(500).json({
        success: false,
        message: "Error verifying vendor store",
      });
    }

    if (!store) {
      return res.status(400).json({
        success: false,
        message: "You must create a store before adding products",
      });
    }

    productData.store = store._id;

    let product;
    try {
      product = await Product.create(productData);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error creating product",
      });
    }

    // Populate vendor and store info
    try {
      await product.populate("vendor", "firstName lastName company");
      await product.populate("store", "name");
    } catch (error) {
      console.error("Error populating product:", error);
      // Don't fail the creation for this error
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    let product;
    try {
      product = await Product.findById(id);
    } catch (error) {
      console.error("Error finding product for update:", error);
      return res.status(500).json({
        success: false,
        message: "Error finding product",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Update product
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate("vendor", "firstName lastName company")
        .populate("store", "name");

      res.json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating product",
      });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let product;
    try {
      product = await Product.findById(id);
    } catch (error) {
      console.error("Error finding product for deletion:", error);
      return res.status(500).json({
        success: false,
        message: "Error finding product",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Delete product
    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting product",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get vendor's products
// @route   GET /api/products/my-products
// @access  Private (Vendor)
const getMyProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {
      vendor: req.user.id,
    };

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let products, total;
    try {
      products = await Product.find(query)
        .populate("store", "name")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v");

      total = await Product.countDocuments(query);
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching your products",
      });
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching vendor products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update product status
// @route   PATCH /api/products/:id/status
// @access  Private (Vendor)
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!status || !["draft", "published", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (draft, published, archived)",
      });
    }

    let product;
    try {
      product = await Product.findById(id);
    } catch (error) {
      console.error("Error finding product for status update:", error);
      return res.status(500).json({
        success: false,
        message: "Error finding product",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Update status
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("vendor", "firstName lastName company")
        .populate("store", "name");

      res.json({
        success: true,
        message: "Product status updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating product status",
      });
    }
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating product status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private (Vendor)
const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (stockQuantity === undefined || stockQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid stock quantity is required (>= 0)",
      });
    }

    let product;
    try {
      product = await Product.findById(id);
    } catch (error) {
      console.error("Error finding product for stock update:", error);
      return res.status(500).json({
        success: false,
        message: "Error finding product",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Update stock
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { stockQuantity },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("vendor", "firstName lastName company")
        .populate("store", "name");

      res.json({
        success: true,
        message: "Product stock updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating product stock",
      });
    }
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating product stock",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", {
      status: "active",
      isPublished: true,
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

// ===== VARIANT MANAGEMENT ENDPOINTS =====

// @desc    Get product variants
// @route   GET /api/products/:id/variants
// @access  Public
const getProductVariants = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("vendor", "firstName lastName company")
      .populate("store", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: {
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          hasVariants: product.hasVariants,
          variantTypes: product.variantTypes,
          variantOptions: product.variantOptions,
          variantPriceRange: product.variantPriceRange,
        },
        variants: product.availableVariants,
      },
    });
  } catch (error) {
    console.error("Error fetching product variants:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product variants",
    });
  }
};

// @desc    Add variant to product
// @route   POST /api/products/:id/variants
// @access  Private (Vendor)
const addProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variantData = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this product",
      });
    }

    // Validate variant data
    if (!variantData.options || !Array.isArray(variantData.options)) {
      return res.status(400).json({
        success: false,
        message: "Variant options are required",
      });
    }

    // Check if variant already exists
    const combination = variantData.options.map((opt) => opt.value).join("-");
    const existingVariant = product.findVariant(combination);
    if (existingVariant) {
      return res.status(400).json({
        success: false,
        message: "Variant combination already exists",
      });
    }

    // Add variant
    await product.addVariant(variantData);

    // Populate and return updated product
    await product.populate("vendor", "firstName lastName company");
    await product.populate("store", "name");

    res.status(201).json({
      success: true,
      message: "Variant added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error adding product variant:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product variant",
    });
  }
};

// @desc    Update product variant
// @route   PUT /api/products/:id/variants/:combination
// @access  Private (Vendor)
const updateProductVariant = async (req, res) => {
  try {
    const { id, combination } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this product",
      });
    }

    // Check if variant exists
    const existingVariant = product.findVariant(combination);
    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    // Update variant
    await product.updateVariant(combination, updateData);

    // Populate and return updated product
    await product.populate("vendor", "firstName lastName company");
    await product.populate("store", "name");

    res.json({
      success: true,
      message: "Variant updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product variant:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product variant",
    });
  }
};

// @desc    Delete product variant
// @route   DELETE /api/products/:id/variants/:combination
// @access  Private (Vendor)
const deleteProductVariant = async (req, res) => {
  try {
    const { id, combination } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this product",
      });
    }

    // Check if variant exists
    const existingVariant = product.findVariant(combination);
    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    // Remove variant
    await product.removeVariant(combination);

    // Populate and return updated product
    await product.populate("vendor", "firstName lastName company");
    await product.populate("store", "name");

    res.json({
      success: true,
      message: "Variant deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error deleting product variant:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product variant",
    });
  }
};

// @desc    Update variant stock
// @route   PATCH /api/products/:id/variants/:combination/stock
// @access  Private (Vendor)
const updateVariantStock = async (req, res) => {
  try {
    const { id, combination } = req.params;
    const { quantity, operation = "decrease" } = req.body;

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this product",
      });
    }

    // Update variant stock
    await product.updateVariantStock(combination, quantity, operation);

    // Populate and return updated product
    await product.populate("vendor", "firstName lastName company");
    await product.populate("store", "name");

    res.json({
      success: true,
      message: "Variant stock updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating variant stock:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating variant stock",
    });
  }
};

// @desc    Bulk update variants
// @route   PUT /api/products/:id/variants/bulk
// @access  Private (Vendor)
const bulkUpdateVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { variants } = req.body;

    if (!variants || !Array.isArray(variants)) {
      return res.status(400).json({
        success: false,
        message: "Variants array is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this product",
      });
    }

    // Update variants
    for (const variantData of variants) {
      const { combination, ...updateData } = variantData;
      if (combination) {
        await product.updateVariant(combination, updateData);
      }
    }

    // Populate and return updated product
    await product.populate("vendor", "firstName lastName company");
    await product.populate("store", "name");

    res.json({
      success: true,
      message: "Variants updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error bulk updating variants:", error);
    res.status(500).json({
      success: false,
      message: "Error updating variants",
    });
  }
};

module.exports = {
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
};
