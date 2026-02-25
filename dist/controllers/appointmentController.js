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
exports.updateAppointmentStatus = exports.createAppointment = exports.getAppointmentById = exports.getAllAppointments = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../index");
const prisma = new client_1.PrismaClient();
const getAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        // Buscar el salón del usuario
        const salon = yield prisma.salon.findFirst({
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
        const appointments = yield prisma.appointment.findMany({
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
    }
    catch (error) {
        console.error('Error obteniendo citas:', error);
        res.status(500).json({ error: 'Error obteniendo citas' });
    }
});
exports.getAllAppointments = getAllAppointments;
const getAppointmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        // Buscar el salón del usuario
        const salon = yield prisma.salon.findFirst({
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
        const appointment = yield prisma.appointment.findFirst({
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
    }
    catch (error) {
        console.error('Error obteniendo cita:', error);
        res.status(500).json({ error: 'Error obteniendo cita' });
    }
});
exports.getAppointmentById = getAppointmentById;
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, stylistId, serviceId, startTime, endTime } = req.body;
    try {
        const appointment = yield prisma.appointment.create({
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
            index_1.io.to(`user_${userId}`).emit('appointment-created', { appointmentId: appointment.id });
        });
        res.status(201).json(appointment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creando cita' });
    }
});
exports.createAppointment = createAppointment;
const updateAppointmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        // Buscar el salón y permisos del usuario
        const user = yield prisma.user.findUnique({
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
        const salon = yield prisma.salon.findFirst({
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
        const existingAppointment = yield prisma.appointment.findFirst({
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
        const appointment = yield prisma.appointment.update({
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
            index_1.io.to(`user_${userId}`).emit(eventType, { appointmentId: appointment.id, status });
        });
        res.json(appointment);
    }
    catch (error) {
        console.error('Error actualizando estado de cita:', error);
        res.status(500).json({ error: 'Error actualizando estado de cita' });
    }
});
exports.updateAppointmentStatus = updateAppointmentStatus;
