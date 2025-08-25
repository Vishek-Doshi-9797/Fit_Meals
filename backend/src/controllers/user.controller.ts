import { Response } from 'express';
import { User } from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { updateUserSchema } from '../utils/validation';
import { ApiResponse, AuthRequest } from '../types';

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  // Validate request body
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: value },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: user,
    message: 'Profile updated successfully',
  };

  res.json(response);
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully',
  };

  res.json(response);
});

export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  // This would typically involve aggregating data from orders, etc.
  // For now, we'll return basic user info
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const stats = {
    memberSince: user.createdAt,
    totalOrders: 0, // Would be calculated from orders collection
    favoriteCategory: 'breakfast', // Would be calculated from order history
    avgOrderValue: 0, // Would be calculated from orders
  };

  const response: ApiResponse = {
    success: true,
    data: {
      user,
      stats,
    },
  };

  res.json(response);
});