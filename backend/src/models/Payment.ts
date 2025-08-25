import mongoose, { Schema, Document } from 'mongoose';
import { IPayment } from '../types';

interface IPaymentDocument extends Document {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentIntentId?: string;
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    stripePaymentIntentId: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });

export const Payment = mongoose.model<IPaymentDocument>('Payment', PaymentSchema);