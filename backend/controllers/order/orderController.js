const Order = require("../../models/order/Order");
const Product = require("../../models/product/Product");
const Store = require("../../models/store/Store");
const User = require("../../models/user/User");
const { validationResult } = require("express-validator");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      appliedCoupon,
      notes,
      orderType = "retail",
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Group items by store/vendor
    const storeGroups = {};
    for (const item of items) {
      const product = await Product.findById(item.productId)
        .populate("store")
        .populate("vendor");

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      if (product.status !== "active" || !product.isPublished) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available for purchase`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}`,
        });
      }

      const storeId = product.store._id.toString();
      if (!storeGroups[storeId]) {
        storeGroups[storeId] = {
          store: product.store,
          vendor: product.vendor,
          items: [],
        };
      }

      storeGroups[storeId].items.push({
        product: product._id,
        variant: item.variant || {},
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: product.price * item.quantity,
        gstRate: product.gstRate || 18,
        gstAmount:
          (product.price * item.quantity * (product.gstRate || 18)) / 100,
        discount: 0,
      });
    }

    // Create orders for each store
    const createdOrders = [];

    for (const [storeId, group] of Object.entries(storeGroups)) {
      // Calculate totals
      let subtotal = 0;
      let tax = 0;
      let discount = 0;

      group.items.forEach((item) => {
        subtotal += item.totalPrice;
        tax += item.gstAmount;
        discount += item.discount;
      });

      // Calculate shipping cost (basic logic - can be enhanced)
      const shippingCost = subtotal > 50000 ? 0 : 199; // Free shipping above 50k

      // Calculate coupon discount
      let couponDiscount = 0;
      if (appliedCoupon && appliedCoupon.code) {
        // Basic coupon logic - can be enhanced
        if (appliedCoupon.discountType === "percentage") {
          couponDiscount = (subtotal * appliedCoupon.discount) / 100;
        } else {
          couponDiscount = appliedCoupon.discount;
        }
      }

      const total = subtotal + tax + shippingCost - discount - couponDiscount;

      // Create order
      const orderData = {
        orderType,
        customer: req.user._id,
        store: group.store._id,
        vendor: group.vendor._id,
        items: group.items,
        pricing: {
          subtotal,
          tax,
          shipping: shippingCost,
          discount,
          couponDiscount,
          total,
          currency: group.store.settings?.currency || "INR",
        },
        appliedCoupon: appliedCoupon || {},
        shipping: {
          address: shippingAddress,
          method: "standard",
          cost: shippingCost,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        billing: {
          address: billingAddress || shippingAddress,
        },
        payment: {
          method: paymentMethod,
          status: "pending",
          amount: total,
        },
        notes: {
          customer: notes?.customer || "",
        },
      };

      const order = new Order(orderData);
      await order.save();

      // Update product stock
      for (const item of group.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        });
      }

      // Populate references for response
      await order.populate([
        { path: "store", select: "name" },
        { path: "vendor", select: "firstName lastName" },
        { path: "items.product", select: "name images price" },
      ]);

      createdOrders.push(order);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: createdOrders.length === 1 ? createdOrders[0] : createdOrders,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// @desc    Get all orders (with filters)
// @route   GET /api/orders
// @access  Private (Admin, Vendor)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      orderType,
      store,
      vendor,
      customer,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query based on user role
    const query = {};

    if (req.user.role === "vendor") {
      query.vendor = req.user._id;
    } else if (req.user.role === "admin") {
      // Admin can see all orders
    } else {
      // Customer can only see their own orders
      query.customer = req.user._id;
    }

    // Apply filters
    if (status) query.status = status;
    if (paymentStatus) query["payment.status"] = paymentStatus;
    if (orderType) query.orderType = orderType;
    if (store) query.store = store;
    if (vendor) query.vendor = vendor;
    if (customer) query.customer = customer;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate("customer", "firstName lastName email")
      .populate("vendor", "firstName lastName")
      .populate("store", "name")
      .populate("items.product", "name images price")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "firstName lastName email phone")
      .populate("vendor", "firstName lastName email")
      .populate("store", "name contact")
      .populate("items.product", "name images price sku")
      .populate("statusHistory.updatedBy", "firstName lastName");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user has permission to view this order
    if (
      req.user.role === "customer" &&
      order.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this order",
      });
    }

    if (
      req.user.role === "vendor" &&
      order.vendor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin, Vendor)
