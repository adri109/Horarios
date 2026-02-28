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
exports.deleteClient = exports.updateClient = exports.getClientById = exports.getClients = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Obtener todos los clientes de un salón con estadísticas
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.user.userId;
        // Obtener el salón del usuario
        const user = yield prisma_1.default.user.findUnique({
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
        // Obtener clientes con estadísticas de citas
        const clients = yield prisma_1.default.client.findMany({
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
            var _a;
            const totalAppointments = client.appointments.length;
            const completedAppointments = client.appointments.filter(apt => apt.status === 'COMPLETED').length;
            const cancelledAppointments = client.appointments.filter(apt => apt.status === 'CANCELLED').length;
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
                lastAppointmentDate: (lastAppointment === null || lastAppointment === void 0 ? void 0 : lastAppointment.startTime) || null,
                lastService: ((_a = lastAppointment === null || lastAppointment === void 0 ? void 0 : lastAppointment.service) === null || _a === void 0 ? void 0 : _a.name) || null
            };
        });
        res.json(clientsWithStats);
    }
    catch (error) {
        console.error('❌ Error obteniendo clientes:', error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});
exports.getClients = getClients;
// Obtener detalle de un cliente específico
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.user.userId;
        const clientId = parseInt(req.params.id);
        // Verificar que el cliente pertenece al salón del usuario
        const user = yield prisma_1.default.user.findUnique({
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
        const client = yield prisma_1.default.client.findFirst({
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
    }
    catch (error) {
        console.error('❌ Error obteniendo cliente:', error);
        res.status(500).json({ error: 'Error al obtener cliente' });
    }
});
exports.getClientById = getClientById;
// Actualizar información de un cliente
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.user.userId;
        const clientId = parseInt(req.params.id);
        const { name, phone, email } = req.body;
        // Verificar que el cliente pertenece al salón del usuario
        const user = yield prisma_1.default.user.findUnique({
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
        const client = yield prisma_1.default.client.findFirst({
            where: {
                id: clientId,
                salonId
            }
        });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        // Actualizar cliente
        const updatedClient = yield prisma_1.default.client.update({
            where: { id: clientId },
            data: Object.assign(Object.assign(Object.assign({}, (name && { name })), (phone && { phone })), (email !== undefined && { email: email || null }))
        });
        res.json(updatedClient);
    }
    catch (error) {
        console.error('❌ Error actualizando cliente:', error);
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
});
exports.updateClient = updateClient;
// Eliminar un cliente
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.user.userId;
        const clientId = parseInt(req.params.id);
        // Verificar que el cliente pertenece al salón del usuario
        const user = yield prisma_1.default.user.findUnique({
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
        const client = yield prisma_1.default.client.findFirst({
            where: {
                id: clientId,
                salonId
            }
        });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        // Eliminar cliente (esto también eliminará sus citas por cascada si está configurado)
        yield prisma_1.default.client.delete({
            where: { id: clientId }
        });
        res.json({ message: 'Cliente eliminado correctamente' });
    }
    catch (error) {
        console.error('❌ Error eliminando cliente:', error);
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
});
exports.deleteClient = deleteClient;
