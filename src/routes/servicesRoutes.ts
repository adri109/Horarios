import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController';
import { authenticateToken } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';

const router = Router();

// Todas las rutas requieren autenticación + permisos
router.get('/', authenticateToken, checkPermission('canViewServices'), getAllServices);
router.get('/:id', authenticateToken, checkPermission('canViewServices'), getServiceById);
router.post('/', authenticateToken, checkPermission('canEditServices'), createService);
router.put('/:id', authenticateToken, checkPermission('canEditServices'), updateService);
router.delete('/:id', authenticateToken, checkPermission('canDeleteServices'), deleteService);

export default router;
