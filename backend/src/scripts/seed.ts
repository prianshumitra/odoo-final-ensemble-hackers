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
        { name: 'Modern 3-Seater Sofa', category: 'Furniture', description: 'Comfortable ergonomic sofa with stain-resistant fabric.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', pricePerUnit: 500, pricingUnit: 'day' as const, quantityOnHand: 5 },
        { name: 'Executive Office Desk', category: 'Furniture', description: 'Sleek wooden desk with cable management.', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80', pricePerUnit: 300, pricingUnit: 'day' as const, quantityOnHand: 3 },
        { name: '55" OLED Smart TV', category: 'Electronics', description: 'Immersive OLED display with Dolby Atmos.', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80', pricePerUnit: 200, pricingUnit: 'day' as const, quantityOnHand: 4 },
        { name: 'MacBook Pro Laptop', category: 'Electronics', description: 'M3 Max processor, 16" Retina display.', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', pricePerUnit: 450, pricingUnit: 'day' as const, quantityOnHand: 2 },
        { name: 'PlayStation 5 Console', category: 'Gaming', description: 'Next-gen gaming with DualSense controller.', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', pricePerUnit: 120, pricingUnit: 'day' as const, quantityOnHand: 6 },
        { name: 'King Size Bed Frame', category: 'Furniture', description: 'Plush tufted headboard with wooden support.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', pricePerUnit: 350, pricingUnit: 'day' as const, quantityOnHand: 3 },
      ];

      const toInsert = products.map((p) => ({
        ...p,
        vendorId: vendor!._id,
        vendorName: vendor!.name,
        isPublished: true,
      }));

      await Product.insertMany(toInsert);
      console.log(`📦 Seeded ${toInsert.length} products.`);
    }

    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', (error as Error).message);
  }
};
