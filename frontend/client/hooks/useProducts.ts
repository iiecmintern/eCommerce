import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  PaginationParams,
  ProductFilters,
} from "@shared/api";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: PaginationParams & ProductFilters) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  featured: () => [...productKeys.all, "featured"] as const,
  search: (query: string, filters?: ProductFilters) =>
    [...productKeys.all, "search", query, filters] as const,
  byCategory: (category: string, params?: PaginationParams) =>
    [...productKeys.all, "category", category, params] as const,
  myProducts: (params?: PaginationParams) =>
    [...productKeys.all, "my-products", params] as const,
};

// Get all products
export const useProducts = (params?: PaginationParams & ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => apiService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => apiService.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Search products
export const useSearchProducts = (
  query: string,
  params?: PaginationParams & ProductFilters,
) => {
  return useQuery({
    queryKey: productKeys.search(query, params),
    queryFn: () => apiService.searchProducts(query, params),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get products by category
export const useProductsByCategory = (
  category: string,
  params?: PaginationParams,
) => {
  return useQuery({
    queryKey: productKeys.byCategory(category, params),
    queryFn: () => apiService.getProductsByCategory(category, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get product categories
export const useProductCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => apiService.getProductCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Vendor: Get my products
export const useMyProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: productKeys.myProducts(params),
    queryFn: () => apiService.getMyProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductCreateRequest) =>
      apiService.createProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch my products
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdateRequest }) =>
      apiService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(variables.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "draft" | "published" | "archived";
    }) => apiService.updateProductStatus(id, status),
    onSuccess: (data, variables) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(variables.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      stockQuantity,
    }: {
      id: string;
      stockQuantity: number;
    }) => apiService.updateProductStock(id, stockQuantity),
    onSuccess: (data, variables) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(variables.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
