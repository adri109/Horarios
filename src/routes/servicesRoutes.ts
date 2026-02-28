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
import { validateBody } from '../middleware/validation';
import { createServiceSchema, updateServiceSchema } from '../validators/serviceSchemas';

const router = Router();

// Todas las rutas requieren autenticación + permisos
router.get('/', authenticateToken, checkPermission('canViewServices'), getAllServices);
router.get('/:id', authenticateToken, checkPermission('canViewServices'), getServiceById);
router.post('/', authenticateToken, checkPermission('canEditServices'), validateBody(createServiceSchema), createService);
router.put('/:id', authenticateToken, checkPermission('canEditServices'), validateBody(updateServiceSchema), updateService);
router.delete('/:id', authenticateToken, checkPermission('canDeleteServices'), deleteService);

export default router;
