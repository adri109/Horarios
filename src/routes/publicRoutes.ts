// routes/publicRoutes.ts
import { Router } from 'express';
import { getSalonPublic, getSalonSlots, createPublicAppointment } from '../controllers/publicController';

const router = Router();

// URL pública: http://localhost:3000/public/:slug
router.get('/:slug', getSalonPublic);
// Slots por fecha
router.get('/:slug/slots', getSalonSlots);
// Crear cita desde página pública
router.post('/:slug/appointments', createPublicAppointment);

export default router;
