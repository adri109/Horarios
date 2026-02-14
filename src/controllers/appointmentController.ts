import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../index';

const prisma = new PrismaClient();

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Buscar el salón del usuario
    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    // Obtener solo las citas del salón del usuario
    const appointments = await prisma.appointment.findMany({
      where: {
        service: {
          salonId: salon.id
        }
      },
      include: {
        client: true,
        stylist: true,
        service: true,
      },
      orderBy: { startTime: 'asc' },
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).json({ error: 'Error obteniendo citas' });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;
  
  try {
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Buscar el salón del usuario
    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: Number(id),
        service: {
          salonId: salon.id
        }
      },
      include: {
        client: true,
        stylist: true,
        service: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error obteniendo cita:', error);
    res.status(500).json({ error: 'Error obteniendo cita' });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  const { clientId, stylistId, serviceId, startTime, endTime } = req.body;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        stylistId,
        serviceId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      include: {
        service: {
          include: {
            salon: {
              include: {
                admin: true,
                workers: true
              }
            }
          }
        }
      }
    });

    // Emitir evento WebSocket a todos los usuarios del salón
    const salon = appointment.service.salon;
    const userIds = [salon.adminId, ...salon.workers.map(w => w.id)];
    
    userIds.forEach(userId => {
      io.to(`user_${userId}`).emit('appointment-created', { appointmentId: appointment.id });
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error creando cita' });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = (req as any).userId;
  const userRole = (req as any).userRole;

  try {
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Buscar el salón y permisos del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        canConfirmAppointments: true,
        canCancelAppointments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar permisos según el estado que se quiere cambiar
    if (status === 'CONFIRMED' && user.role === 'WORKER' && !user.canConfirmAppointments) {
      return res.status(403).json({ 
        error: 'No tienes permiso para confirmar citas',
        requiredPermission: 'canConfirmAppointments'
      });
    }

    if (status === 'CANCELLED' && user.role === 'WORKER' && !user.canCancelAppointments) {
      return res.status(403).json({ 
        error: 'No tienes permiso para cancelar citas',
        requiredPermission: 'canCancelAppointments'
      });
    }

    // COMPLETED y NO_SHOW siempre están permitidos para workers
    // (es su función principal marcar asistencia)

    // Buscar el salón del usuario
    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    // Verificar que la cita pertenece al salón del usuario
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: Number(id),
        service: {
          salonId: salon.id
        }
      }
    });

    if (!existingAppointment) {
      return res.status(404).json({ error: 'Cita no encontrada o no tienes permiso para modificarla' });
    }

    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        service: {
          include: {
            salon: {
              include: {
                admin: true,
                workers: true
              }
            }
          }
        }
      }
    });

    // Emitir evento WebSocket
    const appointmentSalon = appointment.service.salon;
    const userIds = [appointmentSalon.adminId, ...appointmentSalon.workers.map(w => w.id)];
    
    const eventType = status === 'CANCELLED' ? 'appointment-cancelled' : 'appointment-updated';
    userIds.forEach(userId => {
      io.to(`user_${userId}`).emit(eventType, { appointmentId: appointment.id, status });
    });

    res.json(appointment);
  } catch (error) {
    console.error('Error actualizando estado de cita:', error);
    res.status(500).json({ error: 'Error actualizando estado de cita' });
  }
};
