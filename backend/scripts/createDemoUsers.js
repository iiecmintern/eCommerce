const mongoose = require('mongoose');
const User = require('../models/user/User');
require('dotenv').config();

const demoUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@demo.com',
    password: 'Demo123!',
    role: 'admin',
    company: 'CommerceForge',
    phone: '+1 (555) 123-4567',
    agreeToTerms: true,
    agreeToMarketing: false,
    isEmailVerified: true
  },
  {
    firstName: 'Vendor',
    lastName: 'Demo',
    email: 'vendor@demo.com',
    password: 'Demo123!',
    role: 'vendor',
    company: 'TechGadgets Pro',
    phone: '+1 (555) 234-5678',
    agreeToTerms: true,
    agreeToMarketing: true,
    isEmailVerified: true
  },
  {
    firstName: 'Customer',
    lastName: 'Demo',
    email: 'customer@demo.com',
    password: 'Demo123!',
    role: 'customer',
    company: 'Demo Corp',
    phone: '+1 (555) 345-6789',
    agreeToTerms: true,
    agreeToMarketing: false,
    isEmailVerified: true
  }
];

const createDemoUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/commerceforge');
    console.log('✅ Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({
      email: { $in: demoUsers.map(user => user.email) }
    });
    console.log('🗑️  Cleared existing demo users');

    // Create new demo users
    const createdUsers = await User.create(demoUsers);
    console.log('✅ Created demo users:');
    
    createdUsers.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
    });

    console.log('\n🎉 Demo users created successfully!');
    console.log('\nDemo Credentials:');
    console.log('----------------');
    console.log('Admin: admin@demo.com / Demo123!');
    console.log('Vendor: vendor@demo.com / Demo123!');
    console.log('Customer: customer@demo.com / Demo123!');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the script
createDemoUsers(); 