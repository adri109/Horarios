import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener toda la configuración del salón (config + horarios + bloqueos)
export const getConfig = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // Buscar el salón del usuario (ya sea admin o worker)
    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(400).json({ error: 'No se encontró el salón del usuario' });
    }

    // Obtener config general
    let config = await prisma.config.findUnique({
      where: { salonId: salon.id }
    });

    // Si no existe config, crearla con valores por defecto
    if (!config) {
      config = await prisma.config.create({
        data: {
          salonId: salon.id,
          requireConfirmation: false,
          workersCanCreateServices: false,
          canAcceptAppointments: true,
          canModifyAppointments: true,
          openingTime: '09:00',
          closingTime: '18:00',
          serviceIntervalMinutes: 30
        }
      });
    }

    // Obtener horarios semanales
    const schedules = await prisma.salonSchedule.findMany({
      where: { salonId: salon.id },
      orderBy: { dayOfWeek: 'asc' }
    });

    // Obtener bloqueos
    const blocks = await prisma.scheduleBlock.findMany({
      where: { salonId: salon.id },
      orderBy: { date: 'asc' }
    });

    res.json({
      config,
      schedules,
      blocks
    });
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
};

// Actualizar configuración general
export const updateConfig = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      canAcceptAppointments,
      openingTime,
      closingTime,
      serviceIntervalMinutes
    } = req.body;

    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(400).json({ error: 'No se encontró el salón del usuario' });
    }

    const config = await prisma.config.upsert({
      where: { salonId: salon.id },
      update: {
        canAcceptAppointments,
        openingTime,
        closingTime,
        serviceIntervalMinutes
      },
      create: {
        salonId: salon.id,
        canAcceptAppointments,
        openingTime,
        closingTime,
        serviceIntervalMinutes
      }
    });

    res.json(config);
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({ error: 'Error al actualizar la configuración' });
  }
};

// Crear horario de un día de la semana (permite múltiples por día)
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { dayOfWeek, openingTime, closingTime, isClosed } = req.body;

    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(400).json({ error: 'No se encontró el salón del usuario' });
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({ error: 'El día de la semana debe estar entre 0 (domingo) y 6 (sábado)' });
    }

    // Validar que la hora de cierre sea posterior a la de apertura
    if (openingTime >= closingTime && !isClosed) {
      return res.status(400).json({ error: 'La hora de cierre debe ser posterior a la hora de apertura' });
    }

    // Validar que no se solape con horarios existentes del mismo día
    if (!isClosed) {
      const existingSchedules = await prisma.salonSchedule.findMany({
        where: {
          salonId: salon.id,
          dayOfWeek,
          isClosed: false
        }
      });

      // Verificar solapamientos
      for (const schedule of existingSchedules) {
        // Solapamiento si el nuevo horario empieza antes de que termine uno existente Y termina después de que empiece
        const hasOverlap = (
          (openingTime < schedule.closingTime && closingTime > schedule.openingTime)
        );

        if (hasOverlap) {
          return res.status(400).json({ 
            error: `El horario se solapa con un horario existente (${schedule.openingTime} - ${schedule.closingTime}). El nuevo horario debe comenzar como mínimo a las ${schedule.closingTime}` 
          });
        }
      }
    }

    const schedule = await prisma.salonSchedule.create({
      data: {
        salonId: salon.id,
        dayOfWeek,
        openingTime,
        closingTime,
        isClosed: isClosed || false
      }
    });

    res.json(schedule);
  } catch (error) {
    console.error('Error creando horario:', error);
    res.status(500).json({ error: 'Error al crear el horario' });
  }
};

// Actualizar horario existente
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { openingTime, closingTime, isClosed } = req.body;

    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(400).json({ error: 'No se encontró el salón del usuario' });
    }

    const schedule = await prisma.salonSchedule.findUnique({
      where: { id: parseInt(id) }
    });

    if (!schedule || schedule.salonId !== salon.id) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    // Validar que la hora de cierre sea posterior a la de apertura
    if (openingTime >= closingTime && !isClosed) {
      return res.status(400).json({ error: 'La hora de cierre debe ser posterior a la hora de apertura' });
    }

    // Validar que no se solape con otros horarios del mismo día (excluyendo el actual)
    if (!isClosed) {
      const existingSchedules = await prisma.salonSchedule.findMany({
        where: {
          salonId: salon.id,
          dayOfWeek: schedule.dayOfWeek,
          isClosed: false,
          id: { not: parseInt(id) } // Excluir el horario que estamos actualizando
        }
      });

      // Verificar solapamientos
      for (const existingSchedule of existingSchedules) {
        const hasOverlap = (
          (openingTime < existingSchedule.closingTime && closingTime > existingSchedule.openingTime)
        );

        if (hasOverlap) {
          return res.status(400).json({ 
            error: `El horario se solapa con otro horario existente (${existingSchedule.openingTime} - ${existingSchedule.closingTime})` 
          });
        }
      }
    }

    const updated = await prisma.salonSchedule.update({
      where: { id: parseInt(id) },
      data: {
        openingTime,
        closingTime,
        isClosed
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error actualizando horario:', error);
    res.status(500).json({ error: 'Error al actualizar el horario' });
  }
};

// Eliminar horario de un día
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(400).json({ error: 'No se encontró el salón del usuario' });
    }

    const schedule = await prisma.salonSchedule.findUnique({
      where: { id: parseInt(id) }
    });

    if (!schedule || schedule.salonId !== salon.id) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    await prisma.salonSchedule.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando horario:', error);
    res.status(500).json({ error: 'Error al eliminar el horario' });
  }
};

// Crear bloqueo de fecha
export const createBlock = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { date, startTime, endTime, reason } = req.body;

    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(400).json({ error: 'No se encontró el salón del usuario' });
    }

    const block = await prisma.scheduleBlock.create({
      data: {
        salonId: salon.id,
        date: new Date(date),
        startTime,
        endTime,
        reason
      }
    });

    res.json(block);
  } catch (error) {
    console.error('Error creando bloqueo:', error);
    res.status(500).json({ error: 'Error al crear el bloqueo' });
  }
};

// Eliminar bloqueo
export const deleteBlock = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    if (!salon) {
      return res.status(400).json({ error: 'No se encontró el salón del usuario' });
    }

    const block = await prisma.scheduleBlock.findUnique({
      where: { id: parseInt(id) }
    });

    if (!block || block.salonId !== salon.id) {
      return res.status(404).json({ error: 'Bloqueo no encontrado' });
    }

    await prisma.scheduleBlock.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Bloqueo eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando bloqueo:', error);
    res.status(500).json({ error: 'Error al eliminar el bloqueo' });
  }
};
