import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import {
  getAllWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
} from '../controllers/workerController';

const router = Router();

// Todas las rutas requieren autenticación + permisos
router.get('/', authenticateToken, checkPermission('canViewPersonal'), getAllWorkers as RequestHandler);
router.post('/', authenticateToken, checkPermission('canEditPersonal'), createWorker as RequestHandler);
router.put('/:id', authenticateToken, checkPermission('canEditPersonal'), updateWorker as RequestHandler);
router.delete('/:id', authenticateToken, checkPermission('canDeletePersonal'), deleteWorker as RequestHandler);

export default router;
