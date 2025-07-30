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
    return localStorage.getItem("authToken");
  }

  // Helper method to create headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Helper method to make API requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
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

    try {
      const response = await fetch(url, config);
      console.log("API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error("API request failed:", error);
      console.error("Request details:", { url, config });
      throw error;
    }
  }

  // Authentication API Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.LOGOUT, {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.GET_ME);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Products API Methods
  async getProducts(
    params?: PaginationParams & ProductFilters,
  ): Promise<PaginatedResponse<Product>> {
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

    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
  }

  async getProductsByCategory(
    category: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
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

    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(API_ENDPOINTS.FEATURED_PRODUCTS);
  }

  async searchProducts(
    query: string,
    params?: PaginationParams & ProductFilters,
  ): Promise<PaginatedResponse<Product>> {
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

    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async getProductCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(API_ENDPOINTS.PRODUCT_CATEGORIES);
  }

  // Vendor Product Management
  async getMyProducts(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
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

    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async createProduct(
    productData: ProductCreateRequest,
  ): Promise<ApiResponse<Product>> {
    return this.request<Product>(API_ENDPOINTS.PRODUCTS, {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(
    id: string,
    productData: ProductUpdateRequest,
  ): Promise<ApiResponse<Product>> {
    return this.request<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.PRODUCT_BY_ID(id), {
      method: "DELETE",
    });
  }

  async updateProductStatus(
    id: string,
    status: "draft" | "published" | "archived",
  ): Promise<ApiResponse<Product>> {
    return this.request<Product>(API_ENDPOINTS.PRODUCT_STATUS(id), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateProductStock(
    id: string,
    stockQuantity: number,
  ): Promise<ApiResponse<Product>> {
    return this.request<Product>(API_ENDPOINTS.PRODUCT_STOCK(id), {
      method: "PATCH",
      body: JSON.stringify({ stockQuantity }),
    });
  }

  // Stores API Methods
  async getStores(
    params?: PaginationParams & StoreFilters,
  ): Promise<PaginatedResponse<Store>> {
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

    return this.request<PaginatedResponse<Store>>(endpoint);
  }

  async getStore(id: string): Promise<ApiResponse<Store>> {
    return this.request<Store>(API_ENDPOINTS.STORE_BY_ID(id));
  }

  async getFeaturedStores(): Promise<ApiResponse<Store[]>> {
    return this.request<Store[]>(API_ENDPOINTS.FEATURED_STORES);
  }

  async searchStores(
    query: string,
    params?: PaginationParams & StoreFilters,
  ): Promise<PaginatedResponse<Store>> {
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

    return this.request<PaginatedResponse<Store>>(endpoint);
  }

  async getStoreProducts(
    storeId: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> {
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

    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  // Vendor Store Management
  async getMyStore(): Promise<ApiResponse<Store>> {
    return this.request<Store>(API_ENDPOINTS.MY_STORE);
  }

  async createStore(
    storeData: StoreCreateRequest,
  ): Promise<ApiResponse<Store>> {
    return this.request<Store>(API_ENDPOINTS.STORES, {
      method: "POST",
      body: JSON.stringify(storeData),
    });
  }

  async updateStore(
    id: string,
    storeData: StoreUpdateRequest,
  ): Promise<ApiResponse<Store>> {
    return this.request<Store>(API_ENDPOINTS.STORE_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(storeData),
    });
  }

  async updateStoreStatus(
    id: string,
    status: "active" | "inactive" | "suspended",
  ): Promise<ApiResponse<Store>> {
    return this.request<Store>(API_ENDPOINTS.STORE_STATUS(id), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Admin Store Management
  async getAllStoresForAdmin(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Store>> {
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

    return this.request<PaginatedResponse<Store>>(endpoint);
  }

  async verifyStore(id: string): Promise<ApiResponse<Store>> {
    return this.request<Store>(API_ENDPOINTS.VERIFY_STORE(id), {
      method: "PATCH",
    });
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  clearAuthToken(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export { ApiService };
