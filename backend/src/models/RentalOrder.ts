import mongoose, { Schema, Document } from 'mongoose';

export interface IRentalOrderLine {
  product: mongoose.Types.ObjectId | string;
  productName: string;
  productImage?: string;
  variant?: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  note?: string;
}

export interface IRentalOrder extends Document {
  orderRef: string;
  customer?: mongoose.Types.ObjectId | string;
  customerName: string;
  customerEmail: string;
  vendorId?: mongoose.Types.ObjectId | string;
  status:
    | 'quotation'
    | 'quotation_sent'
    | 'confirmed'
    | 'reserved'
    | 'picked_up'
    | 'late_pickup'
    | 'late_return'
    | 'cancelled'
    | 'completed';
  invoiceStatus: 'nothing_to_invoice' | 'invoiced';
  invoiceAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  deliveryAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  deliveryMethod?: 'Standard Delivery' | 'Pick up from Store';
  pricelist?: mongoose.Types.ObjectId | string;
  rentalPeriod: {
    start: Date;
    end: Date;
  };
  lines: IRentalOrderLine[];
  note?: string;
  untaxedAmount: number;
  taxRate: number;
  taxAmount: number;
  deliveryCharges: number;
  total: number;
  securityDeposit: {
    amount: number;
    status: 'held' | 'refunded' | 'partially_deducted';
    deductedAmount: number;
    refundedAmount: number;
  };
  pickupDate?: Date;
  returnDate?: Date;
  actualReturnDate?: Date;
  lateFeeCalculated?: number;
  createdAt: Date;
  updatedAt: Date;
}

const rentalOrderLineSchema = new Schema<IRentalOrderLine>({
  product: { type: Schema.Types.Mixed, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, default: '' },
  variant: { type: String, default: '' },
  selectedColor: { type: String, default: '' },
  selectedSize: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 },
  unit: { type: String, default: 'Month' },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: '' },
});

const rentalOrderSchema = new Schema<IRentalOrder>(
  {
    orderRef: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.Mixed },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    vendorId: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: [
        'quotation',
        'quotation_sent',
        'confirmed',
        'reserved',
        'picked_up',
        'late_pickup',
        'late_return',
        'cancelled',
        'completed',
      ],
      default: 'quotation',
    },
    invoiceStatus: {
      type: String,
      enum: ['nothing_to_invoice', 'invoiced'],
      default: 'nothing_to_invoice',
    },
    invoiceAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    deliveryAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    deliveryMethod: { type: String, default: 'Standard Delivery' },
    pricelist: { type: Schema.Types.Mixed },
    rentalPeriod: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    lines: [rentalOrderLineSchema],
    note: { type: String, default: '' },
    untaxedAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 10 },
    taxAmount: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    securityDeposit: {
      amount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['held', 'refunded', 'partially_deducted'],
        default: 'held',
      },
      deductedAmount: { type: Number, default: 0 },
      refundedAmount: { type: Number, default: 0 },
    },
    pickupDate: { type: Date },
    returnDate: { type: Date },
    actualReturnDate: { type: Date },
    lateFeeCalculated: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const RentalOrder = mongoose.model<IRentalOrder>('RentalOrder', rentalOrderSchema);
