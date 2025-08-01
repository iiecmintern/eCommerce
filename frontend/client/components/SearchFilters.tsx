import React, { useState } from "react";
import { Filter, X, Star, Package, Users } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";
import { SearchFilters } from "../services/searchApi";

interface SearchFiltersProps {
  availableFilters: {
    categories: Array<{ _id: string; count: number }>;
    priceRange?: {
      minPrice: number;
      maxPrice: number;
      avgPrice: number;
    };
    ratings: Array<{ _id: number; count: number }>;
    vendors: Array<{ _id: string; name: string; count: number }>;
    tags: Array<{ _id: string; count: number }>;
  };
  className?: string;
}

export default function SearchFilters({
  availableFilters,
  className = "",
}: SearchFiltersProps) {
  const { state, updateFilters, clearFilters } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Partial<SearchFilters>>({
    category: state.filters.category,
    minPrice: state.filters.minPrice,
    maxPrice: state.filters.maxPrice,
    rating: state.filters.rating,
    availability: state.filters.availability,
    tags: state.filters.tags || [],
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    updateFilters(localFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    clearFilters();
    setIsOpen(false);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    handleFilterChange("tags", newTags);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (state.filters.category) count++;
    if (state.filters.minPrice || state.filters.maxPrice) count++;
    if (state.filters.rating) count++;
    if (state.filters.availability) count++;
    if (state.filters.tags && state.filters.tags.length > 0)
      count += state.filters.tags.length;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              {availableFilters.categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {availableFilters.categories.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category._id}
                          checked={localFilters.category === category._id}
                          onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                          }
                          className="text-blue-500"
                        />
                        <span className="flex-1">{category._id}</span>
                        <span className="text-sm text-gray-500">
                          ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              {availableFilters.priceRange && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        placeholder="₹0"
                        value={localFilters.minPrice || ""}
                        onChange={(e) =>
                          handleFilterChange(
                            "minPrice",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        placeholder={`₹${availableFilters.priceRange.maxPrice}`}
                        value={localFilters.maxPrice || ""}
                        onChange={(e) =>
                          handleFilterChange(
                            "maxPrice",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Rating */}
              {availableFilters.ratings.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    {availableFilters.ratings.map((rating) => (
                      <label
                        key={rating._id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={rating._id}
                          checked={localFilters.rating === rating._id}
                          onChange={(e) =>
                            handleFilterChange("rating", Number(e.target.value))
                          }
                          className="text-blue-500"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating._id
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({rating.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Availability</h4>
                <div className="space-y-2">
                  {[
                    { value: "inStock", label: "In Stock", icon: Package },
                    {
                      value: "outOfStock",
                      label: "Out of Stock",
                      icon: Package,
                    },
                    { value: "lowStock", label: "Low Stock", icon: Package },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={localFilters.availability === option.value}
                        onChange={(e) =>
                          handleFilterChange("availability", e.target.value)
                        }
                        className="text-blue-500"
                      />
                      <option.icon className="w-4 h-4 text-gray-500" />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {availableFilters.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableFilters.tags.map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => handleTagToggle(tag._id)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          (localFilters.tags || []).includes(tag._id)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        #{tag._id} ({tag.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
