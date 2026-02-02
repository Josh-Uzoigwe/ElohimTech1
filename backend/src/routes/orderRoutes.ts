import { Router } from 'express';
import {
    confirmSale,
    getReceipt,
    getOrders,
    updateOrderStatus
} from '../controllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public route (for receipt lookup)
router.get('/receipt/:id', getReceipt);

// Admin routes
router.get('/', authMiddleware, getOrders);
router.post('/confirm', authMiddleware, confirmSale);
router.patch('/:id', authMiddleware, updateOrderStatus);

export default router;
