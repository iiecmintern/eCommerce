const Product = require("../../models/product/Product");
const Store = require("../../models/store/Store");
const User = require("../../models/user/User");

class SearchController {
  // Advanced search with multiple filters
  async advancedSearch(req, res) {
    try {
      const {
        query = "",
        category,
        subcategory,
        minPrice,
        maxPrice,
        rating,
        availability,
        vendor,
        store,
        tags,
        sortBy = "relevance",
        sortOrder = "desc",
        page = 1,
        limit = 20,
        includeVariants = false,
      } = req.query;

      // Build search query
      const searchQuery = {};

      // Text search across multiple fields
      if (query.trim()) {
        searchQuery.$or = [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { shortDescription: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
          { sku: { $regex: query, $options: "i" } },
          { barcode: { $regex: query, $options: "i" } },
        ];
      }

      // Category filter
      if (category) {
        searchQuery.category = category;
      }

      // Subcategory filter
      if (subcategory) {
        searchQuery.subcategory = { $regex: subcategory, $options: "i" };
      }

      // Price range filter
      if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
      }

      // Rating filter
      if (rating) {
        searchQuery.averageRating = { $gte: parseFloat(rating) };
      }

      // Availability filter
      if (availability === "inStock") {
        searchQuery.stockQuantity = { $gt: 0 };
      } else if (availability === "outOfStock") {
        searchQuery.stockQuantity = 0;
      } else if (availability === "lowStock") {
        searchQuery.$expr = {
          $and: [
            { $gt: ["$stockQuantity", 0] },
            { $lte: ["$stockQuantity", "$lowStockThreshold"] },
          ],
        };
      }

      // Vendor filter
      if (vendor) {
        searchQuery.vendor = vendor;
      }

      // Store filter
      if (store) {
        searchQuery.store = store;
      }

      // Tags filter
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        searchQuery.tags = { $in: tagArray };
      }

      // Only show published products
      searchQuery.isPublished = true;

      // Build sort options
      let sortOptions = {};
      switch (sortBy) {
        case "price":
          sortOptions.price = sortOrder === "asc" ? 1 : -1;
          break;
        case "name":
          sortOptions.name = sortOrder === "asc" ? 1 : -1;
          break;
        case "rating":
          sortOptions.averageRating = sortOrder === "asc" ? 1 : -1;
          break;
        case "newest":
          sortOptions.createdAt = sortOrder === "asc" ? 1 : -1;
          break;
        case "popular":
          sortOptions.viewCount = sortOrder === "asc" ? 1 : -1;
          break;
        case "relevance":
        default:
          // For relevance, use creation date for now (text score requires text index)
          sortOptions.createdAt = -1;
          break;
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute search
      const products = await Product.find(searchQuery)
        .populate("vendor", "firstName lastName email")
        .populate("store", "name logo")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Get total count for pagination
      const total = await Product.countDocuments(searchQuery);

      // Calculate pagination info
      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNextPage = parseInt(page) < totalPages;
      const hasPrevPage = parseInt(page) > 1;

      // Process variants if requested
      let processedProducts = products;
      if (includeVariants === "true") {
        processedProducts = products.map((product) => {
          const availableVariants =
            product.variants?.filter((v) => v.stockQuantity > 0) || [];
          return {
            ...product,
            availableVariants,
            variantCount: product.variants?.length || 0,
            availableVariantCount: availableVariants.length,
          };
        });
      }

      // Track search analytics (for future use)
      if (query.trim()) {
        console.log(
          `Search Analytics: "${query}" returned ${total} results by user ${
            req.user?.id || "anonymous"
          }`
        );
      }

      res.json({
        success: true,
        data: {
          products: processedProducts,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            total,
            hasNextPage,
            hasPrevPage,
            limit: parseInt(limit),
          },
          filters: {
            applied: {
              query,
              category,
              subcategory,
              minPrice,
              maxPrice,
              rating,
              availability,
              vendor,
              store,
              tags,
            },
            available: {
              categories: [],
              priceRange: null,
              ratings: [],
              vendors: [],
              tags: [],
            },
          },
        },
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        success: false,
        message: "Search failed",
        error: error.message,
      });
    }
  }

  // Autocomplete suggestions
  async getAutocompleteSuggestions(req, res) {
    try {
      const { query = "", limit = 10 } = req.query;

      if (!query.trim()) {
        return res.json({
          success: true,
          data: {
            suggestions: [],
            categories: [],
            tags: [],
          },
        });
      }

      // Get product name suggestions
      const productSuggestions = await Product.aggregate([
        {
          $match: {
            name: { $regex: query, $options: "i" },
            isPublished: true,
          },
        },
        {
          $group: {
            _id: "$name",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: parseInt(limit),
        },
        {
          $project: {
            _id: 0,
            suggestion: "$_id",
            type: "product",
            count: 1,
          },
        },
      ]);

      // Get category suggestions
      const categorySuggestions = await Product.aggregate([
        {
          $match: {
            category: { $regex: query, $options: "i" },
            isPublished: true,
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 0,
            suggestion: "$_id",
            type: "category",
            count: 1,
          },
        },
      ]);

      // Get tag suggestions
      const tagSuggestions = await Product.aggregate([
        {
          $match: {
            tags: { $in: [new RegExp(query, "i")] },
            isPublished: true,
          },
        },
        {
          $unwind: "$tags",
        },
        {
          $match: {
            tags: { $regex: query, $options: "i" },
          },
        },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 0,
            suggestion: "$_id",
            type: "tag",
            count: 1,
          },
        },
      ]);

      const suggestions = [
        ...productSuggestions,
        ...categorySuggestions,
        ...tagSuggestions,
      ].sort((a, b) => b.count - a.count);

      res.json({
        success: true,
        data: {
          suggestions: suggestions.slice(0, parseInt(limit)),
          categories: categorySuggestions,
          tags: tagSuggestions,
        },
      });
    } catch (error) {
      console.error("Autocomplete error:", error);
      res.status(500).json({
        success: false,
        message: "Autocomplete failed",
        error: error.message,
      });
    }
  }

  // Get available filters for current search
  async getAvailableFilters(searchQuery) {
    try {
      const filters = {};

      // Categories
      filters.categories = await Product.aggregate([
        { $match: searchQuery },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      // Price ranges
      const priceStats = await Product.aggregate([
        { $match: searchQuery },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            avgPrice: { $avg: "$price" },
          },
        },
      ]);

      if (priceStats.length > 0) {
        filters.priceRange = priceStats[0];
      }

      // Ratings
      filters.ratings = await Product.aggregate([
        { $match: { ...searchQuery, averageRating: { $exists: true } } },
        {
          $group: {
            _id: { $floor: "$averageRating" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);

      // Vendors
      filters.vendors = await Product.aggregate([
        { $match: searchQuery },
        {
          $lookup: {
            from: "users",
            localField: "vendor",
            foreignField: "_id",
            as: "vendorInfo",
          },
        },
        {
          $unwind: "$vendorInfo",
        },
        {
          $group: {
            _id: "$vendor",
            name: { $first: "$vendorInfo.firstName" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      // Tags
      filters.tags = await Product.aggregate([
        { $match: searchQuery },
        {
          $unwind: "$tags",
        },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 20,
        },
      ]);

      return filters;
    } catch (error) {
      console.error("Filter generation error:", error);
      return {};
    }
  }

  // Get popular searches
  async getPopularSearches(req, res) {
    try {
      const { limit = 10, period = "7d" } = req.query;

      // This would typically come from a search analytics collection
      // For now, we'll return popular categories and tags
             const popularCategories = await Product.aggregate([
         {
           $match: { isPublished: true },
         },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: parseInt(limit),
        },
      ]);

             const popularTags = await Product.aggregate([
         {
           $match: { isPublished: true },
         },
        {
          $unwind: "$tags",
        },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: parseInt(limit),
        },
      ]);

      res.json({
        success: true,
        data: {
          categories: popularCategories,
          tags: popularTags,
        },
      });
    } catch (error) {
      console.error("Popular searches error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get popular searches",
        error: error.message,
      });
    }
  }

  // Track search analytics (placeholder for future implementation)
  async trackSearchAnalytics(query, resultCount, userId) {
    try {
      // This would typically save to a search analytics collection
      // For now, we'll just log it
      console.log(
        `Search Analytics: "${query}" returned ${resultCount} results by user ${
          userId || "anonymous"
        }`
      );
    } catch (error) {
      console.error("Search analytics tracking error:", error);
    }
  }

  // Get search suggestions based on user history (placeholder)
  async getPersonalizedSuggestions(req, res) {
    try {
      const { limit = 5 } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        return res.json({
          success: true,
          data: {
            suggestions: [],
          },
        });
      }

      // This would typically analyze user's search and purchase history
      // For now, return popular categories
             const suggestions = await Product.aggregate([
         {
           $match: { isPublished: true },
         },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: parseInt(limit),
        },
        {
          $project: {
            _id: 0,
            suggestion: "$_id",
            type: "category",
            count: 1,
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          suggestions,
        },
      });
    } catch (error) {
      console.error("Personalized suggestions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get personalized suggestions",
        error: error.message,
      });
    }
  }
}

module.exports = new SearchController();
