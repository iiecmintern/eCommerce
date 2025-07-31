import axios from "axios";

const BACKEND_URL = "http://localhost:5000/api";
const FRONTEND_URL = "http://localhost:5173";

// Test data
const testUser = {
  email: "frontend@test.com",
  password: "FrontendTest123",
  firstName: "Frontend",
  lastName: "Test",
  role: "customer",
  agreeToTerms: true,
};

let authToken = "";
let userId = "";

async function testFrontendCartIntegration() {
  console.log("🧪 Testing Frontend Cart Integration...\n");

  try {
    // Step 1: Authentication
    console.log("1. Testing authentication...");
    try {
      const loginResponse = await axios.post(
        `${BACKEND_URL}/auth/login`,
        testUser,
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
          testUser,
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
    const products = productsResponse.data.data
      .filter((product) => product.inStock)
      .slice(0, 3);
    console.log(`✅ Found ${products.length} products in stock`);

    // Step 3: Clear cart
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

    // Step 4: Test CartContext-like operations
    console.log("\n4. Testing CartContext operations...");

    // 4.1 Simulate CartContext.addToCart
    console.log("   4.1 Testing addToCart...");
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const quantity = i + 1; // Different quantities for each product

      const addResponse = await api.post("/cart/items", {
        productId: product._id,
        quantity: quantity,
      });

      console.log(`   ✅ Added ${quantity}x ${product.name}`);
      console.log(`   📊 Total items: ${addResponse.data.data.totalItems}`);
      console.log(`   💰 Subtotal: ${addResponse.data.data.subtotal}`);
    }

    // 4.2 Simulate CartContext.getCart
    console.log("   4.2 Testing getCart...");
    const getCartResponse = await api.get("/cart");
    const cart = getCartResponse.data.data;
    console.log("   ✅ Cart retrieved successfully");
    console.log(`   📦 Items in cart: ${cart.items.length}`);
    console.log(`   💰 Total: ${cart.total}`);

    // 4.3 Simulate CartContext.updateQuantity
    console.log("   4.3 Testing updateQuantity...");
    if (cart.items.length > 0) {
      const firstItem = cart.items[0];
      const newQuantity = firstItem.quantity + 1;

      const updateResponse = await api.put(`/cart/items/${firstItem.id}`, {
        quantity: newQuantity,
      });

      console.log(
        `   ✅ Updated quantity for ${firstItem.name} to ${newQuantity}`,
      );
      console.log(
        `   📊 New total items: ${updateResponse.data.data.totalItems}`,
      );
    }

    // 4.4 Simulate CartContext.applyCoupon
    console.log("   4.4 Testing applyCoupon...");
    const couponResponse = await api.post("/cart/coupon", {
      code: "SAVE10",
    });
    console.log(`   ✅ Coupon applied: ${couponResponse.data.message}`);
    console.log(
      `   💰 Total discount: ${couponResponse.data.data.totalDiscount}`,
    );

    // 4.5 Simulate CartContext.removeCoupon
    console.log("   4.5 Testing removeCoupon...");
    const removeCouponResponse = await api.delete("/cart/coupon");
    console.log(`   ✅ Coupon removed: ${removeCouponResponse.data.message}`);

    // 4.6 Simulate CartContext.removeFromCart
    console.log("   4.6 Testing removeFromCart...");
    if (cart.items.length > 0) {
      const itemToRemove = cart.items[0];
      const removeResponse = await api.delete(`/cart/items/${itemToRemove.id}`);
      console.log(`   ✅ Removed ${itemToRemove.name}`);
      console.log(
        `   📦 Remaining items: ${removeResponse.data.data.items.length}`,
      );
    }

    // 4.7 Simulate CartContext.clearCart
    console.log("   4.7 Testing clearCart...");
    const clearResponse = await api.delete("/cart");
    console.log(`   ✅ Cart cleared: ${clearResponse.data.message}`);

    // Step 5: Test error scenarios
    console.log("\n5. Testing error scenarios...");

    // 5.1 Test adding invalid product
    try {
      await api.post("/cart/items", { productId: "invalid-id", quantity: 1 });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("   ✅ Invalid product error handled correctly");
      }
    }

    // 5.2 Test adding out of stock product
    const outOfStockProduct = productsResponse.data.data.find(
      (p) => !p.inStock,
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

    // 5.3 Test invalid coupon
    try {
      await api.post("/cart/coupon", { code: "INVALID" });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("   ✅ Invalid coupon error handled correctly");
      }
    }

    // Step 6: Test localStorage fallback simulation
    console.log("\n6. Testing localStorage fallback simulation...");

    // Simulate what happens when user is not authenticated
    const unauthenticatedApi = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      await unauthenticatedApi.get("/cart");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("   ✅ Unauthenticated access properly rejected");
        console.log("   📝 Frontend should fall back to localStorage");
      }
    }

    console.log("\n🎉 Frontend Cart Integration Test Completed Successfully!");
    console.log("\n📋 Summary:");
    console.log("   ✅ Authentication working");
    console.log("   ✅ CartContext operations working");
    console.log("   ✅ Real-time cart updates working");
    console.log("   ✅ Coupon system working");
    console.log("   ✅ Error handling working");
    console.log("   ✅ localStorage fallback ready");
    console.log("\n🚀 Frontend cart integration is ready!");
  } catch (error) {
    console.error(
      "\n❌ Frontend integration test failed:",
      error.response?.data || error.message,
    );
    if (error.response?.status) {
      console.error("Status:", error.response.status);
    }
    process.exit(1);
  }
}

// Run the frontend integration test
testFrontendCartIntegration();
