const Subscription = require("../../models/subscription/Subscription");
const Plan = require("../../models/subscription/Plan");
const User = require("../../models/user/User");
const { catchAsync } = require("../../utils/helpers");

// @desc    Get user's subscription
// @route   GET /api/subscriptions/me
// @access  Private
const getMySubscription = catchAsync(async (req, res) => {
  const subscription = await Subscription.getByUser(req.user.id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "No subscription found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      subscription,
    },
  });
});

// @desc    Create subscription (start trial)
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = catchAsync(async (req, res) => {
  const { planId, billingCycle } = req.body;

  // Check if plan exists
  const plan = await Plan.findById(planId);
  if (!plan || !plan.isActive) {
    return res.status(404).json({
      success: false,
      message: "Plan not found or inactive",
    });
  }

  // Check if user already has an active subscription
  const existingSubscription = await Subscription.getByUser(req.user.id);
  if (existingSubscription && existingSubscription.isActive) {
    return res.status(400).json({
      success: false,
      message: "User already has an active subscription",
    });
  }

  // Calculate amount based on billing cycle
  const amount =
    billingCycle === "annual" ? plan.pricing.annual : plan.pricing.monthly;

  // Create subscription
  const subscription = await Subscription.create({
    user: req.user.id,
    plan: planId,
    billingCycle,
    amount,
    currency: plan.pricing.currency,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
  });

  // Populate plan details
  await subscription.populate("plan");

  res.status(201).json({
    success: true,
    message: "Subscription created successfully",
    data: {
      subscription,
    },
  });
});

// @desc    Update subscription (upgrade/downgrade)
// @route   PUT /api/subscriptions/:id
// @access  Private
const updateSubscription = catchAsync(async (req, res) => {
  const { planId, billingCycle } = req.body;

  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  // Check if user owns this subscription
  if (subscription.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this subscription",
    });
  }

  // Check if plan exists
  const plan = await Plan.findById(planId);
  if (!plan || !plan.isActive) {
    return res.status(404).json({
      success: false,
      message: "Plan not found or inactive",
    });
  }

  // Update subscription
  subscription.plan = planId;
  subscription.billingCycle = billingCycle;
  subscription.amount =
    billingCycle === "annual" ? plan.pricing.annual : plan.pricing.monthly;
  subscription.currency = plan.pricing.currency;

  await subscription.save();
  await subscription.populate("plan");

  res.status(200).json({
    success: true,
    message: "Subscription updated successfully",
    data: {
      subscription,
    },
  });
});

// @desc    Cancel subscription
// @route   POST /api/subscriptions/:id/cancel
// @access  Private
const cancelSubscription = catchAsync(async (req, res) => {
  const { cancelAtPeriodEnd = true } = req.body;

  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  // Check if user owns this subscription
  if (subscription.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to cancel this subscription",
    });
  }

  // Cancel subscription
  await subscription.cancel(cancelAtPeriodEnd);

  res.status(200).json({
    success: true,
    message: cancelAtPeriodEnd
      ? "Subscription will be cancelled at the end of the current period"
      : "Subscription cancelled immediately",
    data: {
      subscription,
    },
  });
});

// @desc    Reactivate subscription
// @route   POST /api/subscriptions/:id/reactivate
// @access  Private
const reactivateSubscription = catchAsync(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  // Check if user owns this subscription
  if (subscription.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to reactivate this subscription",
    });
  }

  // Reactivate subscription
  await subscription.reactivate();

  res.status(200).json({
    success: true,
    message: "Subscription reactivated successfully",
    data: {
      subscription,
    },
  });
});

// @desc    Get all subscriptions (Admin only)
// @route   GET /api/subscriptions
// @access  Private (Admin)
const getAllSubscriptions = catchAsync(async (req, res) => {
  const subscriptions = await Subscription.getActiveSubscriptions();

  res.status(200).json({
    success: true,
    data: {
      subscriptions,
    },
  });
});

// @desc    Get subscription by ID (Admin only)
// @route   GET /api/subscriptions/:id
// @access  Private (Admin)
const getSubscriptionById = catchAsync(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id)
    .populate("user", "firstName lastName email")
    .populate("plan");

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      subscription,
    },
  });
});

// @desc    Get expiring subscriptions (Admin only)
// @route   GET /api/subscriptions/expiring
// @access  Private (Admin)
const getExpiringSubscriptions = catchAsync(async (req, res) => {
  const { days = 7 } = req.query;

  const subscriptions = await Subscription.getExpiringSubscriptions(
    parseInt(days)
  );

  res.status(200).json({
    success: true,
    data: {
      subscriptions,
    },
  });
});

module.exports = {
  getMySubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getExpiringSubscriptions,
};
