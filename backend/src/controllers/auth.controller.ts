import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendWelcomeEmail } from '../utils/email';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { registerSchema, loginSchema } from '../utils/validation';
import { ApiResponse, LoginRequest, RegisterRequest } from '../types';

export const register = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { email, password, firstName, lastName, phone }: RegisterRequest = value;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    phone,
  });

  await user.save();

  // Generate JWT token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
  });

  // Send welcome email (async, don't wait for it)
  sendWelcomeEmail(email, firstName).catch(console.error);

  const response: ApiResponse = {
    success: true,
    data: {
      user,
      token,
    },
    message: 'User registered successfully',
  };

  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { email, password }: LoginRequest = value;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
  });

  // Remove password from user object
  user.password = undefined as any;

  const response: ApiResponse = {
    success: true,
    data: {
      user,
      token,
    },
    message: 'Login successful',
  };

  res.json(response);
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: user,
  };

  res.json(response);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Generate new JWT token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
  });

  const response: ApiResponse = {
    success: true,
    data: {
      token,
    },
    message: 'Token refreshed successfully',
  };

  res.json(response);
});