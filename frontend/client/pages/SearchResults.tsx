import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import searchApi from "../services/searchApi";
import SearchBar from "../components/SearchBar";
import SearchFilters from "../components/SearchFilters";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Star,
  Package,
  TrendingUp,
} from "lucide-react";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, dispatch, updateFilters } = useSearch();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState(state.filters.sortBy || "relevance");

  // Initialize filters from URL params
  useEffect(() => {
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const availability = searchParams.get("availability") as any;
    const page = searchParams.get("page");

    updateFilters({
      query,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      availability: availability || undefined,
      page: page ? Number(page) : 1,
    });
  }, [searchParams, updateFilters]);

  // Perform search when filters change
  useEffect(() => {
    const performSearch = async () => {
      if (Object.keys(state.filters).length === 0) return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const results = await searchApi.advancedSearch(state.filters);
        dispatch({ type: "SET_RESULTS", payload: results });

        // Update URL params
        const newParams = new URLSearchParams();
        if (state.filters.query) newParams.set("q", state.filters.query);
        if (state.filters.category)
          newParams.set("category", state.filters.category);
        if (state.filters.minPrice)
          newParams.set("minPrice", state.filters.minPrice.toString());
        if (state.filters.maxPrice)
          newParams.set("maxPrice", state.filters.maxPrice.toString());
        if (state.filters.rating)
          newParams.set("rating", state.filters.rating.toString());
        if (state.filters.availability)
          newParams.set("availability", state.filters.availability);
        if (state.filters.page && state.filters.page > 1)
          newParams.set("page", state.filters.page.toString());

        setSearchParams(newParams);
      } catch (error) {
        console.error("Search error:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to perform search" });
      }
    };

    performSearch();
  }, [state.filters, dispatch, setSearchParams]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    updateFilters({ sortBy: newSortBy as any, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const handleSearch = (query: string) => {
    updateFilters({ query, page: 1 });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const renderProductCard = (product: any) => (
    <div
      key={product._id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={product.images?.[0]?.url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stockQuantity === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (product.averageRating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            ({product.averageRating?.toFixed(1) || "0"})
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Package className="w-4 h-4" />
          <span>
            {product.stockQuantity > 0
              ? `${product.stockQuantity} in stock`
              : "Out of stock"}
          </span>
        </div>
        <Link
          to={`/product/${product._id}`}
          className="block w-full bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  const renderProductList = (product: any) => (
    <div
      key={product._id}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-4">
        <img
          src={product.images?.[0]?.url || "/placeholder.svg"}
          alt={product.name}
          className="w-32 h-32 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (product.averageRating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">
              ({product.averageRating?.toFixed(1) || "0"})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
            </div>
            <Link
              to={`/product/${product._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (state.loading && !state.results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <SearchBar
            className="max-w-2xl mx-auto mb-6"
            onSearch={handleSearch}
          />

          {state.results && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Search Results
                {state.filters.query && (
                  <span className="text-blue-600">
                    {" "}
                    for "{state.filters.query}"
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {state.results.pagination.total} products found
              </p>
            </div>
          )}
        </div>

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {state.error}
          </div>
        )}

        {state.results && (
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div className="w-64 flex-shrink-0">
              <SearchFilters
                availableFilters={state.results.filters.available}
                className="sticky top-4"
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price">Price: Low to High</option>
                    <option value="price">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="name">Name: Z to A</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Products Grid/List */}
              {state.results.products.length > 0 ? (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {state.results.products.map(
                      viewMode === "grid"
                        ? renderProductCard
                        : renderProductList,
                    )}
                  </div>

                  {/* Pagination */}
                  {state.results.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() =>
                          handlePageChange(
                            state.results.pagination.currentPage - 1,
                          )
                        }
                        disabled={!state.results.pagination.hasPrevPage}
                        className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {[...Array(state.results.pagination.totalPages)].map(
                        (_, i) => {
                          const page = i + 1;
                          const isCurrent =
                            page === state.results.pagination.currentPage;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 border rounded-md ${
                                isCurrent
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        },
                      )}

                      <button
                        onClick={() =>
                          handlePageChange(
                            state.results.pagination.currentPage + 1,
                          )
                        }
                        disabled={!state.results.pagination.hasNextPage}
                        className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <button
                    onClick={() => updateFilters({})}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
