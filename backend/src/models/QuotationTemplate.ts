import mongoose, { Schema, Document } from 'mongoose';

export interface IQuotationTemplateLine {
  description: string;
  defaultQty: number;
  defaultPrice: number;
}

export interface IQuotationTemplate extends Document {
  name: string; // e.g. "Home Rental Furniture", "Office Rental Furniture"
  lines: IQuotationTemplateLine[];
  validityDays: number;
  paymentTermsPercent: number;
  headerHtml: string;
  footerHtml: string;
  createdAt: Date;
  updatedAt: Date;
}

const quotationTemplateLineSchema = new Schema<IQuotationTemplateLine>({
  description: { type: String, required: true },
  defaultQty: { type: Number, default: 1 },
  defaultPrice: { type: Number, default: 0 },
});

const quotationTemplateSchema = new Schema<IQuotationTemplate>(
  {
    name: { type: String, required: true, trim: true },
    lines: [quotationTemplateLineSchema],
    validityDays: { type: Number, default: 30 },
    paymentTermsPercent: { type: Number, default: 100 },
    headerHtml: { type: String, default: '' },
    footerHtml: { type: String, default: '' },
  },
  { timestamps: true }
);

export const QuotationTemplate = mongoose.model<IQuotationTemplate>(
  'QuotationTemplate',
  quotationTemplateSchema
);
