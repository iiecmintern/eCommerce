import { apiService as api } from "./api";

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: "inStock" | "outOfStock" | "lowStock";
  vendor?: string;
  store?: string;
  tags?: string[];
  sortBy?: "relevance" | "price" | "name" | "rating" | "newest" | "popular";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  includeVariants?: boolean;
}

export interface SearchResult {
  products: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  filters: {
    applied: SearchFilters;
    available: {
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
  };
}

export interface AutocompleteSuggestion {
  suggestion: string;
  type: "product" | "category" | "tag";
  count: number;
}

export interface AutocompleteResult {
  suggestions: AutocompleteSuggestion[];
  categories: AutocompleteSuggestion[];
  tags: AutocompleteSuggestion[];
}

export interface PopularSearch {
  categories: Array<{ _id: string; count: number }>;
  tags: Array<{ _id: string; count: number }>;
}

class SearchApi {
  // Advanced search with filters
  async advancedSearch(filters: SearchFilters): Promise<SearchResult> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await api.get(`/search/advanced?${params.toString()}`);
    return response.data.data;
  }

  // Get autocomplete suggestions
  async getAutocompleteSuggestions(
    query: string,
    limit: number = 10,
  ): Promise<AutocompleteResult> {
    const response = await api.get(
      `/search/autocomplete?query=${encodeURIComponent(query)}&limit=${limit}`,
    );
    return response.data.data;
  }

  // Get popular searches
  async getPopularSearches(
    limit: number = 10,
    period: string = "7d",
  ): Promise<PopularSearch> {
    const response = await api.get(
      `/search/popular?limit=${limit}&period=${period}`,
    );
    return response.data.data;
  }

  // Get personalized suggestions (requires authentication)
  async getPersonalizedSuggestions(
    limit: number = 5,
  ): Promise<{ suggestions: AutocompleteSuggestion[] }> {
    const response = await api.get(`/search/personalized?limit=${limit}`);
    return response.data.data;
  }
}

export default new SearchApi();
