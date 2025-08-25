import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

// User order routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

// Admin routes (for now, any authenticated user can access)
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;