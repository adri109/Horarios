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
exports.createNotification = exports.markAllAsRead = exports.markAsRead = exports.getUnreadNotifications = exports.getNotifications = void 0;
const index_1 = require("../index");
const prisma_1 = __importDefault(require("../utils/prisma"));
// Obtener todas las notificaciones del usuario
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const notifications = yield prisma_1.default.notification.findMany({
            where: { userId },
            orderBy: { sentAt: 'desc' },
            take: 20 // Últimas 20 notificaciones
        });
        res.json(notifications);
    }
    catch (error) {
        console.error('❌ Error obteniendo notificaciones:', error);
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
});
exports.getNotifications = getNotifications;
// Obtener notificaciones no leídas
const getUnreadNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const notifications = yield prisma_1.default.notification.findMany({
            where: {
                userId,
                read: false
            },
            orderBy: { sentAt: 'desc' }
        });
        res.json(notifications);
    }
    catch (error) {
        console.error('❌ Error obteniendo notificaciones no leídas:', error);
        res.status(500).json({ error: 'Error al obtener notificaciones no leídas' });
    }
});
exports.getUnreadNotifications = getUnreadNotifications;
// Marcar notificación como leída
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const notification = yield prisma_1.default.notification.findFirst({
            where: {
                id: parseInt(id),
                userId
            }
        });
        if (!notification) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }
        const updated = yield prisma_1.default.notification.update({
            where: { id: parseInt(id) },
            data: { read: true }
        });
        res.json(updated);
    }
    catch (error) {
        console.error('❌ Error marcando notificación como leída:', error);
        res.status(500).json({ error: 'Error al marcar notificación como leída' });
    }
});
exports.markAsRead = markAsRead;
// Marcar todas las notificaciones como leídas
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        yield prisma_1.default.notification.updateMany({
            where: {
                userId,
                read: false
            },
            data: { read: true }
        });
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    }
    catch (error) {
        console.error('❌ Error marcando todas las notificaciones como leídas:', error);
        res.status(500).json({ error: 'Error al marcar todas las notificaciones como leídas' });
    }
});
exports.markAllAsRead = markAllAsRead;
// Crear una notificación (uso interno)
const createNotification = (userId, message, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield prisma_1.default.notification.create({
            data: {
                userId,
                message,
                type,
                read: false
            }
        });
        // Emitir evento WebSocket al usuario específico
        index_1.io.to(`user_${userId}`).emit('new-notification', notification);
        console.log(`📡 Notificación emitida via WebSocket a user_${userId}`);
        return notification;
    }
    catch (error) {
        console.error('❌ Error creando notificación:', error);
        return null;
    }
});
exports.createNotification = createNotification;
