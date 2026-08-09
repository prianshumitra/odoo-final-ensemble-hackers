import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

export const seedDatabase = async () => {
  try {
    // 1. Create default vendor account
    const vendorEmail = 'vendor@ezrent.com';
    let vendor = await User.findOne({ email: vendorEmail });
    if (!vendor) {
      const hash = await bcrypt.hash('vendor123', 10);
      vendor = await User.create({
        name: 'Demo Vendor Store',
        email: vendorEmail,
        password: hash,
        role: 'vendor',
        status: 'active',
        companyName: 'Demo Vendor Store',
      });
      console.log('🏪 Seeded Vendor: vendor@ezrent.com / vendor123');
    }

    // 2. Create default customer account
    const customerEmail = 'customer@ezrent.com';
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      const hash = await bcrypt.hash('customer123', 10);
      customer = await User.create({
        name: 'Demo Customer',
        email: customerEmail,
        password: hash,
        role: 'customer',
        status: 'active',
      });
      console.log('🛒 Seeded Customer: customer@ezrent.com / customer123');
    }

    // 3. Seed initial products for vendor if no products exist
    const productCount = await Product.countDocuments();
    if (productCount === 0 && vendor) {
      await Product.create([
        {
          name: 'Ergonomic Executive Office Chair',
          brand: 'Herman Miller',
          category: 'Furniture',
          description: 'High-end ergonomic recliner chair with lumbar support for home office or work setup.',
          image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=600&auto=format&fit=crop',
          pricePerUnit: 1499,
          pricingUnit: 'month',
          quantityOnHand: 8,
          isPublished: true,
          vendorId: vendor._id,
          vendorName: vendor.name,
          colorVariants: [{ name: 'Slate Blue', hex: '#3B82F6' }, { name: 'Dark Charcoal', hex: '#334155' }],
          sizeVariants: ['Standard', 'Executive'],
          rating: 4.9,
          reviewsCount: 38,
          inStock: true,
        },
        {
          name: 'Sony FX3 Cinema Line Camera Kit',
          brand: 'Sony',
          category: 'Cameras',
          description: 'Full-frame cinema camera with 24-70mm f/2.8 lens and dual wireless microphones.',
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
          pricePerUnit: 3500,
          pricingUnit: 'day',
          quantityOnHand: 4,
          isPublished: true,
          vendorId: vendor._id,
          vendorName: vendor.name,
          colorVariants: [{ name: 'Black', hex: '#18181B' }],
          sizeVariants: ['Standard Kit'],
          rating: 5.0,
          reviewsCount: 19,
          inStock: true,
        },
        {
          name: 'MacBook Pro M3 Max 16-inch (64GB RAM)',
          brand: 'Apple',
          category: 'Electronics',
          description: 'Ultimate workstation laptop with M3 Max 16-core CPU, 40-core GPU, and 1TB SSD.',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
          pricePerUnit: 4999,
          pricingUnit: 'month',
          quantityOnHand: 5,
          isPublished: true,
          vendorId: vendor._id,
          vendorName: vendor.name,
          colorVariants: [{ name: 'Space Black', hex: '#18181B' }, { name: 'Silver', hex: '#F8FAFC' }],
          sizeVariants: ['16-inch'],
          rating: 4.8,
          reviewsCount: 54,
          inStock: true,
        },
        {
          name: 'PlayStation 5 Console + 2 DualSense Controllers',
          brand: 'Sony',
          category: 'Gaming',
          description: 'PS5 Digital/Disc Edition console with dual controllers and pre-loaded games library.',
          image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop',
          pricePerUnit: 899,
          pricingUnit: 'week',
          quantityOnHand: 10,
          isPublished: true,
          vendorId: vendor._id,
          vendorName: vendor.name,
          colorVariants: [{ name: 'White', hex: '#F8FAFC' }],
          sizeVariants: ['Disc Edition'],
          rating: 4.9,
          reviewsCount: 82,
          inStock: true,
        },
      ]);
      console.log('📦 Seeded initial vendor products into MongoDB.');
    }

    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', (error as Error).message);
  }
};

