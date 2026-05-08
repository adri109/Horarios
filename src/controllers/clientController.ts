import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Obtener todos los clientes de un salón con estadísticas
export const getClients = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // Obtener el salón del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        salon: true,
        worksAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const salonId = user.salon?.id || user.worksAt?.id;

    if (!salonId) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    /** Una query de fichas + una de todas las citas del salón; el resto es agregación en memoria . */
    const [clients, salonAppointments] = await Promise.all([
      prisma.client.findMany({
        where: { salonId },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
        orderBy: { id: 'desc' },
      }),
      prisma.appointment.findMany({
        where: { service: { salonId } },
        select: {
          clientId: true,
          status: true,
          startTime: true,
          service: { select: { name: true, price: true } },
        },
      }),
    ]);

    type Agg = {
      total: number;
      completed: number;
      cancelled: number;
      totalSpent: number;
      lastStart: Date | null;
      lastServiceName: string | null;
    };
    const aggByClient = new Map<number, Agg>();

    for (const apt of salonAppointments) {
      let a = aggByClient.get(apt.clientId);
      if (!a) {
        a = {
          total: 0,
          completed: 0,
          cancelled: 0,
          totalSpent: 0,
          lastStart: null,
          lastServiceName: null,
        };
        aggByClient.set(apt.clientId, a);
      }
      a.total += 1;
      if (apt.status === 'COMPLETED') {
        a.completed += 1;
        a.totalSpent += apt.service.price;
      }
      if (apt.status === 'CANCELLED') {
        a.cancelled += 1;
      }
      const st = new Date(apt.startTime);
      if (!a.lastStart || st > a.lastStart) {
        a.lastStart = st;
        a.lastServiceName = apt.service.name;
      }
    }

    const clientsWithStats = clients.map((client) => {
      const a = aggByClient.get(client.id);
      return {
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        totalAppointments: a?.total ?? 0,
        completedAppointments: a?.completed ?? 0,
        cancelledAppointments: a?.cancelled ?? 0,
        totalSpent: a?.totalSpent ?? 0,
        lastAppointmentDate: a?.lastStart ?? null,
        lastService: a?.lastServiceName ?? null,
      };
    });

    res.json(clientsWithStats);
  } catch (error) {
    console.error('❌ Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Obtener detalle de un cliente específico
export const getClientById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const clientId = parseInt(req.params.id);

    // Verificar que el cliente pertenece al salón del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        salon: true,
        worksAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const salonId = user.salon?.id || user.worksAt?.id;

    if (!salonId) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        salonId
      },
      include: {
        appointments: {
          include: {
            service: true,
            stylist: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            startTime: 'desc'
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(client);
  } catch (error) {
    console.error('❌ Error obteniendo cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

// Actualizar información de un cliente
export const updateClient = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const clientId = parseInt(req.params.id);
    const { name, phone, email } = req.body;

    // Verificar que el cliente pertenece al salón del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        salon: true,
        worksAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const salonId = user.salon?.id || user.worksAt?.id;

    if (!salonId) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        salonId
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Actualizar cliente
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email !== undefined && { email: email || null })
      }
    });

    res.json(updatedClient);
  } catch (error) {
    console.error('❌ Error actualizando cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

// Eliminar un cliente
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const clientId = parseInt(req.params.id);

    // Verificar que el cliente pertenece al salón del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        salon: true,
        worksAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const salonId = user.salon?.id || user.worksAt?.id;

    if (!salonId) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        salonId
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Eliminar cliente (esto también eliminará sus citas por cascada si está configurado)
    await prisma.client.delete({
      where: { id: clientId }
    });

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error eliminando cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};
