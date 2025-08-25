import { Router } from 'express';
import {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getMealsByCategory,
  getFeaturedMeals,
} from '../controllers/meal.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', optionalAuth, getAllMeals);
router.get('/featured', getFeaturedMeals);
router.get('/category/:category', getMealsByCategory);
router.get('/:id', getMealById);

// Protected routes (admin only - for now, any authenticated user can create/update/delete)
router.post('/', authenticateToken, createMeal);
router.put('/:id', authenticateToken, updateMeal);
router.delete('/:id', authenticateToken, deleteMeal);

export default router;