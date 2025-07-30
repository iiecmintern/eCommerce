const Plan = require("../../models/subscription/Plan");
const { catchAsync } = require("../../utils/helpers");

// @desc    Get all active plans
// @route   GET /api/plans
// @access  Public
const getPlans = catchAsync(async (req, res) => {
  const plans = await Plan.getActivePlans();

  res.status(200).json({
    success: true,
    data: {
      plans,
    },
  });
});

// @desc    Get plan by ID
// @route   GET /api/plans/:id
// @access  Public
const getPlanById = catchAsync(async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  if (!plan.isActive) {
    return res.status(404).json({
      success: false,
      message: "Plan is not active",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      plan,
    },
  });
});

// @desc    Get plan by type
// @route   GET /api/plans/type/:type
// @access  Public
const getPlanByType = catchAsync(async (req, res) => {
  const { type } = req.params;

  const plan = await Plan.getByType(type);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: `Plan type '${type}' not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: {
      plan,
    },
  });
});

// @desc    Create new plan (Admin only)
// @route   POST /api/plans
// @access  Private (Admin)
const createPlan = catchAsync(async (req, res) => {
  const {
    name,
    description,
    type,
    pricing,
    features,
    limits,
    isPopular,
    trialDays,
    sortOrder,
  } = req.body;

  const plan = await Plan.create({
    name,
    description,
    type,
    pricing,
    features,
    limits,
    isPopular,
    trialDays,
    sortOrder,
  });

  res.status(201).json({
    success: true,
    message: "Plan created successfully",
    data: {
      plan,
    },
  });
});

// @desc    Update plan (Admin only)
// @route   PUT /api/plans/:id
// @access  Private (Admin)
const updatePlan = catchAsync(async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Plan updated successfully",
    data: {
      plan: updatedPlan,
    },
  });
});

// @desc    Delete plan (Admin only)
// @route   DELETE /api/plans/:id
// @access  Private (Admin)
const deletePlan = catchAsync(async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  // Instead of deleting, mark as inactive
  plan.isActive = false;
  await plan.save();

  res.status(200).json({
    success: true,
    message: "Plan deactivated successfully",
  });
});

// @desc    Get plan comparison
// @route   GET /api/plans/compare
// @access  Public
const comparePlans = catchAsync(async (req, res) => {
  const plans = await Plan.getActivePlans();

  const comparison = plans.map((plan) => ({
    id: plan._id,
    name: plan.name,
    type: plan.type,
    pricing: plan.formattedPricing,
    features: plan.features,
    limits: plan.limits,
    isPopular: plan.isPopular,
    trialDays: plan.trialDays,
  }));

  res.status(200).json({
    success: true,
    data: {
      comparison,
    },
  });
});

module.exports = {
  getPlans,
  getPlanById,
  getPlanByType,
  createPlan,
  updatePlan,
  deletePlan,
  comparePlans,
};
