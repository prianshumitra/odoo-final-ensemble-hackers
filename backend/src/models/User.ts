import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  plainPassword?: string;
  role: 'admin' | 'vendor' | 'customer';
  status: 'active' | 'pending' | 'suspended';
  avatar?: string;
  profileImageUrl?: string;
  phone?: string;
  companyName?: string;
  gstNo?: string;
  companyLogoUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  savedPaymentMethods?: Array<{
    id: string;
    cardLast4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  }>;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    plainPassword: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'vendor', 'customer'], default: 'customer' },
    status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
    avatar: { type: String, default: '' },
    profileImageUrl: { type: String, default: '' },
    phone: { type: String, default: '' },
    companyName: { type: String, default: '' },
    gstNo: { type: String, default: '' },
    companyLogoUrl: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    savedPaymentMethods: [
      {
        id: String,
        cardLast4: String,
        brand: String,
        expMonth: Number,
        expYear: Number,
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
