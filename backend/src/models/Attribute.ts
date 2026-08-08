import mongoose, { Schema, Document } from 'mongoose';

export interface IAttribute extends Document {
  name: string;
  values: string[];
  displayType: 'radio' | 'pills' | 'checkbox' | 'image';
  extraPricePerValue: Array<{
    value: string;
    extraPrice: number;
  }>;
  showVariantImages: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true, trim: true },
    values: [{ type: String, required: true }],
    displayType: {
      type: String,
      enum: ['radio', 'pills', 'checkbox', 'image'],
      default: 'pills',
    },
    extraPricePerValue: [
      {
        value: { type: String, required: true },
        extraPrice: { type: Number, default: 0 },
      },
    ],
    showVariantImages: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Attribute = mongoose.model<IAttribute>('Attribute', attributeSchema);
