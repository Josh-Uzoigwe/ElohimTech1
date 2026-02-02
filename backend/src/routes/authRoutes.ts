import { Router } from 'express';
import { login, getProfile, changePassword } from '../controllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);

export default router;
