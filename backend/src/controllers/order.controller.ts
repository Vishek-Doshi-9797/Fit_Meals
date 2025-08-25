import { Response } from 'express';
import { Order } from '../models/Order';
import { Meal } from '../models/Meal';
import { User } from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { createOrderSchema, updateOrderStatusSchema, paginationSchema } from '../utils/validation';
import { sendOrderConfirmationEmail } from '../utils/email';
import { ApiResponse, AuthRequest, PaginatedResponse } from '../types';

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  // Validate request body
  const { error, value } = createOrderSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { items, deliveryAddress, deliveryDate, deliveryTime, notes } = value;

  // Validate meals exist and calculate total
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const meal = await Meal.findById(item.mealId);
    if (!meal) {
      throw new AppError(`Meal with ID ${item.mealId} not found`, 404);
    }
    if (!meal.isAvailable) {
      throw new AppError(`Meal "${meal.name}" is not available`, 400);
    }

    const itemPrice = meal.price * item.quantity;
    totalAmount += itemPrice;

    orderItems.push({
      mealId: meal._id,
      quantity: item.quantity,
      price: itemPrice,
      customizations: item.customizations || [],
    });
  }

  // Create order
  const order = new Order({
    userId,
    items: orderItems,
    totalAmount,
    deliveryAddress,
    deliveryDate,
    deliveryTime,
    notes,
  });

  await order.save();

  // Populate meal details
  await order.populate('items.mealId');

  // Get user details for email
  const user = await User.findById(userId);
  if (user) {
    // Send confirmation email (async, don't wait for it)
    sendOrderConfirmationEmail(
      user.email,
      user.firstName,
      order._id.toString(),
      totalAmount
    ).catch(console.error);
  }

  const response: ApiResponse = {
    success: true,
    data: order,
    message: 'Order created successfully',
  };

  res.status(201).json(response);
});

export const getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  // Validate query parameters
  const { error, value } = paginationSchema.validate(req.query);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { page, limit } = value;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId })
      .populate('items.mealId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ userId }),
  ]);

  const response: PaginatedResponse<typeof orders[0]> = {
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  res.json(response);
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const order = await Order.findOne({ _id: id, userId }).populate('items.mealId');
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: order,
  };

  res.json(response);
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const { error, value } = updateOrderStatusSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { status } = value;

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('items.mealId');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    data: order,
    message: 'Order status updated successfully',
  };

  res.json(response);
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const order = await Order.findOne({ _id: id, userId });
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if order can be cancelled
  if (['delivered', 'cancelled'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled', 400);
  }

  order.status = 'cancelled';
  await order.save();

  const response: ApiResponse = {
    success: true,
    data: order,
    message: 'Order cancelled successfully',
  };

  res.json(response);
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Admin endpoint to get all orders
  const { error, value } = paginationSchema.validate(req.query);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { page, limit } = value;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find()
      .populate('userId', 'firstName lastName email')
      .populate('items.mealId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);

  const response: PaginatedResponse<typeof orders[0]> = {
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  res.json(response);
});