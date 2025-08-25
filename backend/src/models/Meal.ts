import mongoose, { Schema, Document } from 'mongoose';
import { IMeal, INutritionFacts } from '../types';

interface IMealDocument extends Document {
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
  preparationTime: number;
}

const NutritionFactsSchema = new Schema<INutritionFacts>({
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, required: true, min: 0 },
  carbohydrates: { type: Number, required: true, min: 0 },
  fat: { type: Number, required: true, min: 0 },
  fiber: { type: Number, required: true, min: 0 },
  sugar: { type: Number, required: true, min: 0 },
  sodium: { type: Number, required: true, min: 0 },
});

const MealSchema = new Schema<IMealDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'shake'],
    },
    type: {
      type: String,
      required: true,
      enum: ['meal', 'shake', 'sandwich'],
    },
    nutritionFacts: {
      type: NutritionFactsSchema,
      required: true,
    },
    ingredients: [{
      type: String,
      required: true,
    }],
    allergens: [{
      type: String,
      enum: ['dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy'],
    }],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    dietaryTags: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein'],
    }],
    preparationTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
MealSchema.index({ category: 1, isAvailable: 1 });
MealSchema.index({ dietaryTags: 1 });
MealSchema.index({ price: 1 });

export const Meal = mongoose.model<IMealDocument>('Meal', MealSchema);