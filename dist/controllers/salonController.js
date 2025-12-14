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
exports.getSalonSlots = exports.getSalonBySlug = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSalonBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { slug } = req.params;
    try {
        const salon = yield prisma.salon.findUnique({
            where: { slug },
            include: { services: true, config: true },
        });
        if (!salon)
            return res.status(404).json({ error: 'Salón no encontrado' });
        // Generar slots de ejemplo si existe config
        let availableSlots = [];
        if (salon.config) {
            const openingTime = salon.config.openingTime || '09:00';
            const closingTime = salon.config.closingTime || '18:00';
            const serviceIntervalMinutes = (_a = salon.config.serviceIntervalMinutes) !== null && _a !== void 0 ? _a : 30;
            const [openHour, openMinute] = openingTime.split(':').map(Number);
            const [closeHour, closeMinute] = closingTime.split(':').map(Number);
            let currentMinutes = openHour * 60 + openMinute;
            const endMinutes = closeHour * 60 + closeMinute;
            while (currentMinutes + serviceIntervalMinutes <= endMinutes) {
                const hour = Math.floor(currentMinutes / 60);
                const minute = currentMinutes % 60;
                availableSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
                currentMinutes += serviceIntervalMinutes;
            }
        }
        res.json({ salon, services: salon.services, availableSlots });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
exports.getSalonBySlug = getSalonBySlug;
const getSalonSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { slug } = req.params;
    const { date } = req.query;
    if (!date || typeof date !== 'string')
        return res.status(400).json({ error: 'Falta la fecha' });
    try {
        const salon = yield prisma.salon.findUnique({
            where: { slug },
            include: { config: true },
        });
        if (!salon)
            return res.status(404).json({ error: 'Salón no encontrado' });
        if (!salon.config)
            return res.status(400).json({ error: 'Configuración de salón no encontrada' });
        const openingTime = salon.config.openingTime || '09:00';
        const closingTime = salon.config.closingTime || '18:00';
        const serviceIntervalMinutes = (_a = salon.config.serviceIntervalMinutes) !== null && _a !== void 0 ? _a : 30;
        const [openHour, openMinute] = openingTime.split(':').map(Number);
        const [closeHour, closeMinute] = closingTime.split(':').map(Number);
        let currentMinutes = openHour * 60 + openMinute;
        const endMinutes = closeHour * 60 + closeMinute;
        const allSlots = [];
        while (currentMinutes + serviceIntervalMinutes <= endMinutes) {
            const hour = Math.floor(currentMinutes / 60);
            const minute = currentMinutes % 60;
            allSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            currentMinutes += serviceIntervalMinutes;
        }
        const appointments = yield prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: new Date(`${date}T00:00:00`),
                    lte: new Date(`${date}T23:59:59`),
                },
            },
            select: { startTime: true },
        });
        const occupiedSlots = appointments.map(a => new Date(a.startTime).toTimeString().slice(0, 5));
        res.json({ allSlots, occupiedSlots });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo slots' });
    }
});
exports.getSalonSlots = getSalonSlots;
