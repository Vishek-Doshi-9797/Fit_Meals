import { Request } from 'express';

// User types
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: IAddress;
  dietaryPreferences?: string[];
  fitnessGoals?: 'bulking' | 'cutting' | 'maintenance';
  allergies?: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Meal types
export interface IMeal {
  _id?: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake';
  type: 'meal' | 'shake' | 'sandwich';
  nutritionFacts: INutritionFacts;
  ingredients: string[];
  allergens: string[];
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  dietaryTags: string[];
  preparationTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface INutritionFacts {
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sugar: number; // in grams
  sodium: number; // in mg
}

// Order types
export interface IOrder {
  _id?: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: IAddress;
  deliveryDate: Date;
  deliveryTime: string;
  paymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  mealId: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

// Payment types
export interface IPayment {
  _id?: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}