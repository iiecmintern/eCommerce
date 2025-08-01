const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/search/searchController");
const { protect } = require("../../middleware/auth/auth");

// Public search routes
router.get("/advanced", searchController.advancedSearch);
router.get("/autocomplete", searchController.getAutocompleteSuggestions);
router.get("/popular", searchController.getPopularSearches);

// Personalized routes (require authentication)
router.get(
  "/personalized",
  protect,
  searchController.getPersonalizedSuggestions
);

module.exports = router;
