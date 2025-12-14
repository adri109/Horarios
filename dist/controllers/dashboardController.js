"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentStatus = exports.getDashboardStats = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtener estadísticas del dashboard
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.user.userId;
        // Obtener el salón del usuario
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                salon: true,
                worksAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const salonId = ((_a = user.salon) === null || _a === void 0 ? void 0 : _a.id) || ((_b = user.worksAt) === null || _b === void 0 ? void 0 : _b.id);
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
        // Cita actual y próxima
        const currentAndNext = yield prisma.appointment.findMany({
            where: {
                service: { salonId },
                startTime: { gte: todayStart },
                status: { in: ['PENDING', 'CONFIRMED'] }
            },
            include: {
                client: true,
                service: true,
                stylist: true
            },
            orderBy: { startTime: 'asc' },
            take: 2
        });
        const currentAppointment = currentAndNext.find(apt => {
            const aptStart = new Date(apt.startTime);
            const aptEnd = new Date(apt.endTime);
            return now >= aptStart && now <= aptEnd;
        }) || null;
        const nextAppointment = currentAndNext.find(apt => new Date(apt.startTime) > now) || null;
        // Citas de hoy
        const todayAppointments = yield prisma.appointment.findMany({
            where: {
                service: { salonId },
                startTime: { gte: todayStart, lt: todayEnd }
            }
        });
        const todayCompleted = todayAppointments.filter(a => a.status === 'COMPLETED').length;
        const todayCancelled = todayAppointments.filter(a => a.status === 'CANCELLED').length;
        const todayPending = todayAppointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length;
        // Ingresos de hoy
        const todayRevenue = yield prisma.appointment.findMany({
            where: {
                service: { salonId },
                startTime: { gte: todayStart, lt: todayEnd },
                status: 'COMPLETED'
            },
            include: { service: true }
        });
        const revenueToday = todayRevenue.reduce((sum, apt) => sum + apt.service.price, 0);
        // Ingresos del mes
        const monthRevenue = yield prisma.appointment.findMany({
            where: {
                service: { salonId },
                startTime: { gte: monthStart },
                status: 'COMPLETED'
            },
            include: { service: true }
        });
        const revenueMonth = monthRevenue.reduce((sum, apt) => sum + apt.service.price, 0);
        // Nuevos clientes
        const clientsToday = yield prisma.client.findMany({
            where: {
                salonId,
                appointments: {
                    some: {
                        startTime: { gte: todayStart, lt: todayEnd }
                    }
                }
            },
            include: {
                appointments: {
                    orderBy: { startTime: 'asc' },
                    take: 1
                }
            }
        });
        const newClientsToday = clientsToday.filter(client => {
            const firstAppointment = client.appointments[0];
            return firstAppointment && new Date(firstAppointment.startTime) >= todayStart;
        }).length;
        const clientsWeek = yield prisma.client.findMany({
            where: {
                salonId,
                appointments: {
                    some: {
                        startTime: { gte: weekStart }
                    }
                }
            },
            include: {
                appointments: {
                    orderBy: { startTime: 'asc' },
                    take: 1
                }
            }
        });
        const newClientsWeek = clientsWeek.filter(client => {
            const firstAppointment = client.appointments[0];
            return firstAppointment && new Date(firstAppointment.startTime) >= weekStart;
        }).length;
        const clientsMonth = yield prisma.client.findMany({
            where: {
                salonId,
                appointments: {
                    some: {
                        startTime: { gte: monthStart }
                    }
                }
            },
            include: {
                appointments: {
                    orderBy: { startTime: 'asc' },
                    take: 1
                }
            }
        });
        const newClientsMonth = clientsMonth.filter(client => {
            const firstAppointment = client.appointments[0];
            return firstAppointment && new Date(firstAppointment.startTime) >= monthStart;
        }).length;
        // Ingresos por día de los últimos 7 días (para gráfico)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(todayStart);
            dayStart.setDate(dayStart.getDate() - i);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
            const dayRevenue = yield prisma.appointment.findMany({
                where: {
                    service: { salonId },
                    startTime: { gte: dayStart, lt: dayEnd },
                    status: 'COMPLETED'
                },
                include: { service: true }
            });
            const revenue = dayRevenue.reduce((sum, apt) => sum + apt.service.price, 0);
            last7Days.push({
                date: dayStart.toISOString().split('T')[0],
                revenue,
                appointments: dayRevenue.length
            });
        }
        // Servicios más populares del mes
        const monthAppointments = yield prisma.appointment.findMany({
            where: {
                service: { salonId },
                startTime: { gte: monthStart },
                status: 'COMPLETED'
            },
            include: { service: true }
        });
        const serviceCount = {};
        monthAppointments.forEach(apt => {
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
        res.json({
            currentAppointment,
            nextAppointment,
            today: {
                appointments: todayAppointments.length,
                completed: todayCompleted,
                cancelled: todayCancelled,
                pending: todayPending,
                revenue: revenueToday,
                newClients: newClientsToday
            },
            week: {
                newClients: newClientsWeek
            },
            month: {
                revenue: revenueMonth,
                newClients: newClientsMonth
            },
            charts: {
                last7Days,
                topServices
            }
        });
    }
    catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});
exports.getDashboardStats = getDashboardStats;
// Actualizar estado de una cita
const updateAppointmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.user.userId;
        const appointmentId = parseInt(req.params.id);
        const { status } = req.body;
        if (!status || !['COMPLETED', 'CANCELLED', 'CONFIRMED'].includes(status)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }
        // Verificar que la cita pertenece al salón del usuario
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                salon: true,
                worksAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const salonId = ((_a = user.salon) === null || _a === void 0 ? void 0 : _a.id) || ((_b = user.worksAt) === null || _b === void 0 ? void 0 : _b.id);
        if (!salonId) {
            return res.status(404).json({ error: 'No tienes un salón asociado' });
        }
        const appointment = yield prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                service: { salonId }
            }
        });
        if (!appointment) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        // Actualizar el estado
        const updatedAppointment = yield prisma.appointment.update({
            where: { id: appointmentId },
            data: { status },
            include: {
                client: true,
                service: true,
                stylist: true
            }
        });
        res.json(updatedAppointment);
    }
    catch (error) {
        console.error('❌ Error actualizando estado de cita:', error);
        res.status(500).json({ error: 'Error al actualizar estado de cita' });
    }
});
exports.updateAppointmentStatus = updateAppointmentStatus;
