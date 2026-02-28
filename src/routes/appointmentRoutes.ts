import { Router, RequestHandler } from 'express';
import { getAppointmentById, getAllAppointments, createAppointment, updateAppointmentStatus } from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { createAppointmentSchema, updateAppointmentStatusSchema } from '../validators/appointmentSchemas';

const router = Router();

// Todas las rutas de citas requieren autenticación
router.get('/', authenticateToken, getAllAppointments as RequestHandler);
router.get('/:id', authenticateToken, getAppointmentById as RequestHandler);
router.post('/', authenticateToken, validateBody(createAppointmentSchema), createAppointment as RequestHandler);
router.put('/:id/status', authenticateToken, validateBody(updateAppointmentStatusSchema), updateAppointmentStatus as RequestHandler);

export default router;