const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check permissions
    if (
      req.user.role === "vendor" &&
      order.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this order",
      });
    }

    // Update order status
    await order.updateStatus(status, note, req.user._id);

    // Populate references for response
    await order.populate([
      { path: "customer", select: "firstName lastName email" },
      { path: "vendor", select: "firstName lastName" },
      { path: "store", select: "name" },
      { path: "items.product", select: "name images price" },
    ]);

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// @desc    Update payment status
// @route   PATCH /api/orders/:id/payment
// @access  Private (Admin, Vendor)
const updatePaymentStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { status, transactionId, gateway, refundAmount, refundReason } =
      req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check permissions
    if (
      req.user.role === "vendor" &&
      order.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this order",
      });
    }

    // Update payment information
    order.payment.status = status;
    if (transactionId) order.payment.transactionId = transactionId;
    if (gateway) order.payment.gateway = gateway;
    if (status === "completed") {
      order.payment.paidAt = new Date();
    }
    if (status === "refunded") {
      order.payment.refundAmount = refundAmount || order.payment.amount;
      order.payment.refundReason = refundReason;
      order.payment.refundedAt = new Date();
    }

    await order.save();

    // Populate references for response
    await order.populate([
      { path: "customer", select: "firstName lastName email" },
      { path: "vendor", select: "firstName lastName" },
      { path: "store", select: "name" },
      { path: "items.product", select: "name images price" },
    ]);

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating payment status",
      error: error.message,
    });
  }
};

// @desc    Add tracking information
// @route   PATCH /api/orders/:id/tracking
// @access  Private (Admin, Vendor)
const addTrackingInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { trackingNumber, trackingUrl, carrier } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check permissions
    if (
      req.user.role === "vendor" &&
      order.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this order",
      });
    }

    // Add tracking information
    await order.addTracking({
      trackingNumber,
      trackingUrl,
      carrier,
    });

    // Populate references for response
    await order.populate([
      { path: "customer", select: "firstName lastName email" },
      { path: "vendor", select: "firstName lastName" },
      { path: "store", select: "name" },
      { path: "items.product", select: "name images price" },
    ]);

    res.json({
      success: true,
      message: "Tracking information added successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error adding tracking info:", error);
    res.status(500).json({
      success: false,
      message: "Error adding tracking information",
      error: error.message,
    });
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    if (["shipped", "out_for_delivery", "delivered"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Check permissions
    if (req.user.role === "customer") {
      if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to cancel this order",
        });
      }
    } else if (req.user.role === "vendor") {
      if (order.vendor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to cancel this order",
        });
      }
    }

    // Cancel order
    await order.updateStatus("cancelled", reason, req.user._id);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });
    }

    // Populate references for response
    await order.populate([
      { path: "customer", select: "firstName lastName email" },
      { path: "vendor", select: "firstName lastName" },
      { path: "store", select: "name" },
      { path: "items.product", select: "name images price" },
    ]);

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private (Admin, Vendor)
const getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate, store } = req.query;

    // Build query based on user role
    const query = {};

    if (req.user.role === "vendor") {
      query.vendor = req.user._id;
    }

    if (store) {
      query.store = store;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get order counts by status
    const statusStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$pricing.total" },
        },
      },
    ]);

    // Get total orders and revenue
    const totalStats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$pricing.total" },
          averageOrderValue: { $avg: "$pricing.total" },
        },
      },
    ]);

    // Get recent orders
    const recentOrders = await Order.find(query)
      .populate("customer", "firstName lastName")
      .populate("store", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        statusStats,
        totalStats: totalStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
        },
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  addTrackingInfo,
  cancelOrder,
  getOrderStats,
};
