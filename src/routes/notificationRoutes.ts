import express from 'express';
import { 
  getNotifications, 
  getUnreadNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /notifications - Obtener todas las notificaciones
router.get('/', getNotifications);

// GET /notifications/unread - Obtener notificaciones no leídas
router.get('/unread', getUnreadNotifications);

// PUT /notifications/:id/read - Marcar notificación como leída
router.put('/:id/read', markAsRead);

// PUT /notifications/read-all - Marcar todas como leídas
router.put('/read-all', markAllAsRead);

// POST /notifications/test - Crear notificaciones de prueba (temporal)
router.post('/test', async (req: AuthRequest, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Ruta no disponible' });
    }

    if (req.user?.role !== 'ADMIN' || !req.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { createNotification } = await import('../controllers/notificationController');

    await createNotification(req.userId, 'Tienes una cita mañana a las 10:00 AM con Juan Pérez', 'REMINDER');
    await createNotification(req.userId, 'Nueva promoción: 20% de descuento en todos los servicios', 'PROMOTION');
    await createNotification(req.userId, 'El cliente María López ha cancelado su cita', 'CANCELLATION');

    res.json({ message: 'Notificaciones de prueba creadas' });
  } catch (error) {
    next(error);
  }
});

export default router;
