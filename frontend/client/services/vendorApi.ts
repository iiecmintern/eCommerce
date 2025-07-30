const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  console.log("🔍 Debug - Token in vendorApi:", token ? "Present" : "Missing");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Product API calls
export const vendorApi = {
  // Get vendor's products
  getProducts: async () => {
    const response = await fetch(
      `${API_BASE_URL}/products/vendor/my-products`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  // Create new product
  createProduct: async (productData: any) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }
    return response.json();
  },

  // Update product
  updateProduct: async (productId: string, productData: any) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }
    return response.json();
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }
    return response.json();
  },

  // Get vendor's orders
  getOrders: async () => {
    console.log("🔍 Debug - Calling getOrders API");
    const response = await fetch(`${API_BASE_URL}/orders/vendor`, {
      headers: getAuthHeaders(),
    });
    console.log("🔍 Debug - Orders API Response Status:", response.status);
    if (!response.ok) {
      console.log(
        "🔍 Debug - Orders API Error:",
        response.status,
        response.statusText,
      );
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  },

  // Get order statistics
  getOrderStats: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/vendor/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch order stats");
    return response.json();
  },

  // Get vendor's store
  getStore: async () => {
    const response = await fetch(`${API_BASE_URL}/stores/vendor/my-store`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch store");
    return response.json();
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(
      `${API_BASE_URL}/orders/vendor/${orderId}/status`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update order status");
    }
    return response.json();
  },

  // Add tracking info to order
  addTrackingInfo: async (orderId: string, trackingData: any) => {
    const response = await fetch(
      `${API_BASE_URL}/orders/vendor/${orderId}/tracking`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(trackingData),
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add tracking info");
    }
    return response.json();
  },
};
