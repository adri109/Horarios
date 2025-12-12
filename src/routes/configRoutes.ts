import { Router } from 'express';
import {
  getConfig,
  updateConfig,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  createBlock,
  deleteBlock
} from '../controllers/configController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Configuración general
router.get('/', getConfig);
router.put('/', updateConfig);

// Horarios semanales
router.post('/schedules', createSchedule);
router.put('/schedules/:id', updateSchedule);
router.delete('/schedules/:id', deleteSchedule);

// Bloqueos de fechas
router.post('/blocks', createBlock);
router.delete('/blocks/:id', deleteBlock);

export default router;
