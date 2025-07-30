const Store = require("../../models/store/Store");
const Product = require("../../models/product/Product");
const { validationResult } = require("express-validator");

// @desc    Get all stores (public)
// @route   GET /api/stores
// @access  Public
const getAllStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      verified,
      featured,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {
      status: "active",
      isPublished: true,
    };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Verified filter
    if (verified === "true") {
      query.isVerified = true;
    }

    // Featured filter
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stores = await Store.find(query)
      .populate("owner", "firstName lastName company")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Store.countDocuments(query);

    res.json({
      success: true,
      data: stores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stores",
      error: error.message,
    });
  }
};

// @desc    Get single store by ID or slug
// @route   GET /api/stores/:id
// @access  Public
const getStore = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const query = isObjectId ? { _id: id } : { slug: id };
    query.status = "active";
    query.isPublished = true;

    const store = await Store.findOne(query)
      .populate("owner", "firstName lastName company phone email")
      .select("-__v");

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Get store products count
    const productsCount = await Product.countDocuments({
      store: store._id,
      status: "active",
      isPublished: true,
    });

    const storeData = store.toObject();
    storeData.productsCount = productsCount;

    res.json({
      success: true,
      data: storeData,
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching store",
      error: error.message,
    });
  }
};

// @desc    Get featured stores
// @route   GET /api/stores/featured
// @access  Public
const getFeaturedStores = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const stores = await Store.findFeatured()
      .populate("owner", "firstName lastName company")
      .limit(parseInt(limit))
      .select("-__v");

    res.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error("Error fetching featured stores:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured stores",
      error: error.message,
    });
  }
};

// @desc    Search stores
// @route   GET /api/stores/search
// @access  Public
const searchStores = async (req, res) => {
  try {
    const {
      q,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const query = {
      $text: { $search: q },
      status: "active",
      isPublished: true,
    };

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stores = await Store.find(query)
      .populate("owner", "firstName lastName company")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Store.countDocuments(query);

    res.json({
      success: true,
      data: stores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error searching stores:", error);
    res.status(500).json({
      success: false,
      message: "Error searching stores",
      error: error.message,
    });
  }
};

// @desc    Create new store (vendor only)
// @route   POST /api/stores
// @access  Private (Vendor)
const createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    // Check if vendor already has a store
    const existingStore = await Store.findOne({ owner: req.user.id });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "You already have a store",
      });
    }

    const storeData = {
      ...req.body,
      owner: req.user.id,
    };

    const store = new Store(storeData);
    await store.save();

    const populatedStore = await Store.findById(store._id).populate(
      "owner",
      "firstName lastName company"
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: populatedStore,
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({
      success: false,
      message: "Error creating store",
      error: error.message,
    });
  }
};

// @desc    Update store (vendor only)
// @route   PUT /api/stores/:id
// @access  Private (Vendor)
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Check if user owns this store
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this store",
      });
    }

    const updatedStore = await Store.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("owner", "firstName lastName company");

    res.json({
      success: true,
      message: "Store updated successfully",
      data: updatedStore,
    });
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({
      success: false,
      message: "Error updating store",
      error: error.message,
    });
  }
};

// @desc    Get vendor's store
// @route   GET /api/stores/vendor/my-store
// @access  Private (Vendor)
const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id })
      .populate("owner", "firstName lastName company email phone")
      .select("-__v");

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Get store statistics
    const stats = await store.updateStats();

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error("Error fetching vendor store:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor store",
      error: error.message,
    });
  }
};

// @desc    Update store status (vendor only)
// @route   PATCH /api/stores/:id/status
// @access  Private (Vendor)
const updateStoreStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "active", "suspended", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Check if user owns this store
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this store",
      });
    }

    store.status = status;
    if (status === "active") {
      store.isPublished = true;
    }

    await store.save();

    res.json({
      success: true,
      message: "Store status updated successfully",
      data: store,
    });
  } catch (error) {
    console.error("Error updating store status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating store status",
      error: error.message,
    });
  }
};

// @desc    Get store products
// @route   GET /api/stores/:id/products
// @access  Public
const getStoreProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 12,
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const store = await Store.findById(id);
    if (!store || store.status !== "active" || !store.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const query = {
      store: id,
      status: "active",
      isPublished: true,
    };

    if (category) {
      query.category = category;
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate("vendor", "firstName lastName company")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Product.countDocuments(query);

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
    console.error("Error fetching store products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching store products",
      error: error.message,
    });
  }
};

// @desc    Verify store (admin only)
// @route   PATCH /api/stores/:id/verify
// @access  Private (Admin)
const verifyStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await store.verify(req.user.id);

    res.json({
      success: true,
      message: "Store verified successfully",
      data: store,
    });
  } catch (error) {
    console.error("Error verifying store:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying store",
      error: error.message,
    });
  }
};

// @desc    Get all stores for admin
// @route   GET /api/stores/admin/all
// @access  Private (Admin)
const getAllStoresForAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      verified,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (verified !== undefined) {
      query.isVerified = verified === "true";
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stores = await Store.find(query)
      .populate("owner", "firstName lastName company email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Store.countDocuments(query);

    res.json({
      success: true,
      data: stores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching stores for admin:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stores for admin",
      error: error.message,
    });
  }
};

module.exports = {
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
};
