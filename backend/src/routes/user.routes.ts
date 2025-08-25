import { Router } from 'express';
import { updateProfile, deleteAccount, getUserStats } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

router.put('/profile', updateProfile);
router.delete('/account', deleteAccount);
router.get('/stats', getUserStats);

export default router;