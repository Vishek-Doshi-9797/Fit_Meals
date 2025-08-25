import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, IOrderItem, IAddress } from '../types';

interface IOrderDocument extends Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: IAddress;
  deliveryDate: Date;
  deliveryTime: string;
  paymentId?: string;
  notes?: string;
}

const OrderItemSchema = new Schema<IOrderItem>({
  mealId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  customizations: [String],
});

const AddressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      type: AddressSchema,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ deliveryDate: 1 });

export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);