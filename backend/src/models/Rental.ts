import mongoose, { Schema, Document } from 'mongoose';

export interface IRental extends Document {
  userEmail: string;
  userName: string;
  productId: string;
  productName: string;
  productImage: string;
  selectedColor?: string;
  selectedSize?: string;
  rentDuration: string;
  amount: number;
  unit: string;
  status: 'Active Subscription' | 'Returned & Completed' | 'Cancelled';
  createdAt: Date;
}

const rentalSchema = new Schema<IRental>(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    selectedColor: { type: String, default: 'Default' },
    selectedSize: { type: String, default: '' },
    rentDuration: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, default: 'Month' },
    status: {
      type: String,
      enum: ['Active Subscription', 'Returned & Completed', 'Cancelled'],
      default: 'Active Subscription',
    },
  },
  { timestamps: true }
);

export const Rental = mongoose.model<IRental>('Rental', rentalSchema);
