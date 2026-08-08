import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: string;
  type: 'goods' | 'service';
  inStock: boolean;
  isPublished: boolean;
  isSystemProduct: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  salesPrice: number;
  costPrice: number;
  quantityOnHand: number;
  colorVariants: { name: string; hex: string }[];
  sizeVariants?: string[];
  attributes?: Array<{
    attribute: mongoose.Types.ObjectId | string;
    values: string[];
  }>;
  pricing: {
    amount: number;
    unit: 'hour' | 'day' | 'Month' | 'year';
  };
  duration: '1 Month' | '6 Month' | '1 Year' | '2 Years' | '3 Years';
  rental: {
    periodicity: 'hours' | 'day' | 'night' | 'week';
    windowStart: string; // e.g. "10:00"
    windowEnd: string;   // e.g. "19:00"
    paddingTimeMinutes: number;
    lateFeeRatePerUnit: number;
    depositType: 'fixed' | 'percent';
    depositValue: number;
  };
  description: string;
  vendorId?: mongoose.Types.ObjectId | string;
  vendorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Generic', trim: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, enum: ['goods', 'service'], default: 'goods' },
    inStock: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    isSystemProduct: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 10 },
    image: { type: String, required: true },
    images: [{ type: String }],
    salesPrice: { type: Number, required: true, default: 0 },
    costPrice: { type: Number, default: 0 },
    quantityOnHand: { type: Number, default: 10 },
    colorVariants: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      },
    ],
    sizeVariants: [{ type: String }],
    attributes: [
      {
        attribute: { type: Schema.Types.ObjectId, ref: 'Attribute' },
        values: [{ type: String }],
      },
    ],
    pricing: {
      amount: { type: Number, required: true },
      unit: { type: String, enum: ['hour', 'day', 'Month', 'year'], default: 'Month' },
    },
    duration: {
      type: String,
      enum: ['1 Month', '6 Month', '1 Year', '2 Years', '3 Years'],
      default: '6 Month',
    },
    rental: {
      periodicity: { type: String, enum: ['hours', 'day', 'night', 'week'], default: 'day' },
      windowStart: { type: String, default: '10:00' },
      windowEnd: { type: String, default: '19:00' },
      paddingTimeMinutes: { type: Number, default: 120 },
      lateFeeRatePerUnit: { type: Number, default: 150 },
      depositType: { type: String, enum: ['fixed', 'percent'], default: 'fixed' },
      depositValue: { type: Number, default: 500 },
    },
    description: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User' },
    vendorName: { type: String, default: 'Official Store' },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
