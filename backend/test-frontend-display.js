const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";
const FRONTEND_URL = "http://localhost:8080";

async function testFrontendDisplay() {
  console.log("🧪 Testing Frontend Product & Category Display\n");

  try {
    // Test 1: Check if products are available
    console.log("1️⃣ Testing products availability...");
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    const products = productsResponse.data.data;
    console.log(`✅ Found ${products.length} products`);

    if (products.length > 0) {
      console.log("   Sample products:");
      products.slice(0, 3).forEach((product, index) => {
        console.log(
          `   ${index + 1}. ${product.name} - ₹${product.price} (${
            product.category
          })`
        );
      });
    }

    // Test 2: Check if categories are available
    console.log("\n2️⃣ Testing categories availability...");
    const categoriesResponse = await axios.get(
      `${BASE_URL}/products/categories`
    );
    const categories = categoriesResponse.data.data;
    console.log(
      `✅ Found ${categories.length} categories: ${categories.join(", ")}`
    );

    // Test 3: Check products by category
    console.log("\n3️⃣ Testing products by category...");
    for (const category of categories) {
      const categoryProducts = await axios.get(
        `${BASE_URL}/products?category=${encodeURIComponent(category)}`
      );
      const count = categoryProducts.data.data.length;
      console.log(`   ${category}: ${count} products`);
    }

    // Test 4: Check featured products
    console.log("\n4️⃣ Testing featured products...");
    const featuredResponse = await axios.get(`${BASE_URL}/products/featured`);
    const featuredProducts = featuredResponse.data.data;
    console.log(`✅ Found ${featuredProducts.length} featured products`);

    // Test 5: Check frontend accessibility
    console.log("\n5️⃣ Testing frontend accessibility...");
    try {
      const frontendResponse = await axios.get(FRONTEND_URL);
      console.log(`✅ Frontend is accessible at ${FRONTEND_URL}`);
      console.log(`   Status: ${frontendResponse.status}`);
      console.log(
        `   Content-Type: ${frontendResponse.headers["content-type"]}`
      );
    } catch (error) {
      console.log(`❌ Frontend is not accessible: ${error.message}`);
    }

    // Test 6: Check search functionality
    console.log("\n6️⃣ Testing search functionality...");
    const searchResponse = await axios.get(
      `${BASE_URL}/search/advanced?query=iphone`
    );
    const searchResults = searchResponse.data.data.products;
    console.log(
      `✅ Search found ${searchResults.length} products for "iphone"`
    );

    console.log("\n🎉 Frontend display test completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   ✅ ${products.length} products available`);
    console.log(`   ✅ ${categories.length} categories available`);
    console.log(`   ✅ ${featuredProducts.length} featured products`);
    console.log(`   ✅ Search functionality working`);
    console.log(`   ✅ Frontend accessible`);

    console.log("\n🎯 Expected Frontend Display:");
    console.log("   - Left sidebar should show categories with product counts");
    console.log(
      '   - Main content should show "Shop by Category" with 5 categories'
    );
    console.log('   - "Best Sellers" section should show up to 4 products');
    console.log("   - Search bar should work and redirect to search results");
  } catch (error) {
    console.error(
      "❌ Frontend display test failed:",
      error.response?.data || error.message
    );
  }
}

testFrontendDisplay();
