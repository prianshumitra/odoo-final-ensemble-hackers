import mongoose, { Schema, Document } from 'mongoose';

export interface IRentalOrderLine {
  product: mongoose.Types.ObjectId | string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IRentalOrder extends Document {
  orderRef: string;
  customer: mongoose.Types.ObjectId | string;
  customerName: string;
  customerEmail: string;
  vendorId: mongoose.Types.ObjectId | string;
  status: 'pending' | 'active' | 'overdue' | 'completed' | 'cancelled';
  rentalStart: Date;
  rentalEnd: Date;
  lines: IRentalOrderLine[];
  total: number;
  lateFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const rentalOrderLineSchema = new Schema<IRentalOrderLine>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const rentalOrderSchema = new Schema<IRentalOrder>(
  {
    orderRef: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'overdue', 'completed', 'cancelled'],
      default: 'pending',
    },
    rentalStart: { type: Date, required: true, default: Date.now },
    rentalEnd: { type: Date, required: true },
    lines: [rentalOrderLineSchema],
    total: { type: Number, default: 0 },
    lateFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const RentalOrder = mongoose.model<IRentalOrder>('RentalOrder', rentalOrderSchema);
