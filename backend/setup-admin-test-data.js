const mongoose = require("mongoose");
const User = require("./models/user/User");
const Store = require("./models/store/Store");
const Order = require("./models/order/Order");
const Product = require("./models/product/Product");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    return false;
  }
};

const setupAdminTestData = async () => {
  try {
    console.log("🚀 Setting up admin dashboard test data...\n");

    // Create test users
    const testUsers = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@test.com",
        password: "TestPassword123",
        role: "vendor",
        isActive: true,
        agreeToTerms: true,
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@test.com",
        password: "TestPassword123",
        role: "vendor",
        isActive: true,
        agreeToTerms: true,
      },
      {
        firstName: "Mike",
        lastName: "Wilson",
        email: "mike.wilson@test.com",
        password: "TestPassword123",
        role: "vendor",
        isActive: true,
        agreeToTerms: true,
      },
      {
        firstName: "Emma",
        lastName: "Davis",
        email: "emma.davis@test.com",
        password: "TestPassword123",
        role: "customer",
        isActive: true,
        agreeToTerms: true,
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@test.com",
        password: "TestPassword123",
        role: "customer",
        isActive: true,
        agreeToTerms: true,
      },
    ];

    console.log("📝 Creating test users...");
    const createdUsers = [];
    for (const userData of testUsers) {
      try {
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
          const user = new User(userData);
          await user.save();
          createdUsers.push(user);
          console.log(`   ✅ Created user: ${user.firstName} ${user.lastName}`);
        } else {
          createdUsers.push(existingUser);
          console.log(`   ⚠️ User already exists: ${userData.email}`);
        }
      } catch (error) {
        console.log(`   ❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    // Create test stores with proper contact information
    const testStores = [
      {
        name: "TechGadgets Pro",
        description: "Premium technology gadgets and accessories",
        category: "Electronics",
        status: "active",
        totalRevenue: 24392,
        logo: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
        contact: {
          email: "contact@techgadgetspro.com",
          phone: "+1-555-0123",
          website: "https://techgadgetspro.com",
        },
        address: {
          street: "123 Tech Street",
          city: "San Francisco",
          state: "CA",
          pincode: "94102",
          country: "USA",
        },
      },
      {
        name: "Fashion Forward",
        description: "Trendy fashion and lifestyle products",
        category: "Fashion",
        status: "active",
        totalRevenue: 18847,
        logo: "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg",
        contact: {
          email: "hello@fashionforward.com",
          phone: "+1-555-0124",
          website: "https://fashionforward.com",
        },
        address: {
          street: "456 Fashion Ave",
          city: "New York",
          state: "NY",
          pincode: "10001",
          country: "USA",
        },
      },
      {
        name: "Home & Garden Plus",
        description: "Everything for your home and garden",
        category: "Home & Garden",
        status: "active",
        totalRevenue: 31294,
        logo: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
        contact: {
          email: "info@homegardenplus.com",
          phone: "+1-555-0125",
          website: "https://homegardenplus.com",
        },
        address: {
          street: "789 Garden Lane",
          city: "Los Angeles",
          state: "CA",
          pincode: "90210",
          country: "USA",
        },
      },
      {
        name: "Books & More",
        description: "Books, stationery, and educational materials",
        category: "Books",
        status: "pending",
        totalRevenue: 0,
        logo: "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg",
        contact: {
          email: "books@booksandmore.com",
          phone: "+1-555-0126",
          website: "https://booksandmore.com",
        },
        address: {
          street: "321 Book Street",
          city: "Chicago",
          state: "IL",
          pincode: "60601",
          country: "USA",
        },
      },
      {
        name: "Sports & Fitness",
        description: "Sports equipment and fitness gear",
        category: "Sports",
        status: "active",
        totalRevenue: 15678,
        logo: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
        contact: {
          email: "fitness@sportsfitness.com",
          phone: "+1-555-0127",
          website: "https://sportsfitness.com",
        },
        address: {
          street: "654 Fitness Blvd",
          city: "Miami",
          state: "FL",
          pincode: "33101",
          country: "USA",
        },
      },
    ];

    console.log("\n🏪 Creating test stores...");
    const createdStores = [];
    const vendorUsers = createdUsers.filter(user => user.role === "vendor");
    
    for (let i = 0; i < testStores.length; i++) {
      try {
        const storeData = testStores[i];
        const owner = vendorUsers[i % vendorUsers.length];
        
        const existingStore = await Store.findOne({ name: storeData.name });
        if (!existingStore) {
          const store = new Store({
            ...storeData,
            owner: owner._id,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          });
          await store.save();
          createdStores.push(store);
          console.log(`   ✅ Created store: ${store.name} (Owner: ${owner.firstName} ${owner.lastName})`);
        } else {
          createdStores.push(existingStore);
          console.log(`   ⚠️ Store already exists: ${storeData.name}`);
        }
      } catch (error) {
        console.log(`   ❌ Error creating store ${testStores[i].name}:`, error.message);
      }
    }

    // Create test products with proper image structure
    const testProducts = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        originalPrice: 249.99,
        category: "Electronics",
        stockQuantity: 50,
        trackInventory: true,
        images: [{
          url: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
          alt: "Wireless Bluetooth Headphones"
        }],
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitor",
        price: 299.99,
        originalPrice: 399.99,
        category: "Electronics",
        stockQuantity: 25,
        trackInventory: true,
        images: [{
          url: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
          alt: "Smart Fitness Watch"
        }],
      },
      {
        name: "Designer T-Shirt",
        description: "Premium cotton designer t-shirt",
        price: 49.99,
        originalPrice: 79.99,
        category: "Fashion",
        stockQuantity: 100,
        trackInventory: true,
        images: [{
          url: "https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg",
          alt: "Designer T-Shirt"
        }],
      },
      {
        name: "Garden Tool Set",
        description: "Complete garden maintenance tool set",
        price: 89.99,
        originalPrice: 129.99,
        category: "Home & Garden",
        stockQuantity: 30,
        trackInventory: true,
        images: [{
          url: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg",
          alt: "Garden Tool Set"
        }],
      },
    ];

    console.log("\n📦 Creating test products...");
    const createdProducts = [];
    for (let i = 0; i < testProducts.length; i++) {
      try {
        const productData = testProducts[i];
        const store = createdStores[i % createdStores.length];
        
        const existingProduct = await Product.findOne({ name: productData.name });
        if (!existingProduct) {
          const product = new Product({
            ...productData,
            store: store._id,
            vendor: store.owner,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          });
          await product.save();
          createdProducts.push(product);
          console.log(`   ✅ Created product: ${product.name} (Store: ${store.name})`);
        } else {
          createdProducts.push(existingProduct);
          console.log(`   ⚠️ Product already exists: ${productData.name}`);
        }
      } catch (error) {
        console.log(`   ❌ Error creating product ${testProducts[i].name}:`, error.message);
      }
    }

    // Create test orders with proper structure
    const testOrders = [
      {
        orderNumber: "ORD-2024-001",
        status: "confirmed",
        total: 199.99,
        items: [
          {
            product: createdProducts[0]._id,
            quantity: 1,
            unitPrice: 199.99,
            totalPrice: 199.99,
          },
        ],
        payment: {
          method: "credit_card",
          amount: 199.99,
          status: "completed",
        },
        shipping: {
          address: {
            name: "Emma Davis",
            phone: "+1-555-0001",
            street: "123 Customer St",
            city: "San Francisco",
            state: "CA",
            pincode: "94102",
            country: "USA",
          },
          method: "standard",
          cost: 0,
        },
        pricing: {
          subtotal: 199.99,
          total: 199.99,
          tax: 0,
          shipping: 0,
        },
      },
      {
        orderNumber: "ORD-2024-002",
        status: "shipped",
        total: 299.99,
        items: [
          {
            product: createdProducts[1]._id,
            quantity: 1,
            unitPrice: 299.99,
            totalPrice: 299.99,
          },
        ],
        payment: {
          method: "paypal",
          amount: 299.99,
          status: "completed",
        },
        shipping: {
          address: {
            name: "David Brown",
            phone: "+1-555-0002",
            street: "456 Customer Ave",
            city: "New York",
            state: "NY",
            pincode: "10001",
            country: "USA",
          },
          method: "express",
          cost: 10,
        },
        pricing: {
          subtotal: 299.99,
          total: 309.99,
          tax: 0,
          shipping: 10,
        },
      },
    ];

    console.log("\n📋 Creating test orders...");
    const customerUsers = createdUsers.filter(user => user.role === "customer");
    
    for (let i = 0; i < testOrders.length; i++) {
      try {
        const orderData = testOrders[i];
        const customer = customerUsers[i % customerUsers.length];
        const store = createdStores[i % createdStores.length];
        
        const existingOrder = await Order.findOne({ orderNumber: orderData.orderNumber });
        if (!existingOrder) {
          const order = new Order({
            ...orderData,
            customer: customer._id,
            store: store._id,
            vendor: store.owner,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          });
          await order.save();
          console.log(`   ✅ Created order: ${order.orderNumber} (Customer: ${customer.firstName} ${customer.lastName})`);
        } else {
          console.log(`   ⚠️ Order already exists: ${orderData.orderNumber}`);
        }
      } catch (error) {
        console.log(`   ❌ Error creating order ${testOrders[i].orderNumber}:`, error.message);
      }
    }

    console.log("\n🎉 Admin dashboard test data setup completed!");
    console.log("\n📊 Summary:");
    console.log(`   👥 Users created: ${createdUsers.length}`);
    console.log(`   🏪 Stores created: ${createdStores.length}`);
    console.log(`   📦 Products created: ${createdProducts.length}`);
    console.log(`   📋 Orders created: ${testOrders.length}`);
    console.log("\n🚀 Admin dashboard is now ready with real data!");

  } catch (error) {
    console.error("❌ Error setting up admin test data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the setup
connectDB().then(() => {
  setupAdminTestData();
}); 