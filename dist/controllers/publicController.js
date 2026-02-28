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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublicAppointment = exports.getSalonSlots = exports.getSalonPublic = void 0;
const notificationService_1 = require("../services/notificationService");
const notificationController_1 = require("../controllers/notificationController");
const prisma_1 = __importDefault(require("../utils/prisma"));
// Obtener los datos públicos del salón y servicios
const getSalonPublic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { slug } = req.params;
    try {
        const salon = yield prisma_1.default.salon.findUnique({
            where: { slug },
            include: {
                services: true,
                config: true, // incluimos config para horarios
                schedules: true, // incluir horarios semanales
            },
        });
        if (!salon)
            return res.status(404).json({ error: 'Salón no encontrado' });
        // Generar slots de ejemplo para hoy (opcional)
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
        res.json({
            salon,
            services: salon.services,
            availableSlots, // slots generados automáticamente
            customization: {
                background: ((_b = salon.config) === null || _b === void 0 ? void 0 : _b.publicPageBackground) || 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100',
                primaryColor: ((_c = salon.config) === null || _c === void 0 ? void 0 : _c.publicPagePrimaryColor) || '#9333ea',
                secondaryColor: ((_d = salon.config) === null || _d === void 0 ? void 0 : _d.publicPageSecondaryColor) || '#ec4899'
            }
        });
    }
    catch (error) {
        console.error('💥 Error al obtener salón público:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
exports.getSalonPublic = getSalonPublic;
// Obtener slots de un salón para una fecha específica
const getSalonSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { slug } = req.params;
    const { date, serviceId, duration } = req.query;
    if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: 'Falta la fecha' });
    }
    const serviceDuration = duration ? parseInt(duration, 10) : 30;
    try {
        const salon = yield prisma_1.default.salon.findUnique({
            where: { slug },
            include: {
                config: true,
                schedules: true,
                scheduleBlocks: true,
            },
        });
        if (!salon)
            return res.status(404).json({ error: 'Salón no encontrado' });
        // Obtener día de la semana (0 = domingo, 1 = lunes, etc.)
        const dateObj = new Date(date + 'T00:00:00');
        const dayOfWeek = dateObj.getDay();
        console.log(`📅 Fecha solicitada: ${date}, día de semana: ${dayOfWeek}`);
        // Buscar horarios configurados para este día
        const daySchedules = ((_a = salon.schedules) === null || _a === void 0 ? void 0 : _a.filter(s => s.dayOfWeek === dayOfWeek)) || [];
        console.log(`🕐 Horarios encontrados para el día: ${daySchedules.length}`);
        // Si el día está marcado como cerrado, no hay slots
        if (daySchedules.length > 0 && daySchedules[0].isClosed) {
            console.log(`🚫 Día marcado como cerrado`);
            return res.json({
                availableSlots: [],
                message: 'El salón está cerrado este día',
            });
        }
        // Si no hay horarios configurados, retornar vacío
        if (daySchedules.length === 0) {
            console.log(`⚠️ No hay horarios configurados para este día`);
            return res.json({
                availableSlots: [],
                message: 'No hay horarios configurados para este día',
            });
        }
        // Crear intervalos de tiempo disponibles desde los horarios configurados
        const timeIntervals = daySchedules.map(schedule => {
            const [openHour, openMinute] = schedule.openingTime.split(':').map(Number);
            const [closeHour, closeMinute] = schedule.closingTime.split(':').map(Number);
            return {
                start: openHour * 60 + openMinute,
                end: closeHour * 60 + closeMinute,
            };
        });
        console.log(`⏰ Intervalos de tiempo configurados:`, timeIntervals);
        // Consultar citas existentes para esa fecha con información del servicio
        const appointments = yield prisma_1.default.appointment.findMany({
            where: {
                startTime: {
                    gte: new Date(`${date}T00:00:00Z`),
                    lte: new Date(`${date}T23:59:59Z`),
                },
                service: {
                    salonId: salon.id,
                },
                status: {
                    not: 'CANCELLED',
                },
            },
            include: {
                service: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });
        console.log(`📅 Calculando slots para ${date}, servicio de ${serviceDuration} min`);
        console.log(`📋 Citas existentes: ${appointments.length}`);
        // Crear array de intervalos ocupados [inicio, fin] en minutos desde medianoche
        const occupiedIntervals = appointments.map(apt => {
            const start = new Date(apt.startTime);
            const startMinutes = start.getHours() * 60 + start.getMinutes();
            const endMinutes = startMinutes + apt.service.duration;
            console.log(`  - Cita: ${apt.service.name} de ${startMinutes} a ${endMinutes} (${apt.service.duration} min)`);
            return { start: startMinutes, end: endMinutes };
        });
        // Obtener hora actual para validar slots en el día de hoy
        const now = new Date();
        const isToday = dateObj.toDateString() === now.toDateString();
        const currentMinutes = isToday ? (now.getHours() * 60 + now.getMinutes()) : -1;
        console.log(`🕐 Hora actual: ${now.getHours()}:${now.getMinutes()}, isToday: ${isToday}`);
        // Función para verificar si un slot está disponible y ocupado
        const checkSlotStatus = (slotStartMinutes) => {
            const slotEndMinutes = slotStartMinutes + serviceDuration;
            // Verificar si el slot ya pasó (solo para hoy)
            if (isToday && slotStartMinutes <= currentMinutes) {
                return { available: false, occupied: false, passed: true };
            }
            // Verificar que el slot esté dentro de algún intervalo de tiempo configurado
            let isInWorkingHours = false;
            for (const interval of timeIntervals) {
                if (slotStartMinutes >= interval.start && slotEndMinutes <= interval.end) {
                    isInWorkingHours = true;
                    break;
                }
            }
            if (!isInWorkingHours)
                return { available: false, occupied: false, passed: false };
            // Verificar si se solapa con alguna cita existente
            let isOccupied = false;
            for (const interval of occupiedIntervals) {
                if (slotStartMinutes < interval.end && slotEndMinutes > interval.start) {
                    isOccupied = true;
                    break;
                }
            }
            return { available: !isOccupied, occupied: isOccupied, passed: false };
        };
        // Generar todos los slots con su estado (disponible/ocupado/pasado)
        const allSlots = [];
        const SLOT_INTERVAL = 15; // Intentar slots cada 15 minutos
        // Generar slots para cada intervalo de tiempo configurado
        for (const interval of timeIntervals) {
            let currentMinutes = interval.start;
            while (currentMinutes < interval.end) {
                const status = checkSlotStatus(currentMinutes);
                if (status.available || status.occupied || status.passed) {
                    const hour = Math.floor(currentMinutes / 60);
                    const minute = currentMinutes % 60;
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    allSlots.push({
                        time: timeStr,
                        available: status.available,
                        occupied: status.occupied,
                        passed: status.passed,
                    });
                }
                currentMinutes += SLOT_INTERVAL;
            }
        }
        const availableSlots = allSlots.filter(s => s.available).map(s => s.time);
        const passedSlots = allSlots.filter(s => s.passed).length;
        console.log(`✅ Slots totales: ${allSlots.length}, Disponibles: ${availableSlots.length}, Pasados: ${passedSlots}`);
        res.json({
            availableSlots, // Mantener retrocompatibilidad
            allSlots, // Nueva propiedad con todos los slots y su estado
            serviceDuration,
            schedules: daySchedules.map(s => ({ opening: s.openingTime, closing: s.closingTime })),
            appointmentsCount: appointments.length,
        });
    }
    catch (error) {
        console.error('💥 Error obteniendo slots:', error);
        res.status(500).json({ error: 'Error obteniendo slots' });
    }
});
exports.getSalonSlots = getSalonSlots;
// Crear una cita desde la página pública
const createPublicAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const { clientName, clientPhone, clientEmail, serviceId, startTime, isStaffBooking } = req.body;
    // Validaciones
    if (!clientName || !serviceId || !startTime) {
        return res.status(400).json({
            error: 'Faltan datos requeridos: clientName, serviceId, startTime'
        });
    }
    if (!clientPhone && !clientEmail) {
        return res.status(400).json({
            error: 'Debes proporcionar al menos un método de contacto (teléfono o email)'
        });
    }
    try {
        // 1. Obtener el salón
        const salon = yield prisma_1.default.salon.findUnique({
            where: { slug },
            include: { admin: true },
        });
        if (!salon)
            return res.status(404).json({ error: 'Salón no encontrado' });
        // 2. Verificar que el servicio existe y pertenece al salón
        const service = yield prisma_1.default.service.findFirst({
            where: {
                id: parseInt(serviceId, 10),
                salonId: salon.id,
            },
        });
        if (!service) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        // 3. Calcular endTime
        const start = new Date(startTime);
        const end = new Date(start.getTime() + service.duration * 60000);
        console.log(`📅 Creando cita: ${clientName} - ${service.name}`);
        console.log(`🕐 Horario: ${start.toISOString()} - ${end.toISOString()}`);
        // 4. Verificar que no hay conflictos (opcional pero recomendado)
        const conflictingAppointments = yield prisma_1.default.appointment.findMany({
            where: {
                service: { salonId: salon.id },
                status: { not: 'CANCELLED' },
                OR: [
                    {
                        AND: [
                            { startTime: { lte: start } },
                            { endTime: { gt: start } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lt: end } },
                            { endTime: { gte: end } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { gte: start } },
                            { endTime: { lte: end } },
                        ],
                    },
                ],
            },
        });
        if (conflictingAppointments.length > 0) {
            return res.status(409).json({
                error: 'Este horario ya no está disponible. Por favor, selecciona otro.'
            });
        }
        // 5. Crear o buscar el cliente
        let client = yield prisma_1.default.client.findFirst({
            where: {
                salonId: salon.id,
                OR: [
                    clientPhone ? { phone: clientPhone } : {},
                    clientEmail ? { email: clientEmail } : {},
                ].filter(obj => Object.keys(obj).length > 0),
            },
        });
        if (!client) {
            client = yield prisma_1.default.client.create({
                data: {
                    name: clientName,
                    phone: clientPhone || null,
                    email: clientEmail || null,
                    salonId: salon.id,
                },
            });
            console.log(`✅ Cliente creado: ${client.name} (ID: ${client.id})`);
        }
        else {
            console.log(`✅ Cliente existente: ${client.name} (ID: ${client.id})`);
        }
        // 6. Crear la cita (stylistId será el admin del salón por defecto)
        const appointment = yield prisma_1.default.appointment.create({
            data: {
                clientId: client.id,
                stylistId: salon.adminId,
                serviceId: service.id,
                startTime: start,
                endTime: end,
                status: 'PENDING',
            },
            include: {
                client: true,
                service: true,
                stylist: true,
            },
        });
        console.log(`✅ Cita creada exitosamente (ID: ${appointment.id})`);
        // Solo enviar notificaciones si NO es una reserva de trabajador
        if (!isStaffBooking) {
            // Crear notificación en el sistema para el admin
            const formattedDate = start.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            yield (0, notificationController_1.createNotification)(salon.adminId, `Nueva cita: ${clientName} - ${service.name} el ${formattedDate}`, 'REMINDER');
            // Enviar notificaciones de confirmación
            const notificationData = {
                clientName: appointment.client.name,
                clientEmail: clientEmail || undefined,
                clientPhone: clientPhone || undefined,
                salonName: salon.name,
                serviceName: appointment.service.name,
                date: appointment.startTime.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: appointment.startTime.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                duration: appointment.service.duration,
                price: appointment.service.price,
                salonAddress: salon.address || undefined,
                salonPhone: salon.phone || undefined,
            };
            // Enviar notificaciones de forma asíncrona (no bloquea la respuesta)
            (0, notificationService_1.sendAppointmentNotifications)(notificationData)
                .then(result => {
                console.log(`📧 Notificaciones enviadas - Email: ${result.emailSent ? '✅' : '❌'}, SMS: ${result.smsSent ? '✅' : '❌'}`);
            })
                .catch(err => {
                console.error('❌ Error enviando notificaciones:', err);
            });
        }
        else {
            console.log(`🔕 Reserva de trabajador - Sin notificaciones`);
        }
        res.status(201).json({
            message: 'Cita creada exitosamente',
            appointment: {
                id: appointment.id,
                clientName: appointment.client.name,
                serviceName: appointment.service.name,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                status: appointment.status,
                price: appointment.service.price,
            },
        });
    }
    catch (error) {
        console.error('💥 Error creando cita:', error);
        res.status(500).json({
            error: 'Error al crear la cita',
            details: error.message
        });
    }
});
exports.createPublicAppointment = createPublicAppointment;
