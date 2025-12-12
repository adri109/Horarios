import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los servicios del salón del usuario autenticado
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    console.log('📋 getAllServices - userId:', userId);
    
    if (!userId) {
      console.log('❌ No hay userId en la request');
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

    console.log('🏢 Salón encontrado:', salon ? `ID: ${salon.id}, Nombre: ${salon.name}` : 'NULL');

    if (!salon) {
      console.log('❌ Usuario no tiene salón asociado');
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    // Obtener solo los servicios de este salón
    const services = await prisma.service.findMany({
      where: { salonId: salon.id },
      orderBy: { name: 'asc' },
    });
    
    console.log('✅ Servicios encontrados:', services.length);
    res.json(services);
  } catch (error) {
    console.error('❌ Error obteniendo servicios:', error);
    res.status(500).json({ error: 'Error obteniendo servicios' });
  }
};

// Obtener un servicio por ID
export const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo servicio' });
  }
};

// Crear un servicio
export const createService = async (req: Request, res: Response) => {
  const { name, description, duration, price, salonId } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        price,
        salon: {
          connect: { id: Number(salonId) },
        }
      },
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error creando servicio' });
  }
};

// Actualizar un servicio (solo del salón del usuario)
export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, duration, price } = req.body;
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
    console.error('Error actualizando servicio:', error);
    res.status(500).json({ error: 'Error actualizando servicio' });
  }
};

// Eliminar un servicio (solo del salón del usuario)
export const deleteService = async (req: Request, res: Response) => {
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
    console.error('Error eliminando servicio:', error);
    res.status(500).json({ error: 'Error eliminando servicio' });
  }
};
