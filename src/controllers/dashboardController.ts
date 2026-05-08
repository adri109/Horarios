import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/** Estadísticas del dashboard: pocas queries y datos derivados en memoria local. */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        salon: true,
        worksAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const salonId = user.salon?.id || user.worksAt?.id;

    if (!salonId) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const chartRangeStart = new Date(todayStart);
    chartRangeStart.setDate(chartRangeStart.getDate() - 6);

    const salonApptWhere = { service: { salonId } };

    const [
      currentAndNext,
      todayApps,
      monthCompleted,
      chartCompleted,
      clientsToday,
      clientsWeek,
      clientsMonth,
    ] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          ...salonApptWhere,
          startTime: { gte: todayStart },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        include: {
          client: true,
          service: true,
          stylist: true,
        },
        orderBy: { startTime: 'asc' },
        take: 2,
      }),
      prisma.appointment.findMany({
        where: {
          ...salonApptWhere,
          startTime: { gte: todayStart, lt: todayEnd },
        },
        include: { service: true },
      }),
      prisma.appointment.findMany({
        where: {
          ...salonApptWhere,
          startTime: { gte: monthStart },
          status: 'COMPLETED',
        },
        include: { service: true },
      }),
      prisma.appointment.findMany({
        where: {
          ...salonApptWhere,
          startTime: { gte: chartRangeStart, lt: todayEnd },
          status: 'COMPLETED',
        },
        select: {
          startTime: true,
          service: { select: { price: true, name: true } },
        },
      }),
      prisma.client.findMany({
        where: {
          salonId,
          appointments: {
            some: {
              startTime: { gte: todayStart, lt: todayEnd },
            },
          },
        },
        include: {
          appointments: {
            orderBy: { startTime: 'asc' },
            take: 1,
          },
        },
      }),
      prisma.client.findMany({
        where: {
          salonId,
          appointments: {
            some: {
              startTime: { gte: weekStart },
            },
          },
        },
        include: {
          appointments: {
            orderBy: { startTime: 'asc' },
            take: 1,
          },
        },
      }),
      prisma.client.findMany({
        where: {
          salonId,
          appointments: {
            some: {
              startTime: { gte: monthStart },
            },
          },
        },
        include: {
          appointments: {
            orderBy: { startTime: 'asc' },
            take: 1,
          },
        },
      }),
    ]);

    const currentAppointment =
      currentAndNext.find((apt) => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        return now >= aptStart && now <= aptEnd;
      }) || null;

    const nextAppointment =
      currentAndNext.find((apt) => new Date(apt.startTime) > now) || null;

    const todayCompleted = todayApps.filter((a) => a.status === 'COMPLETED').length;
    const todayCancelled = todayApps.filter((a) => a.status === 'CANCELLED').length;
    const todayPending = todayApps.filter(
      (a) => a.status === 'PENDING' || a.status === 'CONFIRMED',
    ).length;

    const revenueToday = todayApps
      .filter((a) => a.status === 'COMPLETED')
      .reduce((sum, apt) => sum + apt.service.price, 0);

    const revenueMonth = monthCompleted.reduce((sum, apt) => sum + apt.service.price, 0);

    const serviceCount: {
      [key: string]: { name: string; count: number; revenue: number };
    } = {};
    monthCompleted.forEach((apt) => {
      const serviceName = apt.service.name;
      if (!serviceCount[serviceName]) {
        serviceCount[serviceName] = { name: serviceName, count: 0, revenue: 0 };
      }
      serviceCount[serviceName].count++;
      serviceCount[serviceName].revenue += apt.service.price;
    });

    const topServices = Object.values(serviceCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const last7Days: { date: string; revenue: number; appointments: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(todayStart);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const d0 = dayStart.getTime();
      const d1 = dayEnd.getTime();

      let revenue = 0;
      let count = 0;
      for (const apt of chartCompleted) {
        const t = new Date(apt.startTime).getTime();
        if (t >= d0 && t < d1) {
          revenue += apt.service.price;
          count++;
        }
      }
      last7Days.push({
        date: dayStart.toISOString().split('T')[0],
        revenue,
        appointments: count,
      });
    }

    const newClientsToday = clientsToday.filter((client) => {
      const firstAppointment = client.appointments[0];
      return firstAppointment && new Date(firstAppointment.startTime) >= todayStart;
    }).length;

    const newClientsWeek = clientsWeek.filter((client) => {
      const firstAppointment = client.appointments[0];
      return firstAppointment && new Date(firstAppointment.startTime) >= weekStart;
    }).length;

    const newClientsMonth = clientsMonth.filter((client) => {
      const firstAppointment = client.appointments[0];
      return firstAppointment && new Date(firstAppointment.startTime) >= monthStart;
    }).length;

    res.json({
      currentAppointment,
      nextAppointment,
      today: {
        appointments: todayApps.length,
        completed: todayCompleted,
        cancelled: todayCancelled,
        pending: todayPending,
        revenue: revenueToday,
        newClients: newClientsToday,
      },
      week: {
        newClients: newClientsWeek,
      },
      month: {
        revenue: revenueMonth,
        newClients: newClientsMonth,
      },
      charts: {
        last7Days,
        topServices,
      },
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const appointmentId = parseInt(req.params.id);
    const { status } = req.body;

    if (!status || !['COMPLETED', 'CANCELLED', 'CONFIRMED'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        salon: true,
        worksAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const salonId = user.salon?.id || user.worksAt?.id;

    if (!salonId) {
      return res.status(404).json({ error: 'No tienes un salón asociado' });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        service: { salonId },
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        client: true,
        service: true,
        stylist: true,
      },
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error('❌ Error actualizando estado de cita:', error);
    res.status(500).json({ error: 'Error al actualizar estado de cita' });
  }
};
