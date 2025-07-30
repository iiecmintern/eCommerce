const axios = require("axios");

const API_BASE = "http://localhost:5000";

// Test login and get token
const testLogin = async () => {
  try {
    console.log("🔐 Testing login...");

    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: "customer@test.com",
      password: "Customer@123",
    });

    console.log("Login response:", JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.data.success) {
      console.log("✅ Login successful");
      return loginResponse.data.token || loginResponse.data.data?.token;
    } else {
      console.log("❌ Login failed:", loginResponse.data.message);
      return null;
    }
  } catch (error) {
    console.log(
      "❌ Login error:",
      error.response?.data?.message || error.message
    );
    return null;
  }
};

// Test getting products
const testGetProducts = async (token) => {
  try {
    console.log("\n📦 Testing get products...");

    const response = await axios.get(`${API_BASE}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      console.log("✅ Products retrieved successfully");
      console.log(`Found ${response.data.data.length} products`);
      return response.data.data;
    } else {
      console.log("❌ Failed to get products:", response.data.message);
      return [];
    }
  } catch (error) {
    console.log(
      "❌ Get products error:",
      error.response?.data?.message || error.message
    );
    return [];
  }
};

// Test creating an order
const testCreateOrder = async (token, products) => {
  try {
    console.log("\n🛒 Testing order creation...");

    if (products.length === 0) {
      console.log("❌ No products available for order");
      return null;
    }

    const product = products[0]; // Use first product

    const orderData = {
      items: [
        {
          productId: product._id,
          quantity: 2,
        },
      ],
      shippingAddress: {
        name: "Test Customer",
        phone: "9876543211",
        email: "customer@test.com",
        street: "123 Test Street",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
      },
      paymentMethod: "cod",
      notes: {
        customer: "Test order from API",
      },
    };

    const response = await axios.post(`${API_BASE}/api/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      console.log("✅ Order created successfully!");
      console.log("Order ID:", response.data.data.id);
      console.log("Order Number:", response.data.data.orderNumber);
      return response.data.data;
    } else {
      console.log("❌ Failed to create order:", response.data.message);
      return null;
    }
  } catch (error) {
    console.log(
      "❌ Create order error:",
      error.response?.data?.message || error.message
    );
    if (error.response?.data?.errors) {
      console.log("Validation errors:", error.response.data.errors);
    }
    if (error.response?.data) {
      console.log(
        "Full error response:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
    return null;
  }
};

// Test getting orders
const testGetOrders = async (token) => {
  try {
    console.log("\n📋 Testing get orders...");

    const response = await axios.get(`${API_BASE}/api/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      console.log("✅ Orders retrieved successfully");
      console.log(`Found ${response.data.data.length} orders`);
      return response.data.data;
    } else {
      console.log("❌ Failed to get orders:", response.data.message);
      return [];
    }
  } catch (error) {
    console.log(
      "❌ Get orders error:",
      error.response?.data?.message || error.message
    );
    return [];
  }
};

// Main test function
const runTests = async () => {
  console.log("🚀 Starting API Tests...\n");

  // Test login
  const token = await testLogin();
  if (!token) {
    console.log("❌ Cannot proceed without authentication");
    return;
  }

  // Test get products
  const products = await testGetProducts(token);

  // Test create order
  const order = await testCreateOrder(token, products);

  // Test get orders
  const orders = await testGetOrders(token);

  console.log("\n✅ API tests completed!");
};

runTests().catch(console.error);
