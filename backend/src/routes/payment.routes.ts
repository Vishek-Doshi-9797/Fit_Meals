import { Router } from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
  handleStripeWebhook,
} from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Webhook route (no auth needed, Stripe handles verification)
router.post('/webhook', handleStripeWebhook);

// Protected routes
router.use(authenticateToken);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);
router.post('/:paymentId/refund', refundPayment);

export default router;