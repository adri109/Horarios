// routes/publicRoutes.ts
import { Router } from 'express';
import { getSalonPublic, getSalonSlots, createPublicAppointment } from '../controllers/publicController';
import { validateBody } from '../middleware/validation';
import { publicAppointmentSchema } from '../validators/publicSchemas';

const router = Router();

// URL pública: http://localhost:3000/public/:slug
router.get('/:slug', getSalonPublic);
// Slots por fecha
router.get('/:slug/slots', getSalonSlots);
// Crear cita desde página pública
router.post('/:slug/appointments', validateBody(publicAppointmentSchema), createPublicAppointment);

export default router;
