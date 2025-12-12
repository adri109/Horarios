import express from 'express';
import { 
  getNotifications, 
  getUnreadNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

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
router.post('/test', async (req, res) => {
  const userId = (req as any).user.userId;
  const { createNotification } = await import('../controllers/notificationController');
  
  await createNotification(userId, 'Tienes una cita mañana a las 10:00 AM con Juan Pérez', 'REMINDER');
  await createNotification(userId, 'Nueva promoción: 20% de descuento en todos los servicios', 'PROMOTION');
  await createNotification(userId, 'El cliente María López ha cancelado su cita', 'CANCELLATION');
  
  res.json({ message: 'Notificaciones de prueba creadas' });
});

export default router;
