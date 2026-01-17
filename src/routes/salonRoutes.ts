import { Router } from 'express';
import { getSalonBySlug, updateSalonInfo } from '../controllers/salonController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:slug', getSalonBySlug);
router.put('/info', authenticateToken, updateSalonInfo);

export default router;
