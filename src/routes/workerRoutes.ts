import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import {
  getAllWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
} from '../controllers/workerController';
import { validateBody } from '../middleware/validation';
import { createWorkerSchema, updateWorkerSchema } from '../validators/workerSchemas';

const router = Router();

// Todas las rutas requieren autenticación + permisos
router.get('/', authenticateToken, checkPermission('canViewPersonal'), getAllWorkers as RequestHandler);
router.post('/', authenticateToken, checkPermission('canEditPersonal'), validateBody(createWorkerSchema), createWorker as RequestHandler);
router.put('/:id', authenticateToken, checkPermission('canEditPersonal'), validateBody(updateWorkerSchema), updateWorker as RequestHandler);
router.delete('/:id', authenticateToken, checkPermission('canDeletePersonal'), deleteWorker as RequestHandler);

export default router;
