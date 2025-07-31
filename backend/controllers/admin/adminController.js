const User = require("../../models/user/User");
const Store = require("../../models/store/Store");
const Order = require("../../models/order/Order");
const Product = require("../../models/product/Product");

// Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    // Calculate total revenue from all orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ["completed", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get active stores count
    const activeStores = await Store.countDocuments({ status: "active" });

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Calculate platform uptime (mock calculation for now)
    const platformUptime = 99.97;

    // Calculate monthly changes (mock data for now)
    const revenueChange = 0;
    const storesChange = 0;
    const usersChange = 0;
    const uptimeChange = 0;

    const stats = {
      totalRevenue,
      activeStores,
      totalUsers,
      platformUptime,
      revenueChange,
      storesChange,
      usersChange,
      uptimeChange,
    };

    res.status(200).json({
      success: true,
      message: "Admin stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message,
    });
  }
};

// Get recent stores
const getRecentStores = async (req, res) => {
  try {
    const recentStores = await Store.find()
      .populate("owner", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedStores = recentStores.map((store) => ({
      id: store._id,
      name: store.name,
      owner: `${store.owner.firstName} ${store.owner.lastName}`,
      category: store.category || "General",
      revenue: store.totalRevenue || 0,
      status: store.status,
      createdAt: store.createdAt,
      avatar: store.logo || null,
    }));

    res.status(200).json({
      success: true,
      message: "Recent stores retrieved successfully",
      data: formattedStores,
    });
  } catch (error) {
    console.error("Error fetching recent stores:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent stores",
      error: error.message,
    });
  }
};

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    // Get recent orders as activities
    const recentOrders = await Order.find()
      .populate("store", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = recentOrders.map((order) => ({
      id: order._id,
      action: `Order ${order.orderNumber} ${order.status}`,
      store: order.store?.name || "Unknown Store",
      time: order.createdAt,
      type: order.status === "completed" ? "payment" : "order",
    }));

    // Add some mock activities for variety
    const mockActivities = [
      {
        id: "mock1",
        action: "New store approved",
        store: "TechGadgets Pro",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: "approval",
      },
      {
        id: "mock2",
        action: "Payment dispute resolved",
        store: "Fashion Forward",
        time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        type: "support",
      },
      {
        id: "mock3",
        action: "Security alert cleared",
        store: "Home & Garden Plus",
        time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        type: "security",
      },
    ];

    const allActivities = [...activities, ...mockActivities]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      message: "Recent activities retrieved successfully",
      data: allActivities,
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
      error: error.message,
    });
  }
};

// Get system health
const getSystemHealth = async (req, res) => {
  try {
    // Mock system health data (in a real system, this would check actual services)
    const systemHealth = [
      {
        service: "API Gateway",
        status: "healthy",
        uptime: 99.98,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "Database",
        status: "healthy",
        uptime: 99.97,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "Payment Processing",
        status: "warning",
        uptime: 99.85,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "CDN",
        status: "healthy",
        uptime: 99.99,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "Search Engine",
        status: "healthy",
        uptime: 99.96,
        lastCheck: new Date().toISOString(),
      },
    ];

    res.status(200).json({
      success: true,
      message: "System health retrieved successfully",
      data: systemHealth,
    });
  } catch (error) {
    console.error("Error fetching system health:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system health",
      error: error.message,
    });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    // Calculate monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ["completed", "delivered"] },
          createdAt: { $gte: currentMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const monthlyRevenue =
      monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;

    // Mock analytics data
    const analytics = {
      monthlyRevenue,
      apiCalls: 0, // Mock API calls count
      revenueTarget: 0,
      apiCapacity: 0,
    };

    res.status(200).json({
      success: true,
      message: "Analytics data retrieved successfully",
      data: analytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

// Export report
const exportReport = async (req, res) => {
  try {
    const { type, format } = req.body;

    // Generate report data based on type
    let reportData = {};

    if (type === "dashboard") {
      // Get all dashboard data for export
      const [stats, stores, activities, system, analytics] = await Promise.all([
        getAdminStats(req, { status: () => ({ json: () => {} }) }),
        getRecentStores(req, { status: () => ({ json: () => {} }) }),
        getRecentActivities(req, { status: () => ({ json: () => {} }) }),
        getSystemHealth(req, { status: () => ({ json: () => {} }) }),
        getAnalytics(req, { status: () => ({ json: () => {} }) }),
      ]);

      reportData = {
        generatedAt: new Date().toISOString(),
        type: "dashboard",
        stats,
        stores,
        activities,
        system,
        analytics,
      };
    }

    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      data: reportData,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

// Get all stores for admin
const getAllStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const stores = await Store.find(query)
      .populate("owner", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Store.countDocuments(query);

    const formattedStores = stores.map((store) => ({
      id: store._id,
      name: store.name,
      owner: `${store.owner.firstName} ${store.owner.lastName}`,
      category: store.category || "General",
      revenue: store.totalRevenue || 0,
      status: store.status,
      createdAt: store.createdAt,
      avatar: store.logo || null,
      description: store.description,
      email: store.owner.email,
    }));

    res.status(200).json({
      success: true,
      message: "Stores retrieved successfully",
      data: formattedStores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
      error: error.message,
    });
  }
};

// Get all users for admin
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    const formattedUsers = users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.isActive ? "active" : "inactive",
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }));

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: formattedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Update store status
const updateStoreStatus = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { status } = req.body;

    const store = await Store.findByIdAndUpdate(
      storeId,
      { status },
      { new: true }
    ).populate("owner", "firstName lastName email");

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Store status updated successfully",
      data: {
        id: store._id,
        name: store.name,
        status: store.status,
        owner: `${store.owner.firstName} ${store.owner.lastName}`,
      },
    });
  } catch (error) {
    console.error("Error updating store status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update store status",
      error: error.message,
    });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.isActive ? "active" : "inactive",
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getRecentStores,
  getRecentActivities,
  getSystemHealth,
  getAnalytics,
  exportReport,
  getAllStores,
  getAllUsers,
  updateStoreStatus,
  updateUserStatus,
};
