import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  order?: mongoose.Types.ObjectId | string;
  invoice?: mongoose.Types.ObjectId | string;
  amount: number;
  method: 'card' | 'saved_card';
  last4: string;
  status: 'succeeded' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.Mixed },
    invoice: { type: Schema.Types.Mixed },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['card', 'saved_card'], default: 'card' },
    last4: { type: String, required: true },
    status: { type: String, enum: ['succeeded', 'failed'], default: 'succeeded' },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
