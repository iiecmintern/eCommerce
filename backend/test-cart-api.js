const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";
let authToken = "";
let userId = "";

// Test data
const testUser = {
  email: "test@example.com",
  password: "TestPassword123",
  firstName: "Test",
  lastName: "User",
  role: "customer",
  agreeToTerms: true,
};

const testProduct = {
  name: "Test Product",
  price: 999,
  originalPrice: 1299,
  description: "A test product for cart API testing",
  category: "Electronics",
  inStock: true,
  maxQuantity: 10,
};

async function testCartAPI() {
  console.log("🧪 Testing Cart API...\n");

  try {
    // Step 1: Register/Login user
    console.log("1. Testing user authentication...");
    try {
      const loginResponse = await axios.post(
        `${BASE_URL}/auth/login`,
        testUser
      );
      authToken = loginResponse.data.token;
      userId = loginResponse.data.user._id;
      console.log("✅ Login successful");
    } catch (error) {
      if (error.response?.status === 401) {
        // Try to register if login fails
        console.log("⚠️ Login failed, trying registration...");
        const registerResponse = await axios.post(
          `${BASE_URL}/auth/register`,
          testUser
        );
        console.log("Registration response:", registerResponse.data);
        authToken = registerResponse.data.token;
        userId = registerResponse.data.user._id;
        console.log("✅ Registration successful");
      } else {
        throw error;
      }
    }

    // Set up axios with auth token
    const api = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    // Step 2: Create a test product
    console.log("\n2. Creating test product...");
    const productResponse = await api.post("/products", testProduct);
    const productId = productResponse.data._id;
    console.log("✅ Test product created:", productId);

    // Step 3: Test get cart (should be empty initially)
    console.log("\n3. Testing get cart...");
    const getCartResponse = await api.get("/cart");
    console.log("✅ Cart retrieved:", getCartResponse.data);
    console.log("   Items count:", getCartResponse.data.data.items.length);

    // Step 4: Test add item to cart
    console.log("\n4. Testing add item to cart...");
    const addItemResponse = await api.post("/cart/items", {
      productId: productId,
      quantity: 2,
    });
    console.log("✅ Item added to cart:", addItemResponse.data.message);
    console.log("   Total items:", addItemResponse.data.data.totalItems);

    // Step 5: Test get cart again (should have items)
    console.log("\n5. Testing get cart after adding item...");
    const getCartResponse2 = await api.get("/cart");
    console.log(
      "✅ Cart retrieved:",
      getCartResponse2.data.data.items.length,
      "items"
    );
    console.log("   Subtotal:", getCartResponse2.data.data.subtotal);

    // Step 6: Test update item quantity
    console.log("\n6. Testing update item quantity...");
    const updateResponse = await api.put(`/cart/items/${productId}`, {
      quantity: 3,
    });
    console.log("✅ Item quantity updated:", updateResponse.data.message);
    console.log("   New total items:", updateResponse.data.data.totalItems);

    // Step 7: Test apply coupon
    console.log("\n7. Testing apply coupon...");
    const couponResponse = await api.post("/cart/coupon", {
      code: "SAVE10",
    });
    console.log("✅ Coupon applied:", couponResponse.data.message);
    console.log("   Total discount:", couponResponse.data.data.totalDiscount);

    // Step 8: Test remove coupon
    console.log("\n8. Testing remove coupon...");
    const removeCouponResponse = await api.delete("/cart/coupon");
    console.log("✅ Coupon removed:", removeCouponResponse.data.message);

    // Step 9: Test remove item from cart
    console.log("\n9. Testing remove item from cart...");
    const removeItemResponse = await api.delete(`/cart/items/${productId}`);
    console.log("✅ Item removed from cart:", removeItemResponse.data.message);
    console.log(
      "   Remaining items:",
      removeItemResponse.data.data.items.length
    );

    // Step 10: Test clear cart
    console.log("\n10. Testing clear cart...");
    const clearCartResponse = await api.delete("/cart");
    console.log("✅ Cart cleared:", clearCartResponse.data.message);

    // Step 11: Verify cart is empty
    console.log("\n11. Verifying cart is empty...");
    const finalCartResponse = await api.get("/cart");
    console.log(
      "✅ Final cart state:",
      finalCartResponse.data.data.items.length,
      "items"
    );

    console.log("\n🎉 All cart API tests passed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.response?.data || error.message);
    if (error.response?.status) {
      console.error("Status:", error.response.status);
    }
    process.exit(1);
  }
}

// Run the tests
testCartAPI();
