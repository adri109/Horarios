import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSalonBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const salon = await prisma.salon.findUnique({
      where: { slug },
      include: { services: true, config: true },
    });

    if (!salon) return res.status(404).json({ error: 'Salón no encontrado' });

    // Generar slots de ejemplo si existe config
    let availableSlots: string[] = [];
    if (salon.config) {
      const openingTime = salon.config.openingTime || '09:00';
      const closingTime = salon.config.closingTime || '18:00';
      const serviceIntervalMinutes = salon.config.serviceIntervalMinutes ?? 30;

      const [openHour, openMinute] = openingTime.split(':').map(Number);
      const [closeHour, closeMinute] = closingTime.split(':').map(Number);

      let currentMinutes = openHour * 60 + openMinute;
      const endMinutes = closeHour * 60 + closeMinute;

      while (currentMinutes + serviceIntervalMinutes <= endMinutes) {
        const hour = Math.floor(currentMinutes / 60);
        const minute = currentMinutes % 60;
        availableSlots.push(
          `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`
        );
        currentMinutes += serviceIntervalMinutes;
      }
    }

    res.json({ salon, services: salon.services, availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getSalonSlots = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { date } = req.query;

  if (!date || typeof date !== 'string')
    return res.status(400).json({ error: 'Falta la fecha' });

  try {
    const salon = await prisma.salon.findUnique({
      where: { slug },
      include: { config: true },
    });

    if (!salon) return res.status(404).json({ error: 'Salón no encontrado' });
    if (!salon.config)
      return res.status(400).json({ error: 'Configuración de salón no encontrada' });

    const openingTime = salon.config.openingTime || '09:00';
    const closingTime = salon.config.closingTime || '18:00';
    const serviceIntervalMinutes = salon.config.serviceIntervalMinutes ?? 30;

    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);

    let currentMinutes = openHour * 60 + openMinute;
    const endMinutes = closeHour * 60 + closeMinute;

    const allSlots: string[] = [];
    while (currentMinutes + serviceIntervalMinutes <= endMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const minute = currentMinutes % 60;
      allSlots.push(
        `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`
      );
      currentMinutes += serviceIntervalMinutes;
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: new Date(`${date}T00:00:00`),
          lte: new Date(`${date}T23:59:59`),
        },
      },
      select: { startTime: true },
    });

    const occupiedSlots = appointments.map(a =>
      new Date(a.startTime).toTimeString().slice(0,5)
    );

    res.json({ allSlots, occupiedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo slots' });
  }
};

export const updateSalonInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, address, city, phone, description } = req.body;

    // Buscar el salón del usuario admin
    const salon = await prisma.salon.findFirst({
      where: { adminId: userId }
    });

    if (!salon) {
      return res.status(404).json({ error: 'Salón no encontrado' });
    }

    // Actualizar información del salón
    const updatedSalon = await prisma.salon.update({
      where: { id: salon.id },
      data: {
        name: name || salon.name,
        address: address || salon.address,
        city: city || salon.city,
        phone: phone || salon.phone,
        description: description || salon.description
      }
    });

    res.json(updatedSalon);
  } catch (error) {
    console.error('Error actualizando información del salón:', error);
    res.status(500).json({ error: 'Error actualizando información' });
  }
};
