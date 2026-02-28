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

    // Obtener clientes con estadísticas de citas
    const clients = await prisma.client.findMany({
      where: { salonId },
      include: {
        appointments: {
          include: {
            service: true
          },
          orderBy: {
            startTime: 'desc'
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Calcular estadísticas para cada cliente
    const clientsWithStats = clients.map(client => {
      const totalAppointments = client.appointments.length;
      const completedAppointments = client.appointments.filter(
        apt => apt.status === 'COMPLETED'
      ).length;
      const cancelledAppointments = client.appointments.filter(
        apt => apt.status === 'CANCELLED'
      ).length;
      const totalSpent = client.appointments
        .filter(apt => apt.status === 'COMPLETED')
        .reduce((sum, apt) => sum + apt.service.price, 0);
      
      const lastAppointment = client.appointments[0];

      return {
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalSpent,
        lastAppointmentDate: lastAppointment?.startTime || null,
        lastService: lastAppointment?.service?.name || null
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
