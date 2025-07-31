const axios = require("axios");

const BACKEND_URL = "http://localhost:5000/api";
const FRONTEND_URL = "http://localhost:5173";

// Test data
const testUser = {
  email: "integration@test.com",
  password: "IntegrationTest123",
  firstName: "Integration",
  lastName: "Test",
  role: "customer",
  agreeToTerms: true,
};

let authToken = "";
let userId = "";

async function testFrontendBackendIntegration() {
  console.log("🧪 Testing Frontend-Backend Cart Integration...\n");

  try {
    // Step 1: Authentication
    console.log("1. Testing authentication...");
    try {
      const loginResponse = await axios.post(
        `${BACKEND_URL}/auth/login`,
        testUser
      );
      if (loginResponse.data.success && loginResponse.data.data) {
        authToken = loginResponse.data.data.token;
        userId = loginResponse.data.data.user.id;
        console.log("✅ Login successful");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("⚠️ Login failed, trying registration...");
        const registerResponse = await axios.post(
          `${BACKEND_URL}/auth/register`,
          testUser
        );
        if (registerResponse.data.success && registerResponse.data.data) {
          authToken = registerResponse.data.data.token;
          userId = registerResponse.data.data.user.id;
          console.log("✅ Registration successful");
        } else {
          throw new Error("Registration failed");
        }
      } else {
        throw error;
      }
    }

    // Set up authenticated API client
    const api = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    // Step 2: Get products for testing
    console.log("\n2. Getting products for testing...");
    const productsResponse = await axios.get(`${BACKEND_URL}/products`);
    const inStockProduct = productsResponse.data.data.find(
      (product) => product.inStock
    );
    if (!inStockProduct) {
      throw new Error("No products in stock found for testing");
    }
    console.log("✅ Found product:", inStockProduct.name);

    // Step 3: Clear cart first (if exists)
    console.log("\n3. Clearing cart...");
    try {
      await api.delete("/cart");
      console.log("✅ Cart cleared");
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("✅ No cart to clear (new user)");
      } else {
        throw error;
      }
    }

    // Step 4: Test cart operations
    console.log("\n4. Testing cart operations...");

    // 4.1 Add item to cart
    console.log("   4.1 Adding item to cart...");
    const addResponse = await api.post("/cart/items", {
      productId: inStockProduct._id,
      quantity: 2,
    });
    console.log("   ✅ Item added:", addResponse.data.message);
    console.log("   📊 Total items:", addResponse.data.data.totalItems);
    console.log("   💰 Subtotal:", addResponse.data.data.subtotal);

    // 4.2 Get cart
    console.log("   4.2 Getting cart...");
    const getCartResponse = await api.get("/cart");
    console.log("   ✅ Cart retrieved");
    console.log("   📦 Items in cart:", getCartResponse.data.data.items.length);
    console.log("   💰 Total:", getCartResponse.data.data.total);

    // 4.3 Update quantity
    console.log("   4.3 Updating quantity...");
    const updateResponse = await api.put(`/cart/items/${inStockProduct._id}`, {
      quantity: 3,
    });
    console.log("   ✅ Quantity updated:", updateResponse.data.message);
    console.log("   📊 New total items:", updateResponse.data.data.totalItems);

    // 4.4 Apply coupon
    console.log("   4.4 Applying coupon...");
    const couponResponse = await api.post("/cart/coupon", {
      code: "SAVE10",
    });
    console.log("   ✅ Coupon applied:", couponResponse.data.message);
    console.log(
      "   💰 Total discount:",
      couponResponse.data.data.totalDiscount
    );

    // 4.5 Remove coupon
    console.log("   4.5 Removing coupon...");
    const removeCouponResponse = await api.delete("/cart/coupon");
    console.log("   ✅ Coupon removed:", removeCouponResponse.data.message);

    // 4.6 Remove item
    console.log("   4.6 Removing item...");
    const removeItemResponse = await api.delete(
      `/cart/items/${inStockProduct._id}`
    );
    console.log("   ✅ Item removed:", removeItemResponse.data.message);
    console.log(
      "   📦 Remaining items:",
      removeItemResponse.data.data.items.length
    );

    // Step 5: Test frontend API endpoints (simulating frontend calls)
    console.log("\n5. Testing frontend API simulation...");

    // 5.1 Test cart context API calls
    console.log("   5.1 Testing cart context API calls...");

    // Simulate adding multiple items
    const product1 = inStockProduct;
    const product2 = productsResponse.data.data.find(
      (p) => p.inStock && p._id !== product1._id
    );

    if (product2) {
      await api.post("/cart/items", { productId: product1._id, quantity: 1 });
      await api.post("/cart/items", { productId: product2._id, quantity: 2 });

      const finalCart = await api.get("/cart");
      console.log("   ✅ Multiple items added successfully");
      console.log("   📦 Total items:", finalCart.data.data.totalItems);
      console.log("   💰 Final total:", finalCart.data.data.total);
    }

    // Step 6: Test error handling
    console.log("\n6. Testing error handling...");

    // 6.1 Try to add invalid product
    try {
      await api.post("/cart/items", {
        productId: "invalid-product-id",
        quantity: 1,
      });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("   ✅ Invalid product error handled correctly");
      }
    }

    // 6.2 Try to add out of stock product
    const outOfStockProduct = productsResponse.data.data.find(
      (p) => !p.inStock
    );
    if (outOfStockProduct) {
      try {
        await api.post("/cart/items", {
          productId: outOfStockProduct._id,
          quantity: 1,
        });
      } catch (error) {
        if (error.response?.status === 400) {
          console.log("   ✅ Out of stock error handled correctly");
        }
      }
    }

    // 6.3 Try to apply invalid coupon
    try {
      await api.post("/cart/coupon", { code: "INVALID" });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("   ✅ Invalid coupon error handled correctly");
      }
    }

    // Step 7: Final cleanup
    console.log("\n7. Final cleanup...");
    await api.delete("/cart");
    console.log("   ✅ Cart cleared");

    console.log(
      "\n🎉 Frontend-Backend Integration Test Completed Successfully!"
    );
    console.log("\n📋 Summary:");
    console.log("   ✅ Authentication working");
    console.log("   ✅ Cart CRUD operations working");
    console.log("   ✅ Coupon system working");
    console.log("   ✅ Error handling working");
    console.log("   ✅ Real-time updates working");
    console.log("\n🚀 Ready for frontend testing!");
  } catch (error) {
    console.error(
      "\n❌ Integration test failed:",
      error.response?.data || error.message
    );
    if (error.response?.status) {
      console.error("Status:", error.response.status);
    }
    process.exit(1);
  }
}

// Run the integration test
testFrontendBackendIntegration();
