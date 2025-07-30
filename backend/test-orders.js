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

// Test order creation
const testOrderCreation = async () => {
  try {
    console.log("\n=== TESTING ORDER MANAGEMENT SYSTEM ===");

    // Get a customer user
    const customer = await User.findOne({ role: "customer" });
    if (!customer) {
      console.log("❌ No customer found in database");
      return;
    }
    console.log("✅ Customer found:", customer.email);

    // Get a product from our test data
    const product = await Product.findOne({
      status: "active",
      isPublished: true,
      name: { $regex: /^Test/ }, // Get products that start with "Test"
    });
    if (!product) {
      console.log("❌ No active product found in database");
      return;
    }
    console.log("✅ Product found:", product.name);

    // Get the store
    const store = await Store.findById(product.store);
    if (!store) {
      console.log("❌ Store not found for product");
      return;
    }
    console.log("✅ Store found:", store.name);

    // Create a test order
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
          phone: "9876543210",
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
          phone: "9876543210",
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
        customer: "Test order from script",
      },
    };

    const order = new Order(orderData);
    await order.save();

    console.log("✅ Test order created successfully!");
    console.log("Order ID:", order._id);
    console.log("Order Number:", order.orderNumber);
    console.log("Total Amount:", order.pricing.total);

    // Test order retrieval
    const retrievedOrder = await Order.findById(order._id)
      .populate("customer", "firstName lastName email")
      .populate("vendor", "firstName lastName")
      .populate("store", "name")
      .populate("items.product", "name price");

    console.log("\n✅ Order retrieved successfully!");
    console.log(
      "Customer:",
      retrievedOrder.customer.firstName + " " + retrievedOrder.customer.lastName
    );
    console.log("Store:", retrievedOrder.store.name);
    console.log("Status:", retrievedOrder.status);

    // Test order status update
    await retrievedOrder.updateStatus(
      "confirmed",
      "Order confirmed by test script",
      customer._id
    );
    console.log("✅ Order status updated to 'confirmed'");

    // Test payment status update
    retrievedOrder.payment.status = "completed";
    retrievedOrder.payment.transactionId = "TEST_TXN_123";
    retrievedOrder.payment.gateway = "test_gateway";
    retrievedOrder.payment.paidAt = new Date();
    await retrievedOrder.save();
    console.log("✅ Payment status updated to 'completed'");

    // Test tracking info
    await retrievedOrder.addTracking({
      trackingNumber: "TRACK123456",
      trackingUrl: "https://tracking.example.com/TRACK123456",
      carrier: "Test Courier",
    });
    console.log("✅ Tracking information added");

    // Get order statistics
    const stats = await Order.aggregate([
      { $match: { vendor: store.vendor } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$pricing.total" },
        },
      },
    ]);

    console.log("\n📊 Order Statistics:");
    stats.forEach((stat) => {
      console.log(`${stat._id}: ${stat.count} orders, ₹${stat.totalAmount}`);
    });

    // Clean up - delete test order
    await Order.findByIdAndDelete(order._id);
    console.log("\n🧹 Test order cleaned up");
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await testOrderCreation();
  await mongoose.disconnect();
  console.log("\n✅ Order management test completed");
};

main().catch(console.error);
