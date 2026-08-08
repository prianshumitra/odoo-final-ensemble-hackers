import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceLine {
  product?: mongoose.Types.ObjectId | string;
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string; // e.g. "INV/2026/0001"
  order: mongoose.Types.ObjectId | string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  invoiceDate: Date;
  dueDate?: Date;
  status: 'draft' | 'posted' | 'paid' | 'cancelled';
  lines: IInvoiceLine[];
  untaxedAmount: number;
  taxAmount: number;
  total: number;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceLineSchema = new Schema<IInvoiceLine>({
  product: { type: Schema.Types.Mixed },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    order: { type: Schema.Types.Mixed, required: true },
    orderRef: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'posted', 'paid', 'cancelled'],
      default: 'draft',
    },
    lines: [invoiceLineSchema],
    untaxedAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
