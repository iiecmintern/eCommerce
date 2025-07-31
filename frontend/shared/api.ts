/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  GET_CURRENT_USER: "/auth/me",

  GET_PRODUCTS: "/products",
  GET_PRODUCT: "/products",
  GET_PRODUCTS_BY_CATEGORY: "/products/category",
  GET_FEATURED_PRODUCTS: "/products/featured",
  SEARCH_PRODUCTS: "/products/search",
  GET_PRODUCT_CATEGORIES: "/products/categories",
  GET_MY_PRODUCTS: "/products/my",
  CREATE_PRODUCT: "/products",
  UPDATE_PRODUCT: "/products",
  DELETE_PRODUCT: "/products",
  UPDATE_PRODUCT_STATUS: "/products/status",
  UPDATE_PRODUCT_STOCK: "/products/stock",
  GET_STORES: "/stores",
  GET_STORE: "/stores",
  GET_FEATURED_STORES: "/stores/featured",
  SEARCH_STORES: "/stores/search",
  GET_STORE_PRODUCTS: "/stores/products",
  GET_MY_STORE: "/stores/my",
  CREATE_STORE: "/stores",
  UPDATE_STORE: "/stores",
  UPDATE_STORE_STATUS: "/stores/status",
  GET_ALL_STORES_FOR_ADMIN: "/stores/admin",
  VERIFY_STORE: "/stores/verify",

  // Orders endpoints
  ORDERS_MY: "/orders/my",
  ORDER_BY_ID: (id: string) => `/orders/my/${id}`,
  CANCEL_ORDER: (id: string) => `/orders/my/${id}/cancel`,

  // Wishlist endpoints
  ADD_TO_WISHLIST: (productId: string) => `/wishlist/${productId}`,
  REMOVE_FROM_WISHLIST: (productId: string) => `/wishlist/${productId}`,
} as const;

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  role: "admin" | "vendor" | "customer";

  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication Types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  password: string;
  role: "admin" | "vendor" | "customer";
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand?: string;
  sku?: string;
  stockQuantity: number;
  status: "draft" | "published" | "archived";
  storeId: string;
  store?: Store;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, any>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  category: string;
  brand?: string;
  sku?: string;
  stockQuantity: number;
  specifications?: Record<string, any>;
  tags?: string[];
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  images?: string[];
  category?: string;
  brand?: string;
  sku?: string;
  stockQuantity?: number;
  specifications?: Record<string, any>;
  tags?: string[];
}

// Store Types
export interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  status: "active" | "inactive" | "suspended";
  isVerified: boolean;
  ownerId: string;
  owner?: User;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreCreateRequest {
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
}

export interface StoreUpdateRequest {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact?: {
    email: string;
    phone: string;
    website?: string;
  };
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: "draft" | "published" | "archived";
  inStock?: boolean;
}

export interface StoreFilters {
  status?: "active" | "inactive" | "suspended";
  isVerified?: boolean;
  country?: string;
  state?: string;
  city?: string;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
