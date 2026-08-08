import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  colorVariants: { name: string; hex: string }[];
  sizeVariants?: string[];
  pricing: {
    amount: number;
    unit: 'hour' | 'day' | 'Month' | 'year';
  };
  duration: '1 Month' | '6 Month' | '1 Year' | '2 Years' | '3 Years';
  description: string;
  vendorId?: mongoose.Types.ObjectId | string;
  vendorName?: string;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 10 },
    image: { type: String, required: true },
    colorVariants: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      },
    ],
    sizeVariants: [{ type: String }],
    pricing: {
      amount: { type: Number, required: true },
      unit: { type: String, enum: ['hour', 'day', 'Month', 'year'], default: 'Month' },
    },
    duration: {
      type: String,
      enum: ['1 Month', '6 Month', '1 Year', '2 Years', '3 Years'],
      default: '6 Month',
    },
    description: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User' },
    vendorName: { type: String, default: 'Official Store' },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
