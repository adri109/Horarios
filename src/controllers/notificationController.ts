import { Request, Response } from 'express';
import { io } from '../index';
import prisma from '../utils/prisma';

// Obtener todas las notificaciones del usuario
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: 20 // Últimas 20 notificaciones
    });

    res.json(notifications);
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

// Obtener notificaciones no leídas
export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const notifications = await prisma.notification.findMany({
      where: { 
        userId,
        read: false
      },
      orderBy: { sentAt: 'desc' }
    });

    res.json(notifications);
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones no leídas:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones no leídas' });
  }
};

// Marcar notificación como leída
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    const updated = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Error marcando notificación como leída:', error);
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
};

// Marcar todas las notificaciones como leídas
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    await prisma.notification.updateMany({
      where: { 
        userId,
        read: false
      },
      data: { read: true }
    });

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('❌ Error marcando todas las notificaciones como leídas:', error);
    res.status(500).json({ error: 'Error al marcar todas las notificaciones como leídas' });
  }
};

// Crear una notificación (uso interno)
export const createNotification = async (
  userId: number,
  message: string,
  type: 'REMINDER' | 'CANCELLATION' | 'PROMOTION'
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        type,
        read: false
      }
    });
    
    // Emitir evento WebSocket al usuario específico
    io.to(`user_${userId}`).emit('new-notification', notification);
    console.log(`📡 Notificación emitida via WebSocket a user_${userId}`);
    
    return notification;
  } catch (error) {
    console.error('❌ Error creando notificación:', error);
    return null;
  }
};
