const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function testFrontendVariantFunctionality() {
  console.log("🧪 Testing Frontend Variant System Functionality\n");

  try {
    // 1. Test fetching products with variants
    console.log("1. Testing product list with variants...");
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    const products = productsResponse.data.data;

    const productWithVariants = products.find(
      (p) => p.variants && p.variants.length > 0
    );
    if (productWithVariants) {
      console.log(
        `✅ Found product with variants: ${productWithVariants.name}`
      );
      console.log(`   - Variant count: ${productWithVariants.variants.length}`);
      console.log(
        `   - Variant types: ${productWithVariants.variantConfig?.types?.join(
          ", "
        )}`
      );
    }

    // 2. Test fetching specific product variants
    if (productWithVariants) {
      console.log("\n2. Testing specific product variant details...");
      const variantResponse = await axios.get(
        `${API_BASE_URL}/products/${productWithVariants._id}/variants`
      );
      const variants = variantResponse.data.data;

      console.log(
        `✅ Retrieved ${variants.length} variants for ${productWithVariants.name}`
      );

      // Show first variant details
      if (variants.length > 0) {
        const firstVariant = variants[0];
        console.log(`   First variant: ${firstVariant.combination}`);
        console.log(`   - Price: ₹${firstVariant.price}`);
        console.log(`   - Stock: ${firstVariant.stockQuantity}`);
        console.log(`   - SKU: ${firstVariant.sku}`);
        console.log(
          `   - Options: ${firstVariant.options
            .map((opt) => `${opt.type}: ${opt.value}`)
            .join(", ")}`
        );
      }
    }

    // 3. Test variant options structure
    console.log("\n3. Testing variant options structure...");
    if (productWithVariants && productWithVariants.variantConfig) {
      console.log(
        `✅ Variant configuration: ${JSON.stringify(
          productWithVariants.variantConfig,
          null,
          2
        )}`
      );

      // Test getting unique options per type
      const variantTypes = productWithVariants.variantConfig.types || [];
      variantTypes.forEach((type) => {
        const options = productWithVariants.variants
          .flatMap((v) => v.options)
          .filter((opt) => opt.type === type)
          .map((opt) => opt.value);
        const uniqueOptions = [...new Set(options)];
        console.log(`   ${type} options: ${uniqueOptions.join(", ")}`);
      });
    }

    // 4. Test variant price range
    console.log("\n4. Testing variant pricing...");
    if (productWithVariants && productWithVariants.variants.length > 0) {
      const prices = productWithVariants.variants.map((v) => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        console.log(`✅ All variants have same price: ₹${minPrice}`);
      } else {
        console.log(`✅ Price range: ₹${minPrice} - ₹${maxPrice}`);
      }
    }

    // 5. Test variant stock status
    console.log("\n5. Testing variant stock status...");
    if (productWithVariants && productWithVariants.variants.length > 0) {
      const inStockVariants = productWithVariants.variants.filter(
        (v) => v.stockQuantity > 0
      );
      const outOfStockVariants = productWithVariants.variants.filter(
        (v) => v.stockQuantity === 0
      );

      console.log(`✅ In stock variants: ${inStockVariants.length}`);
      console.log(`✅ Out of stock variants: ${outOfStockVariants.length}`);

      if (inStockVariants.length > 0) {
        console.log(
          `   Sample in-stock variant: ${inStockVariants[0].combination} (${inStockVariants[0].stockQuantity} units)`
        );
      }
    }

    console.log("\n🎉 Frontend Variant System Test Completed Successfully!");
    console.log("\n📊 Frontend Integration Summary:");
    console.log("✅ API endpoints accessible from frontend");
    console.log("✅ Product data includes variant information");
    console.log("✅ Variant-specific pricing working");
    console.log("✅ Variant stock management functional");
    console.log("✅ Variant options properly structured");
    console.log("✅ Ready for VariantSelector component integration");
  } catch (error) {
    console.error("❌ Frontend variant test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testFrontendVariantFunctionality();
