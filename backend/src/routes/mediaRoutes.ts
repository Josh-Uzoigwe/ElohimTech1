import { Router } from 'express';
import { uploadMedia, deleteMedia, getProductMedia, upload } from '../controllers/mediaController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get product media (public)
router.get('/:productId', getProductMedia);

// Upload media (admin only)
router.post('/upload', authMiddleware, upload.single('file'), uploadMedia);

// Delete media (admin only)
router.delete('/', authMiddleware, deleteMedia);

export default router;
