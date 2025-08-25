import mongoose from 'mongoose';
import { Meal } from '../models/Meal';

const sampleMeals = [
  {
    name: 'Power Breakfast Bowl',
    description: 'Energizing acai bowl with granola, fresh berries, and protein powder. Perfect for starting your day with sustained energy.',
    category: 'breakfast',
    type: 'meal',
    nutritionFacts: {
      calories: 450,
      protein: 25,
      carbohydrates: 52,
      fat: 18,
      fiber: 12,
      sugar: 28,
      sodium: 150,
    },
    ingredients: [
      'Acai puree',
      'Banana',
      'Blueberries',
      'Strawberries',
      'Granola',
      'Protein powder',
      'Chia seeds',
      'Honey',
    ],
    allergens: ['tree-nuts'],
    price: 12.99,
    imageUrl: '/assets/acai-bowl.jpg',
    isAvailable: true,
    dietaryTags: ['high-protein', 'gluten-free'],
    preparationTime: 5,
  },
  {
    name: 'Grilled Chicken Power Bowl',
    description: 'Lean grilled chicken breast with quinoa, roasted vegetables, and avocado. Ideal for muscle building and recovery.',
    category: 'lunch',
    type: 'meal',
    nutritionFacts: {
      calories: 520,
      protein: 42,
      carbohydrates: 35,
      fat: 22,
      fiber: 8,
      sugar: 6,
      sodium: 320,
    },
    ingredients: [
      'Grilled chicken breast',
      'Quinoa',
      'Broccoli',
      'Sweet potato',
      'Avocado',
      'Olive oil',
      'Lemon',
      'Herbs',
    ],
    allergens: [],
    price: 15.99,
    imageUrl: '/assets/lunch-bowl.jpg',
    isAvailable: true,
    dietaryTags: ['high-protein', 'gluten-free'],
    preparationTime: 15,
  },
  {
    name: 'Post-Workout Protein Shake',
    description: 'Rich chocolate protein shake with banana and peanut butter. Perfect for post-workout recovery.',
    category: 'shake',
    type: 'shake',
    nutritionFacts: {
      calories: 380,
      protein: 35,
      carbohydrates: 28,
      fat: 14,
      fiber: 4,
      sugar: 22,
      sodium: 200,
    },
    ingredients: [
      'Whey protein powder',
      'Banana',
      'Peanut butter',
      'Cocoa powder',
      'Almond milk',
      'Ice',
    ],
    allergens: ['dairy', 'peanuts'],
    price: 8.99,
    imageUrl: '/assets/protein-shake.jpg',
    isAvailable: true,
    dietaryTags: ['high-protein'],
    preparationTime: 3,
  },
  {
    name: 'Turkey & Avocado Sandwich',
    description: 'Lean turkey breast with avocado, spinach, and tomatoes on whole grain bread. Perfect for a satisfying meal.',
    category: 'lunch',
    type: 'sandwich',
    nutritionFacts: {
      calories: 420,
      protein: 28,
      carbohydrates: 38,
      fat: 18,
      fiber: 8,
      sugar: 4,
      sodium: 580,
    },
    ingredients: [
      'Whole grain bread',
      'Turkey breast',
      'Avocado',
      'Spinach',
      'Tomato',
      'Red onion',
      'Mustard',
    ],
    allergens: ['wheat'],
    price: 11.99,
    imageUrl: '/assets/healthy-sandwich.jpg',
    isAvailable: true,
    dietaryTags: ['high-protein'],
    preparationTime: 5,
  },
  {
    name: 'Salmon & Sweet Potato Dinner',
    description: 'Fresh grilled salmon with roasted sweet potato and asparagus. Rich in omega-3s and perfect for evening nutrition.',
    category: 'dinner',
    type: 'meal',
    nutritionFacts: {
      calories: 580,
      protein: 38,
      carbohydrates: 42,
      fat: 26,
      fiber: 6,
      sugar: 12,
      sodium: 420,
    },
    ingredients: [
      'Atlantic salmon',
      'Sweet potato',
      'Asparagus',
      'Olive oil',
      'Garlic',
      'Lemon',
      'Herbs',
    ],
    allergens: ['fish'],
    price: 18.99,
    imageUrl: '/assets/dinner-plate.jpg',
    isAvailable: true,
    dietaryTags: ['high-protein', 'gluten-free'],
    preparationTime: 20,
  },
];

export const seedMeals = async (): Promise<void> => {
  try {
    // Clear existing meals
    await Meal.deleteMany({});
    
    // Insert sample meals
    await Meal.insertMany(sampleMeals);
    
    console.log('✅ Sample meals seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding meals:', error);
    throw error;
  }
};

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await seedMeals();
    
    console.log('🎉 Database seeding completed successfully');
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    throw error;
  }
};