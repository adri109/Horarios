import express from 'express';
import { getDashboardStats, updateAppointmentStatus } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /dashboard/stats - Obtener estadísticas del dashboard
router.get('/stats', getDashboardStats);

// PUT /dashboard/appointments/:id/status - Actualizar estado de una cita
router.put('/appointments/:id/status', updateAppointmentStatus);

export default router;
