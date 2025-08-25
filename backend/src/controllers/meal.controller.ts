import { Request, Response } from 'express';
import { Meal } from '../models/Meal';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { createMealSchema, mealFilterSchema } from '../utils/validation';
import { ApiResponse, AuthRequest, PaginatedResponse } from '../types';

export const getAllMeals = asyncHandler(async (req: Request, res: Response) => {
  // Validate query parameters
  const { error, value } = mealFilterSchema.validate(req.query);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const {
    page,
    limit,
    category,
    type,
    dietaryTags,
    minPrice,
    maxPrice,
    search,
  } = value;

  // Build query
  const query: any = { isAvailable: true };

  if (category) {
    query.category = category;
  }

  if (type) {
    query.type = type;
  }

  if (dietaryTags) {
    const tags = Array.isArray(dietaryTags) ? dietaryTags : [dietaryTags];
    query.dietaryTags = { $in: tags };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { ingredients: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [meals, total] = await Promise.all([
    Meal.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Meal.countDocuments(query),
  ]);

  const response: PaginatedResponse<typeof meals[0]> = {
    success: true,
    data: meals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  res.json(response);
});

export const getMealById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const meal = await Meal.findById(id);
  if (!meal) {
    throw new AppError('Meal not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: meal,
  };

  res.json(response);
});

export const createMeal = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Validate request body
  const { error, value } = createMealSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const meal = new Meal(value);
  await meal.save();

  const response: ApiResponse = {
    success: true,
    data: meal,
    message: 'Meal created successfully',
  };

  res.status(201).json(response);
});

export const updateMeal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const { error, value } = createMealSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const meal = await Meal.findByIdAndUpdate(
    id,
    { $set: value },
    { new: true, runValidators: true }
  );

  if (!meal) {
    throw new AppError('Meal not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: meal,
    message: 'Meal updated successfully',
  };

  res.json(response);
});

export const deleteMeal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const meal = await Meal.findByIdAndDelete(id);
  if (!meal) {
    throw new AppError('Meal not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Meal deleted successfully',
  };

  res.json(response);
});

export const getMealsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  const meals = await Meal.find({
    category,
    isAvailable: true,
  }).sort({ createdAt: -1 });

  const response: ApiResponse = {
    success: true,
    data: meals,
  };

  res.json(response);
});

export const getFeaturedMeals = asyncHandler(async (req: Request, res: Response) => {
  // Get featured meals (for now, just the most recent high-protein meals)
  const meals = await Meal.find({
    isAvailable: true,
    dietaryTags: 'high-protein',
  })
    .sort({ createdAt: -1 })
    .limit(6);

  const response: ApiResponse = {
    success: true,
    data: meals,
  };

  res.json(response);
});