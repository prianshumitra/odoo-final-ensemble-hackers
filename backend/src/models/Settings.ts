import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  lateFeeEnabled: boolean;
  defaultLateFeeAmount: number;
  variantsEnabled: boolean;
  pricelistEnabled: boolean;
  gracePeriodMinutes: number;
  maxLateFeeCap: number;
  companyHeader: string;
  companyFooter: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    lateFeeEnabled: { type: Boolean, default: true },
    defaultLateFeeAmount: { type: Number, default: 150 },
    variantsEnabled: { type: Boolean, default: true },
    pricelistEnabled: { type: Boolean, default: true },
    gracePeriodMinutes: { type: Number, default: 30 },
    maxLateFeeCap: { type: Number, default: 5000 },
    companyHeader: { type: String, default: 'EZRent Rental Operations' },
    companyFooter: { type: String, default: 'Thank you for choosing EZRent!' },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
