import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand?: string;
  category: string;
  description: string;
  image: string;
  pricePerUnit: number;
  pricingUnit: 'hour' | 'day' | 'week' | 'month' | string;
  pricing?: { amount: number; unit: string };
  quantityOnHand: number;
  isPublished: boolean;
  vendorId: mongoose.Types.ObjectId | string;
  vendorName: string;
  colorVariants?: { name: string; hex: string }[];
  sizeVariants?: string[];
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Generic' },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop' },
    pricePerUnit: { type: Number, required: true },
    pricingUnit: { type: String, default: 'day' },
    pricing: { amount: Number, unit: String },
    quantityOnHand: { type: Number, required: true, default: 1 },
    isPublished: { type: Boolean, default: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorName: { type: String, default: '' },
    colorVariants: { type: Array, default: [] },
    sizeVariants: { type: Array, default: [] },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 25 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
