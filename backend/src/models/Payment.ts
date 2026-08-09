import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId | string;
  rentalOrder: mongoose.Types.ObjectId | string;
  vendorId: mongoose.Types.ObjectId | string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  refundStatus?: 'none' | 'partial' | 'full';
  refundedAmount?: number;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rentalOrder: { type: Schema.Types.ObjectId, ref: 'RentalOrder', required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: [
        'CREATED',
        'PENDING',
        'AUTHORIZED',
        'CAPTURED',
        'FAILED',
        'CANCELLED',
        'REFUND_PENDING',
        'REFUNDED',
        'PARTIALLY_REFUNDED',
      ],
      default: 'CREATED',
      index: true,
    },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: { type: String, index: true, sparse: true },
    razorpaySignature: { type: String },
    paymentMethod: { type: String, default: 'Razorpay Standard' },
    refundStatus: { type: String, enum: ['none', 'partial', 'full'], default: 'none' },
    refundedAmount: { type: Number, default: 0 },
    failureReason: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
