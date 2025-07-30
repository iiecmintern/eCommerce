import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import {
  Store,
  StoreCreateRequest,
  StoreUpdateRequest,
  PaginationParams,
  StoreFilters,
} from "@shared/api";

// Query keys
export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: (filters: PaginationParams & StoreFilters) =>
    [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, "detail"] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  featured: () => [...storeKeys.all, "featured"] as const,
  search: (query: string, filters?: StoreFilters) =>
    [...storeKeys.all, "search", query, filters] as const,
  myStore: () => [...storeKeys.all, "my-store"] as const,
  storeProducts: (storeId: string, params?: PaginationParams) =>
    [...storeKeys.all, "store-products", storeId, params] as const,
  adminStores: (params?: PaginationParams) =>
    [...storeKeys.all, "admin", params] as const,
};

// Get all stores
export const useStores = (params?: PaginationParams & StoreFilters) => {
  return useQuery({
    queryKey: storeKeys.list(params || {}),
    queryFn: () => apiService.getStores(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single store
export const useStore = (id: string) => {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => apiService.getStore(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get featured stores
export const useFeaturedStores = () => {
  return useQuery({
    queryKey: storeKeys.featured(),
    queryFn: () => apiService.getFeaturedStores(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Search stores
export const useSearchStores = (
  query: string,
  params?: PaginationParams & StoreFilters,
) => {
  return useQuery({
    queryKey: storeKeys.search(query, params),
    queryFn: () => apiService.searchStores(query, params),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get store products
export const useStoreProducts = (
  storeId: string,
  params?: PaginationParams,
) => {
  return useQuery({
    queryKey: storeKeys.storeProducts(storeId, params),
    queryFn: () => apiService.getStoreProducts(storeId, params),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Vendor: Get my store
export const useMyStore = () => {
  return useQuery({
    queryKey: storeKeys.myStore(),
    queryFn: () => apiService.getMyStore(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Admin: Get all stores
export const useAllStoresForAdmin = (params?: PaginationParams) => {
  return useQuery({
    queryKey: storeKeys.adminStores(params),
    queryFn: () => apiService.getAllStoresForAdmin(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeData: StoreCreateRequest) =>
      apiService.createStore(storeData),
    onSuccess: () => {
      // Invalidate and refetch my store
      queryClient.invalidateQueries({ queryKey: storeKeys.myStore() });
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StoreUpdateRequest }) =>
      apiService.updateStore(id, data),
    onSuccess: (data, variables) => {
      // Update the store in cache
      queryClient.setQueryData(storeKeys.detail(variables.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: storeKeys.myStore() });
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
  });
};

export const useUpdateStoreStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "inactive" | "suspended";
    }) => apiService.updateStoreStatus(id, status),
    onSuccess: (data, variables) => {
      // Update the store in cache
      queryClient.setQueryData(storeKeys.detail(variables.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: storeKeys.myStore() });
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.adminStores() });
    },
  });
};

export const useVerifyStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.verifyStore(id),
    onSuccess: (data, storeId) => {
      // Update the store in cache
      queryClient.setQueryData(storeKeys.detail(storeId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.adminStores() });
    },
  });
};
