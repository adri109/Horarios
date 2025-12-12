import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import { sendCampaign } from '../controllers/marketingController';

const router = Router();

// Enviar campaña de marketing (solo con permiso de marketing o ADMIN)
router.post('/send-campaign', authenticateToken, checkPermission('canViewMarketing'), sendCampaign);

export default router;
