import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  image: string;
  pricePerUnit: number;
  pricingUnit: 'hour' | 'day' | 'week' | 'month';
  quantityOnHand: number;
  isPublished: boolean;
  vendorId: mongoose.Types.ObjectId | string;
  vendorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop' },
    pricePerUnit: { type: Number, required: true },
    pricingUnit: { type: String, enum: ['hour', 'day', 'week', 'month'], default: 'day' },
    quantityOnHand: { type: Number, required: true, default: 1 },
    isPublished: { type: Boolean, default: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorName: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
