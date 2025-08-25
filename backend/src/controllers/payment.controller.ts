import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, AuthRequest } from '../types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.body;
  const userId = req.user!.id;

  if (!orderId) {
    throw new AppError('Order ID is required', 400);
  }

  // Verify order exists and belongs to user
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if order is already paid
  const existingPayment = await Payment.findOne({ orderId, status: 'completed' });
  if (existingPayment) {
    throw new AppError('Order is already paid', 400);
  }

  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: userId,
      },
    });

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId,
      amount: order.totalAmount,
      currency: 'usd',
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
    });

    await payment.save();

    const response: ApiResponse = {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
      },
      message: 'Payment intent created successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Stripe error:', error);
    throw new AppError('Failed to create payment intent', 500);
  }
});

export const confirmPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { paymentIntentId } = req.body;
  const userId = req.user!.id;

  if (!paymentIntentId) {
    throw new AppError('Payment intent ID is required', 400);
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment not succeeded', 400);
    }

    // Find and update payment record
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
      userId,
    });

    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    // Update payment status
    payment.status = 'completed';
    await payment.save();

    // Update order status
    await Order.findByIdAndUpdate(payment.orderId, {
      status: 'confirmed',
      paymentId: payment._id,
    });

    const response: ApiResponse = {
      success: true,
      data: payment,
      message: 'Payment confirmed successfully',
    };

    res.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Payment confirmation error:', error);
    throw new AppError('Failed to confirm payment', 500);
  }
});

export const getPaymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const payments = await Payment.find({ userId })
    .populate('orderId')
    .sort({ createdAt: -1 });

  const response: ApiResponse = {
    success: true,
    data: payments,
  };

  res.json(response);
});

export const refundPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { paymentId } = req.params;
  const { reason } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.status !== 'completed') {
    throw new AppError('Payment cannot be refunded', 400);
  }

  try {
    // Create refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId!,
      reason: reason || 'requested_by_customer',
    });

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    // Update order status
    await Order.findByIdAndUpdate(payment.orderId, {
      status: 'cancelled',
    });

    const response: ApiResponse = {
      success: true,
      data: {
        payment,
        refund,
      },
      message: 'Payment refunded successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Refund error:', error);
    throw new AppError('Failed to process refund', 500);
  }
});

// Webhook endpoint for Stripe events
export const handleStripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    throw new AppError('Webhook secret not configured', 500);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new AppError('Invalid webhook signature', 400);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Update payment status
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'completed' }
      );
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      // Update payment status
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: failedPayment.id },
        { status: 'failed' }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});