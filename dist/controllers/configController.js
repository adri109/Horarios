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
exports.deleteBlock = exports.createBlock = exports.deleteSchedule = exports.updateSchedule = exports.createSchedule = exports.updateConfig = exports.getConfig = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtener toda la configuración del salón (config + horarios + bloqueos)
const getConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        // Buscar el salón del usuario (ya sea admin o worker)
        const salon = yield prisma.salon.findFirst({
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
        let config = yield prisma.config.findUnique({
            where: { salonId: salon.id }
        });
        // Si no existe config, crearla con valores por defecto
        if (!config) {
            config = yield prisma.config.create({
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
        const schedules = yield prisma.salonSchedule.findMany({
            where: { salonId: salon.id },
            orderBy: { dayOfWeek: 'asc' }
        });
        // Obtener bloqueos
        const blocks = yield prisma.scheduleBlock.findMany({
            where: { salonId: salon.id },
            orderBy: { date: 'asc' }
        });
        res.json({
            config,
            schedules,
            blocks
        });
    }
    catch (error) {
        console.error('Error obteniendo configuración:', error);
        res.status(500).json({ error: 'Error al obtener la configuración' });
    }
});
exports.getConfig = getConfig;
// Actualizar configuración general
const updateConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { requireConfirmation, workersCanCreateServices, canAcceptAppointments, canModifyAppointments, openingTime, closingTime, serviceIntervalMinutes } = req.body;
        const salon = yield prisma.salon.findFirst({
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
        const config = yield prisma.config.upsert({
            where: { salonId: salon.id },
            update: {
                requireConfirmation,
                workersCanCreateServices,
                canAcceptAppointments,
                canModifyAppointments,
                openingTime,
                closingTime,
                serviceIntervalMinutes
            },
            create: {
                salonId: salon.id,
                requireConfirmation,
                workersCanCreateServices,
                canAcceptAppointments,
                canModifyAppointments,
                openingTime,
                closingTime,
                serviceIntervalMinutes
            }
        });
        res.json(config);
    }
    catch (error) {
        console.error('Error actualizando configuración:', error);
        res.status(500).json({ error: 'Error al actualizar la configuración' });
    }
});
exports.updateConfig = updateConfig;
// Crear horario de un día de la semana (permite múltiples por día)
const createSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { dayOfWeek, openingTime, closingTime, isClosed } = req.body;
        const salon = yield prisma.salon.findFirst({
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
        const schedule = yield prisma.salonSchedule.create({
            data: {
                salonId: salon.id,
                dayOfWeek,
                openingTime,
                closingTime,
                isClosed: isClosed || false
            }
        });
        res.json(schedule);
    }
    catch (error) {
        console.error('Error creando horario:', error);
        res.status(500).json({ error: 'Error al crear el horario' });
    }
});
exports.createSchedule = createSchedule;
// Actualizar horario existente
const updateSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { openingTime, closingTime, isClosed } = req.body;
        const salon = yield prisma.salon.findFirst({
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
        const schedule = yield prisma.salonSchedule.findUnique({
            where: { id: parseInt(id) }
        });
        if (!schedule || schedule.salonId !== salon.id) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }
        const updated = yield prisma.salonSchedule.update({
            where: { id: parseInt(id) },
            data: {
                openingTime,
                closingTime,
                isClosed
            }
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Error actualizando horario:', error);
        res.status(500).json({ error: 'Error al actualizar el horario' });
    }
});
exports.updateSchedule = updateSchedule;
// Eliminar horario de un día
const deleteSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const salon = yield prisma.salon.findFirst({
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
        const schedule = yield prisma.salonSchedule.findUnique({
            where: { id: parseInt(id) }
        });
        if (!schedule || schedule.salonId !== salon.id) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }
        yield prisma.salonSchedule.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Horario eliminado correctamente' });
    }
    catch (error) {
        console.error('Error eliminando horario:', error);
        res.status(500).json({ error: 'Error al eliminar el horario' });
    }
});
exports.deleteSchedule = deleteSchedule;
// Crear bloqueo de fecha
const createBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { date, startTime, endTime, reason } = req.body;
        const salon = yield prisma.salon.findFirst({
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
        const block = yield prisma.scheduleBlock.create({
            data: {
                salonId: salon.id,
                date: new Date(date),
                startTime,
                endTime,
                reason
            }
        });
        res.json(block);
    }
    catch (error) {
        console.error('Error creando bloqueo:', error);
        res.status(500).json({ error: 'Error al crear el bloqueo' });
    }
});
exports.createBlock = createBlock;
// Eliminar bloqueo
const deleteBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const salon = yield prisma.salon.findFirst({
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
        const block = yield prisma.scheduleBlock.findUnique({
            where: { id: parseInt(id) }
        });
        if (!block || block.salonId !== salon.id) {
            return res.status(404).json({ error: 'Bloqueo no encontrado' });
        }
        yield prisma.scheduleBlock.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Bloqueo eliminado correctamente' });
    }
    catch (error) {
        console.error('Error eliminando bloqueo:', error);
        res.status(500).json({ error: 'Error al eliminar el bloqueo' });
    }
});
exports.deleteBlock = deleteBlock;
