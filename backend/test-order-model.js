const mongoose = require("mongoose");
const User = require("./models/user/User");
const Product = require("./models/product/Product");
const Store = require("./models/store/Store");
const Order = require("./models/order/Order");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Test order model directly
const testOrderModel = async () => {
  try {
    console.log("\n=== TESTING ORDER MODEL DIRECTLY ===");

    // Get test data
    const customer = await User.findOne({ email: "customer@test.com" });
    const product = await Product.findOne({ name: { $regex: /^Test/ } });
    const store = await Store.findOne({ name: { $regex: /^Test/ } });

    if (!customer || !product || !store) {
      console.log("❌ Missing test data");
      console.log("Customer:", !!customer);
      console.log("Product:", !!product);
      console.log("Store:", !!store);
      return;
    }

    console.log("✅ Test data found");

    // Create order data (without orderNumber - should be auto-generated)
    const orderData = {
      orderType: "retail",
      customer: customer._id,
      store: store._id,
      vendor: store.vendor,
      items: [
        {
          product: product._id,
          quantity: 2,
          unitPrice: product.price,
          totalPrice: product.price * 2,
          gstRate: product.gstRate || 18,
          gstAmount: (product.price * 2 * (product.gstRate || 18)) / 100,
          discount: 0,
        },
      ],
      pricing: {
        subtotal: product.price * 2,
        tax: (product.price * 2 * (product.gstRate || 18)) / 100,
        shipping: 199,
        discount: 0,
        couponDiscount: 0,
        total:
          product.price * 2 +
          (product.price * 2 * (product.gstRate || 18)) / 100 +
          199,
        currency: "INR",
      },
      shipping: {
        address: {
          name: "Test Customer",
          phone: "9876543211",
          email: customer.email,
          street: "123 Test Street",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          pincode: "400001",
        },
        method: "standard",
        cost: 199,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      billing: {
        address: {
          name: "Test Customer",
          phone: "9876543211",
          email: customer.email,
          street: "123 Test Street",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          pincode: "400001",
        },
      },
      payment: {
        method: "cod",
        status: "pending",
        amount:
          product.price * 2 +
          (product.price * 2 * (product.gstRate || 18)) / 100 +
          199,
      },
      notes: {
        customer: "Test order from model test",
      },
    };

    console.log("Creating order with data:", {
      customer: orderData.customer,
      store: orderData.store,
      vendor: orderData.vendor,
      itemsCount: orderData.items.length,
    });

    // Create order
    const order = new Order(orderData);

    console.log("Order before save:", {
      orderNumber: order.orderNumber,
      hasOrderNumber: !!order.orderNumber,
    });

    await order.save();

    console.log("✅ Order created successfully!");
    console.log("Order ID:", order._id);
    console.log("Order Number:", order.orderNumber);
    console.log("Status:", order.status);

    // Clean up
    await Order.findByIdAndDelete(order._id);
    console.log("🧹 Test order cleaned up");
  } catch (error) {
    console.error("❌ Test error:", error.message);
    if (error.errors) {
      console.log("Validation errors:", Object.keys(error.errors));
      Object.keys(error.errors).forEach((key) => {
        console.log(`${key}:`, error.errors[key].message);
      });
    }
  }
};

// Main function
const main = async () => {
  await connectDB();
  await testOrderModel();
  await mongoose.disconnect();
  console.log("\n✅ Order model test completed");
};

main().catch(console.error);
