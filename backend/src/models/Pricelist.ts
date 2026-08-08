import mongoose, { Schema, Document } from 'mongoose';

export interface IPricelistRule {
  applyOn: 'all' | 'category' | 'product';
  targetId?: string; // Category name or Product ID
  minQty: number;
  priceType: 'discount' | 'fixed';
  value: number; // percentage if discount, amount if fixed
}

export interface IPricelist extends Document {
  name: string;
  isDefault: boolean;
  validFrom?: Date;
  validTo?: Date;
  rules: IPricelistRule[];
  createdAt: Date;
  updatedAt: Date;
}

const pricelistRuleSchema = new Schema<IPricelistRule>({
  applyOn: { type: String, enum: ['all', 'category', 'product'], required: true },
  targetId: { type: String, default: '' },
  minQty: { type: Number, default: 1 },
  priceType: { type: String, enum: ['discount', 'fixed'], required: true },
  value: { type: Number, required: true },
});

const pricelistSchema = new Schema<IPricelist>(
  {
    name: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    validFrom: { type: Date },
    validTo: { type: Date },
    rules: [pricelistRuleSchema],
  },
  { timestamps: true }
);

export const Pricelist = mongoose.model<IPricelist>('Pricelist', pricelistSchema);
