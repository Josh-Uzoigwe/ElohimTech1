import { Router } from 'express';
import {
    createUnit,
    getProductUnits,
    updateUnitStatus,
    getUnitByTag,
    deleteUnit,
    getAllUnits
} from '../controllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/tag/:tag', getUnitByTag);
router.get('/product/:productId', getProductUnits);

// Admin routes
router.get('/', authMiddleware, getAllUnits);
router.post('/', authMiddleware, createUnit);
router.patch('/:tag', authMiddleware, updateUnitStatus);
router.delete('/:tag', authMiddleware, deleteUnit);

export default router;
