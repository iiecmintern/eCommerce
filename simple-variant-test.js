const https = require("https");
const http = require("http");

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

async function testVariants() {
  console.log("🧪 Simple Variant System Test\n");

  try {
    // Test 1: Get products
    console.log("1. Testing product list...");
    const products = await makeRequest("http://localhost:5000/api/products");
    console.log(`✅ Found ${products.data.length} products`);

    // Test 2: Find product with variants
    const productWithVariants = products.data.find(
      (p) => p.variants && p.variants.length > 0
    );
    if (productWithVariants) {
      console.log(
        `✅ Found product with variants: ${productWithVariants.name}`
      );
      console.log(`   - Variant count: ${productWithVariants.variants.length}`);
      console.log(
        `   - First variant: ${productWithVariants.variants[0].combination}`
      );
      console.log(`   - Price: ₹${productWithVariants.variants[0].price}`);
    }

    // Test 3: Test specific variant endpoint
    if (productWithVariants) {
      console.log("\n2. Testing variant endpoint...");
      const variants = await makeRequest(
        `http://localhost:5000/api/products/${productWithVariants._id}/variants`
      );
      console.log(`✅ Retrieved ${variants.data.length} variants`);

      if (variants.data.length > 0) {
        const variant = variants.data[0];
        console.log(`   - Combination: ${variant.combination}`);
        console.log(`   - SKU: ${variant.sku}`);
        console.log(`   - Stock: ${variant.stockQuantity}`);
        console.log(
          `   - Options: ${variant.options
            .map((o) => `${o.type}:${o.value}`)
            .join(", ")}`
        );
      }
    }

    console.log("\n🎉 Variant system is working correctly!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testVariants();
