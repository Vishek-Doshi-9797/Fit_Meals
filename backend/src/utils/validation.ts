import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('US'),
  }).optional(),
  dietaryPreferences: Joi.array()
    .items(Joi.string().valid('vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein'))
    .optional(),
  fitnessGoals: Joi.string().valid('bulking', 'cutting', 'maintenance').optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
});

// Meal validation schemas
export const createMealSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  category: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack', 'shake').required(),
  type: Joi.string().valid('meal', 'shake', 'sandwich').required(),
  nutritionFacts: Joi.object({
    calories: Joi.number().min(0).required(),
    protein: Joi.number().min(0).required(),
    carbohydrates: Joi.number().min(0).required(),
    fat: Joi.number().min(0).required(),
    fiber: Joi.number().min(0).required(),
    sugar: Joi.number().min(0).required(),
    sodium: Joi.number().min(0).required(),
  }).required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  allergens: Joi.array()
    .items(Joi.string().valid('dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy'))
    .optional(),
  price: Joi.number().min(0).required(),
  imageUrl: Joi.string().uri().required(),
  isAvailable: Joi.boolean().default(true),
  dietaryTags: Joi.array()
    .items(Joi.string().valid('vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein'))
    .optional(),
  preparationTime: Joi.number().min(0).required(),
});

// Order validation schemas
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        mealId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        quantity: Joi.number().min(1).required(),
        customizations: Joi.array().items(Joi.string()).optional(),
      })
    )
    .min(1)
    .required(),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('US'),
  }).required(),
  deliveryDate: Joi.date().min('now').required(),
  deliveryTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  notes: Joi.string().max(500).optional(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled').required(),
});

// Query validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
});

export const mealFilterSchema = Joi.object({
  category: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack', 'shake').optional(),
  type: Joi.string().valid('meal', 'shake', 'sandwich').optional(),
  dietaryTags: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(Joi.string())
    )
    .optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  search: Joi.string().max(100).optional(),
}).concat(paginationSchema);