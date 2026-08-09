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

    // 3. Seed products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0 && vendor) {
      const products = [
        {
          name: 'Modern 3-Seater Comfort Sofa',
          brand: 'IKEA',
          category: 'Furniture',
          inStock: true,
          rating: 4.8,
          reviewsCount: 42,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          pricePerUnit: 4999,
          pricingUnit: 'month',
          pricing: { amount: 4999, unit: 'Month' },
          colorVariants: [
            { name: 'Slate Blue', hex: '#3B82F6' },
            { name: 'Mustard Yellow', hex: '#EAB308' },
            { name: 'Warm Beige', hex: '#D4C4ED' },
          ],
          description: 'Ultra-comfortable ergonomic living room sofa with stain-resistant fabric.',
          quantityOnHand: 5,
        },
        {
          name: 'Minimalist Oak Office Desk',
          brand: 'Herman Miller',
          category: 'Furniture',
          inStock: true,
          rating: 4.6,
          reviewsCount: 18,
          image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
          pricePerUnit: 299,
          pricingUnit: 'day',
          pricing: { amount: 299, unit: 'hour' },
          colorVariants: [
            { name: 'Natural Oak', hex: '#D4A373' },
            { name: 'Walnut', hex: '#582F0E' },
          ],
          description: 'Sleek wooden desk with built-in cable management and solid steel frame.',
          quantityOnHand: 3,
        },
        {
          name: 'Ultra-HD Smart OLED Television',
          brand: 'Sony',
          category: 'Electronics',
          inStock: true,
          rating: 4.9,
          reviewsCount: 95,
          image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
          pricePerUnit: 199,
          pricingUnit: 'day',
          pricing: { amount: 199, unit: 'day' },
          colorVariants: [
            { name: 'Midnight Black', hex: '#18181B' },
            { name: 'Silver Steel', hex: '#94A3B8' },
          ],
          sizeVariants: ['36 inch', '42 inch', '55 inch'],
          description: 'Immersive OLED display with 120Hz refresh rate and Dolby Atmos sound.',
          quantityOnHand: 4,
        },
        {
          name: 'Pro Gaming & Creative Laptop',
          brand: 'Apple',
          category: 'Electronics',
          inStock: true,
          rating: 4.9,
          reviewsCount: 112,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          pricePerUnit: 450,
          pricingUnit: 'day',
          pricing: { amount: 450, unit: 'day' },
          colorVariants: [
            { name: 'Space Grey', hex: '#334155' },
            { name: 'Silver', hex: '#CBD5E1' },
          ],
          description: 'Ultra-portable powerhouse laptop with M3 Max processor and Retina screen.',
          quantityOnHand: 2,
        },
        {
          name: 'PlayStation 5 Console + Controller',
          brand: 'Sony',
          category: 'Gaming',
          inStock: true,
          rating: 4.95,
          reviewsCount: 210,
          image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
          pricePerUnit: 120,
          pricingUnit: 'day',
          pricing: { amount: 120, unit: 'hour' },
          colorVariants: [
            { name: 'Glacier White', hex: '#F8FAFC' },
            { name: 'Midnight Black', hex: '#18181B' },
          ],
          description: 'Next-gen gaming experience with DualSense haptic feedback controllers.',
          quantityOnHand: 6,
        },
        {
          name: 'Upholstered Luxury King Bed Frame',
          brand: 'IKEA',
          category: 'Furniture',
          inStock: true,
          rating: 4.85,
          reviewsCount: 56,
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          pricePerUnit: 3499,
          pricingUnit: 'month',
          pricing: { amount: 3499, unit: 'Month' },
          colorVariants: [
            { name: 'Soft Cream', hex: '#F5EBE0' },
            { name: 'Slate Grey', hex: '#64748B' },
          ],
          description: 'Plush tufted headboard king bed with ergonomic wooden slat support.',
          quantityOnHand: 3,
        },
      ];

      const toInsert = products.map((p) => ({
        ...p,
        vendorId: vendor!._id,
        vendorName: vendor!.name,
        isPublished: true,
      }));

      await Product.insertMany(toInsert);
      console.log(`📦 Seeded ${toInsert.length} products into database.`);
    }

    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', (error as Error).message);
  }
};
