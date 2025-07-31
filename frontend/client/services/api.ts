import {
  ApiResponse,
  User,
  AuthResponse,
  Product,
  Store,
  Order,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ProductCreateRequest,
  ProductUpdateRequest,
  StoreCreateRequest,
  StoreUpdateRequest,
  PaginationParams,
  PaginatedResponse,
  ProductFilters,
  StoreFilters,
  API_ENDPOINTS,
  API_BASE_URL,
} from "@shared/api";

// API Service Class
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  private getAuthToken(): string | null {
    try {
      return localStorage.getItem("authToken");
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  // Helper method to create headers
  private getHeaders(): HeadersInit {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      return headers;
    } catch (error) {
      console.error("Error creating headers:", error);
      return { "Content-Type": "application/json" };
    }
  }

  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error handling API response:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to parse API response");
    }
  }

  // Helper method to make API requests
  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: this.getHeaders(),
        ...options,
      };

      console.log("API Request:", {
        url,
        method: config.method || "GET",
        headers: config.headers,
        body: config.body,
      });

      const response = await fetch(url, config);
      console.log("API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error("API request failed:", error);
      console.error("Request details:", {
        url: `${this.baseURL}${endpoint}`,
        config: options,
      });

      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Authentication API Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>(API_ENDPOINTS.REGISTER, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      return await this.request(API_ENDPOINTS.LOGOUT, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API error:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await this.request<User>(API_ENDPOINTS.GET_ME);
    } catch (error) {
      console.error("Get current user API error:", error);
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      return await this.request(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Forgot password API error:", error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      return await this.request(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Reset password API error:", error);
      throw error;
    }
  }

  // Products API Methods
  async getProducts(
    params?: PaginationParams & ProductFilters,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.PRODUCTS}?${queryString}`
        : API_ENDPOINTS.PRODUCTS;

      return await this.request<PaginatedResponse<Product>>(endpoint);
    } catch (error) {
      console.error("Get products API error:", error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      return await this.request<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
    } catch (error) {
      console.error("Get product API error:", error);
      throw error;
    }
  }

  async getProductsByCategory(
    category: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category)}?${queryString}`
        : API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category);

      return await this.request<PaginatedResponse<Product>>(endpoint);
    } catch (error) {
      console.error("Get products by category API error:", error);
      throw error;
    }
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    try {
      return await this.request<Product[]>(API_ENDPOINTS.FEATURED_PRODUCTS);
    } catch (error) {
      console.error("Get featured products API error:", error);
      throw error;
    }
  }

  async searchProducts(
    query: string,
    params?: PaginationParams & ProductFilters,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("q", query);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = `${API_ENDPOINTS.SEARCH_PRODUCTS}?${queryString}`;

      return await this.request<PaginatedResponse<Product>>(endpoint);
    } catch (error) {
      console.error("Search products API error:", error);
      throw error;
    }
  }

  async getProductCategories(): Promise<ApiResponse<string[]>> {
    try {
      return await this.request<string[]>(API_ENDPOINTS.PRODUCT_CATEGORIES);
    } catch (error) {
      console.error("Get product categories API error:", error);
      throw error;
    }
  }

  // Vendor Product Management
  async getMyProducts(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.MY_PRODUCTS}?${queryString}`
        : API_ENDPOINTS.MY_PRODUCTS;

      return await this.request<PaginatedResponse<Product>>(endpoint);
    } catch (error) {
      console.error("Get my products API error:", error);
      throw error;
    }
  }

  async createProduct(
    productData: ProductCreateRequest,
  ): Promise<ApiResponse<Product>> {
    try {
      return await this.request<Product>(API_ENDPOINTS.PRODUCTS, {
        method: "POST",
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error("Create product API error:", error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    productData: ProductUpdateRequest,
  ): Promise<ApiResponse<Product>> {
    try {
      return await this.request<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error("Update product API error:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    try {
      return await this.request(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Delete product API error:", error);
      throw error;
    }
  }

  async updateProductStatus(
    id: string,
    status: "draft" | "published" | "archived",
  ): Promise<ApiResponse<Product>> {
    try {
      return await this.request<Product>(API_ENDPOINTS.PRODUCT_STATUS(id), {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Update product status API error:", error);
      throw error;
    }
  }

  async updateProductStock(
    id: string,
    stockQuantity: number,
  ): Promise<ApiResponse<Product>> {
    try {
      return await this.request<Product>(API_ENDPOINTS.PRODUCT_STOCK(id), {
        method: "PATCH",
        body: JSON.stringify({ stockQuantity }),
      });
    } catch (error) {
      console.error("Update product stock API error:", error);
      throw error;
    }
  }

  // Stores API Methods
  async getStores(
    params?: PaginationParams & StoreFilters,
  ): Promise<PaginatedResponse<Store>> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.STORES}?${queryString}`
        : API_ENDPOINTS.STORES;

      return await this.request<PaginatedResponse<Store>>(endpoint);
    } catch (error) {
      console.error("Get stores API error:", error);
      throw error;
    }
  }

  async getStore(id: string): Promise<ApiResponse<Store>> {
    try {
      return await this.request<Store>(API_ENDPOINTS.STORE_BY_ID(id));
    } catch (error) {
      console.error("Get store API error:", error);
      throw error;
    }
  }

  async getFeaturedStores(): Promise<ApiResponse<Store[]>> {
    try {
      return await this.request<Store[]>(API_ENDPOINTS.FEATURED_STORES);
    } catch (error) {
      console.error("Get featured stores API error:", error);
      throw error;
    }
  }

  async searchStores(
    query: string,
    params?: PaginationParams & StoreFilters,
  ): Promise<PaginatedResponse<Store>> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("q", query);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = `${API_ENDPOINTS.SEARCH_STORES}?${queryString}`;

      return await this.request<PaginatedResponse<Store>>(endpoint);
    } catch (error) {
      console.error("Search stores API error:", error);
      throw error;
    }
  }

  async getStoreProducts(
    storeId: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.STORE_PRODUCTS(storeId)}?${queryString}`
        : API_ENDPOINTS.STORE_PRODUCTS(storeId);

      return await this.request<PaginatedResponse<Product>>(endpoint);
    } catch (error) {
      console.error("Get store products API error:", error);
      throw error;
    }
  }

  // Vendor Store Management
  async getMyStore(): Promise<ApiResponse<Store>> {
    try {
      return await this.request<Store>(API_ENDPOINTS.MY_STORE);
    } catch (error) {
      console.error("Get my store API error:", error);
      throw error;
    }
  }

  async createStore(
    storeData: StoreCreateRequest,
  ): Promise<ApiResponse<Store>> {
    try {
      return await this.request<Store>(API_ENDPOINTS.STORES, {
        method: "POST",
        body: JSON.stringify(storeData),
      });
    } catch (error) {
      console.error("Create store API error:", error);
      throw error;
    }
  }

  async updateStore(
    id: string,
    storeData: StoreUpdateRequest,
  ): Promise<ApiResponse<Store>> {
    try {
      return await this.request<Store>(API_ENDPOINTS.STORE_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(storeData),
      });
    } catch (error) {
      console.error("Update store API error:", error);
      throw error;
    }
  }

  async updateStoreStatus(
    id: string,
    status: "active" | "inactive" | "suspended",
  ): Promise<ApiResponse<Store>> {
    try {
      return await this.request<Store>(API_ENDPOINTS.STORE_STATUS(id), {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Update store status API error:", error);
      throw error;
    }
  }

  // Admin Store Management
  async getAllStoresForAdmin(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Store>> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.ALL_STORES_ADMIN}?${queryString}`
        : API_ENDPOINTS.ALL_STORES_ADMIN;

      return await this.request<PaginatedResponse<Store>>(endpoint);
    } catch (error) {
      console.error("Get all stores for admin API error:", error);
      throw error;
    }
  }

  async verifyStore(id: string): Promise<ApiResponse<Store>> {
    try {
      return await this.request<Store>(API_ENDPOINTS.VERIFY_STORE(id), {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Verify store API error:", error);
      throw error;
    }
  }

  // Orders API Methods
  async getMyOrders(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Order>> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.ORDERS_MY}?${queryString}`
        : API_ENDPOINTS.ORDERS_MY;

      return await this.request<PaginatedResponse<Order>>(endpoint);
    } catch (error) {
      console.error("Get my orders API error:", error);
      throw error;
    }
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    try {
      return await this.request<Order>(API_ENDPOINTS.ORDER_BY_ID(id));
    } catch (error) {
      console.error("Get order API error:", error);
      throw error;
    }
  }

  async cancelOrder(id: string, reason?: string): Promise<ApiResponse> {
    try {
      return await this.request(API_ENDPOINTS.CANCEL_ORDER(id), {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
    } catch (error) {
      console.error("Cancel order API error:", error);
      throw error;
    }
  }

  // Wishlist API Methods
  async getWishlist(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("wishlist", "true");

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = `${API_ENDPOINTS.PRODUCTS}?${queryString}`;

      return await this.request<PaginatedResponse<Product>>(endpoint);
    } catch (error) {
      console.error("Get wishlist API error:", error);
      throw error;
    }
  }

  async addToWishlist(productId: string): Promise<ApiResponse> {
    try {
      return await this.request(API_ENDPOINTS.ADD_TO_WISHLIST(productId), {
        method: "POST",
      });
    } catch (error) {
      console.error("Add to wishlist API error:", error);
      throw error;
    }
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse> {
    try {
      return await this.request(API_ENDPOINTS.REMOVE_FROM_WISHLIST(productId), {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Remove from wishlist API error:", error);
      throw error;
    }
  }

  // Utility Methods
  isAuthenticated(): boolean {
    try {
      return !!this.getAuthToken();
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  clearAuthToken(): void {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing auth token:", error);
    }
  }

  setAuthToken(token: string): void {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error setting auth token:", error);
    }
  }

  setUser(user: User): void {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export { ApiService };
