import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types/auth';
import logger from '../utils/logger';

// Obtener todos los servicios del salón del usuario autenticado
export const getAllServices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    logger.debug({ userId }, 'getAllServices');
    
    if (!userId) {
      logger.warn('No hay userId en la request');
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Buscar el salón del usuario (como admin o trabajador)
    const salon = await prisma.salon.findFirst({
      where: {
        OR: [
          { adminId: userId },
          { workers: { some: { id: userId } } }
        ]
      }
    });

    logger.debug({ salonId: salon?.id, salonName: salon?.name }, 'Salón encontrado para servicios');

    if (!salon) {
      logger.warn({ userId }, 'Usuario no tiene salón asociado');
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    // Obtener solo los servicios de este salón
    const services = await prisma.service.findMany({
      where: { salonId: salon.id },
      orderBy: { name: 'asc' },
    });
    
    logger.debug({ userId, count: services.length }, 'Servicios encontrados');
    res.json(services);
  } catch (error) {
    logger.error({ error }, 'Error obteniendo servicios');
    res.status(500).json({ error: 'Error obteniendo servicios' });
  }
};

// Obtener un servicio por ID
export const getServiceById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

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

    const service = await prisma.service.findFirst({
      where: {
        id: Number(id),
        salonId: salon.id,
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json(service);
  } catch (error) {
    logger.error({ error }, 'Error obteniendo servicio');
    res.status(500).json({ error: 'Error obteniendo servicio' });
  }
};

// Crear un servicio
export const createService = async (req: AuthRequest, res: Response) => {
  const { name, description, duration, price } = req.body;

  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

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

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        price,
        salonId: salon.id,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    logger.error({ error }, 'Error creando servicio');
    res.status(500).json({ error: 'Error creando servicio' });
  }
};

// Actualizar un servicio (solo del salón del usuario)
export const updateService = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, duration, price } = req.body;
  const userId = req.userId;

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

    // Verificar que el servicio pertenece a este salón
    const existingService = await prisma.service.findFirst({
      where: {
        id: Number(id),
        salonId: salon.id
      }
    });

    if (!existingService) {
      return res.status(404).json({ error: 'Servicio no encontrado o no tienes permiso para modificarlo' });
    }

    const service = await prisma.service.update({
      where: { id: Number(id) },
      data: { name, description, duration, price },
    });

    res.json(service);
  } catch (error) {
    logger.error({ error }, 'Error actualizando servicio');
    res.status(500).json({ error: 'Error actualizando servicio' });
  }
};

// Eliminar un servicio (solo del salón del usuario)
export const deleteService = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

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

    // Verificar que el servicio pertenece a este salón
    const service = await prisma.service.findFirst({
      where: {
        id: Number(id),
        salonId: salon.id
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado o no tienes permiso para eliminarlo' });
    }

    await prisma.service.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    logger.error({ error }, 'Error eliminando servicio');
    res.status(500).json({ error: 'Error eliminando servicio' });
  }
};
