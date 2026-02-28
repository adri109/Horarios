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
exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getAllServices = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const logger_1 = __importDefault(require("../utils/logger"));
// Obtener todos los servicios del salón del usuario autenticado
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        logger_1.default.debug({ userId }, 'getAllServices');
        if (!userId) {
            logger_1.default.warn('No hay userId en la request');
            return res.status(401).json({ error: 'No autenticado' });
        }
        // Buscar el salón del usuario (como admin o trabajador)
        const salon = yield prisma_1.default.salon.findFirst({
            where: {
                OR: [
                    { adminId: userId },
                    { workers: { some: { id: userId } } }
                ]
            }
        });
        logger_1.default.debug({ salonId: salon === null || salon === void 0 ? void 0 : salon.id, salonName: salon === null || salon === void 0 ? void 0 : salon.name }, 'Salón encontrado para servicios');
        if (!salon) {
            logger_1.default.warn({ userId }, 'Usuario no tiene salón asociado');
            return res.status(404).json({ error: 'No tienes un salón asociado' });
        }
        // Obtener solo los servicios de este salón
        const services = yield prisma_1.default.service.findMany({
            where: { salonId: salon.id },
            orderBy: { name: 'asc' },
        });
        logger_1.default.debug({ userId, count: services.length }, 'Servicios encontrados');
        res.json(services);
    }
    catch (error) {
        logger_1.default.error({ error }, 'Error obteniendo servicios');
        res.status(500).json({ error: 'Error obteniendo servicios' });
    }
});
exports.getAllServices = getAllServices;
// Obtener un servicio por ID
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const salon = yield prisma_1.default.salon.findFirst({
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
        const service = yield prisma_1.default.service.findFirst({
            where: {
                id: Number(id),
                salonId: salon.id,
            },
        });
        if (!service) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json(service);
    }
    catch (error) {
        logger_1.default.error({ error }, 'Error obteniendo servicio');
        res.status(500).json({ error: 'Error obteniendo servicio' });
    }
});
exports.getServiceById = getServiceById;
// Crear un servicio
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, duration, price } = req.body;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const salon = yield prisma_1.default.salon.findFirst({
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
        const service = yield prisma_1.default.service.create({
            data: {
                name,
                description,
                duration,
                price,
                salonId: salon.id,
            },
        });
        res.status(201).json(service);
    }
    catch (error) {
        logger_1.default.error({ error }, 'Error creando servicio');
        res.status(500).json({ error: 'Error creando servicio' });
    }
});
exports.createService = createService;
// Actualizar un servicio (solo del salón del usuario)
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, duration, price } = req.body;
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        // Buscar el salón del usuario
        const salon = yield prisma_1.default.salon.findFirst({
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
        // Verificar que el servicio pertenece a este salón
        const existingService = yield prisma_1.default.service.findFirst({
            where: {
                id: Number(id),
                salonId: salon.id
            }
        });
        if (!existingService) {
            return res.status(404).json({ error: 'Servicio no encontrado o no tienes permiso para modificarlo' });
        }
        const service = yield prisma_1.default.service.update({
            where: { id: Number(id) },
            data: { name, description, duration, price },
        });
        res.json(service);
    }
    catch (error) {
        logger_1.default.error({ error }, 'Error actualizando servicio');
        res.status(500).json({ error: 'Error actualizando servicio' });
    }
});
exports.updateService = updateService;
// Eliminar un servicio (solo del salón del usuario)
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        // Buscar el salón del usuario
        const salon = yield prisma_1.default.salon.findFirst({
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
        // Verificar que el servicio pertenece a este salón
        const service = yield prisma_1.default.service.findFirst({
            where: {
                id: Number(id),
                salonId: salon.id
            }
        });
        if (!service) {
            return res.status(404).json({ error: 'Servicio no encontrado o no tienes permiso para eliminarlo' });
        }
        yield prisma_1.default.service.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        logger_1.default.error({ error }, 'Error eliminando servicio');
        res.status(500).json({ error: 'Error eliminando servicio' });
    }
});
exports.deleteService = deleteService;
