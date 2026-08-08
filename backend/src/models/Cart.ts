import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  userId: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage: string;
  amount: number;
  unit: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  rentDuration: string;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true, index: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, default: '' },
    amount: { type: Number, required: true },
    unit: { type: String, default: 'Month' },
    quantity: { type: Number, required: true, default: 1 },
    selectedColor: { type: String, default: '' },
    selectedSize: { type: String, default: '' },
    rentDuration: { type: String, default: '6 Month' },
  },
  { timestamps: true }
);

export const CartItemModel = mongoose.model<ICartItem>('CartItem', cartItemSchema);
