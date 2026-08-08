import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

dotenv.config();

const INITIAL_PRODUCTS = [
  {
    name: 'Modern 3-Seater Comfort Sofa',
    brand: 'IKEA',
    category: 'Furniture',
    inStock: true,
    rating: 4.8,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Slate Blue', hex: '#3B82F6' },
      { name: 'Mustard Yellow', hex: '#EAB308' },
      { name: 'Warm Beige', hex: '#D4C4ED' }
    ],
    pricing: { amount: 4999, unit: 'Month' },
    duration: '6 Month',
    description: 'Ultra-comfortable ergonomic living room sofa with stain-resistant fabric.',
    vendorName: 'IKEA Living Partner'
  },
  {
    name: 'Minimalist Oak Office Desk',
    brand: 'Herman Miller',
    category: 'Furniture',
    inStock: false,
    rating: 4.6,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Natural Oak', hex: '#D4A373' },
      { name: 'Walnut', hex: '#582F0E' }
    ],
    pricing: { amount: 299, unit: 'hour' },
    duration: '1 Month',
    description: 'Sleek wooden desk with built-in cable management and solid steel frame.',
    vendorName: 'Herman Miller Direct'
  },
  {
    name: 'Executive Mahogany Study Desk',
    brand: 'IKEA',
    category: 'Furniture',
    inStock: true,
    rating: 4.9,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Dark Mahogany', hex: '#334155' },
      { name: 'Matte Black', hex: '#18181B' }
    ],
    pricing: { amount: 1899, unit: 'Month' },
    duration: '1 Year',
    description: 'Premium executive desk with drawers and luxurious wood finish.',
    vendorName: 'IKEA WorkSpace'
  },
  {
    name: 'Ultra-HD Smart OLED Television',
    brand: 'Sony',
    category: 'Electronics',
    inStock: true,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Midnight Black', hex: '#18181B' },
      { name: 'Silver Steel', hex: '#94A3B8' }
    ],
    sizeVariants: ['36 inch', '42 inch', '55 inch'],
    pricing: { amount: 199, unit: 'day' },
    duration: '1 Month',
    description: 'Immersive OLED display with 120Hz refresh rate and Dolby Atmos sound.',
    vendorName: 'Sony Official Rental Store'
  },
  {
    name: 'Pro Studio Workstation Desktop PC',
    brand: 'Dell',
    category: 'Electronics',
    inStock: true,
    rating: 4.7,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Graphite Grey', hex: '#475569' },
      { name: 'Ice White', hex: '#F8FAFC' }
    ],
    pricing: { amount: 350, unit: 'day' },
    duration: '6 Month',
    description: 'High-performance workstation with dual monitors and GPU computing power.',
    vendorName: 'Dell Enterprise'
  },
  {
    name: 'Pro Gaming & Creative Laptop',
    brand: 'Apple',
    category: 'Electronics',
    inStock: true,
    rating: 4.9,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Space Grey', hex: '#334155' },
      { name: 'Silver', hex: '#CBD5E1' }
    ],
    pricing: { amount: 450, unit: 'day' },
    duration: '1 Month',
    description: 'Ultra-portable powerhouse laptop with M3 Max processor and Retina screen.',
    vendorName: 'Apple Authorized Partner'
  },
  {
    name: 'PlayStation 5 Console + Controller',
    brand: 'Sony',
    category: 'Gaming',
    inStock: true,
    rating: 4.95,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Glacier White', hex: '#F8FAFC' },
      { name: 'Midnight Black', hex: '#18181B' }
    ],
    pricing: { amount: 120, unit: 'hour' },
    duration: '1 Month',
    description: 'Next-gen gaming experience with DualSense haptic feedback controllers.',
    vendorName: 'Sony PlayStation Store'
  },
  {
    name: 'Upholstered Luxury King Bed Frame',
    brand: 'IKEA',
    category: 'Furniture',
    inStock: true,
    rating: 4.85,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Soft Cream', hex: '#F5EBE0' },
      { name: 'Slate Grey', hex: '#64748B' }
    ],
    pricing: { amount: 3499, unit: 'Month' },
    duration: '1 Year',
    description: 'Plush tufted headboard king bed with ergonomic wooden slat support.',
    vendorName: 'IKEA Home Sleep'
  }
];

export const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/diligent_wombat';
    await mongoose.connect(connStr);

    console.log('🌱 Connected to MongoDB for seeding...');

    // 1. Create Default Admin Account
    const adminEmail = 'admin@ezrent.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        plainPassword: 'admin123',
        role: 'admin',
        status: 'active',
      });
      console.log('🛡️ Seeded Admin Account: admin@ezrent.com / admin123');
    } else if (!admin.plainPassword) {
      admin.plainPassword = 'admin123';
      await admin.save();
    }

    // 2. Create Default Vendor Account
    const vendorEmail = 'vendor@diligentwombat.com';
    let vendor = await User.findOne({ email: vendorEmail });
    if (!vendor) {
      const hashedPassword = await bcrypt.hash('vendor123', 10);
      vendor = await User.create({
        name: 'Wombat Electronics & Furniture Co.',
        email: vendorEmail,
        password: hashedPassword,
        plainPassword: 'vendor123',
        role: 'vendor',
        status: 'active',
        companyName: 'Wombat Electronics & Furniture Co.',
        gstNo: '27AAAAA0000A1Z5',
      });
      console.log('🏪 Seeded Vendor Account: vendor@diligentwombat.com / vendor123');
    } else if (!vendor.plainPassword) {
      vendor.plainPassword = 'vendor123';
      await vendor.save();
    }

    // 3. Create Default Customer Account
    const customerEmail = 'customer@ezrent.com';
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      const hashedPassword = await bcrypt.hash('customer123', 10);
      customer = await User.create({
        name: 'John Customer',
        email: customerEmail,
        password: hashedPassword,
        plainPassword: 'customer123',
        role: 'customer',
        status: 'active',
      });
      console.log('🛒 Seeded Customer Account: customer@ezrent.com / customer123');
    } else if (!customer.plainPassword) {
      customer.plainPassword = 'customer123';
      await customer.save();
    }

    // 4. Populate products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsToInsert = INITIAL_PRODUCTS.map((p) => ({
        ...p,
        vendorId: vendor?._id,
      }));
      await Product.insertMany(productsToInsert);
      console.log(`📦 Seeded ${productsToInsert.length} initial products into MongoDB.`);
    }

    console.log('✅ Database Seeding Complete!');
  } catch (error) {
    console.error('❌ Seeding error:', (error as Error).message);
  }
};
