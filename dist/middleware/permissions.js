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
exports.checkAnyPermission = exports.checkPermission = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const logger_1 = __importDefault(require("../utils/logger"));
// Middleware para verificar permisos específicos
const checkPermission = (permission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const userRole = req.userRole;
        logger_1.default.debug({ permission, userId, userRole }, 'Verificando permiso');
        try {
            // ADMIN siempre tiene todos los permisos
            if (userRole === 'ADMIN') {
                logger_1.default.debug({ permission, userId }, 'Permiso concedido automáticamente por rol ADMIN');
                return next();
            }
            // Para WORKER, verificar el permiso específico
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    canViewClients: true,
                    canEditClients: true,
                    canDeleteClients: true,
                    canViewPersonal: true,
                    canEditPersonal: true,
                    canDeletePersonal: true,
                    canViewServices: true,
                    canEditServices: true,
                    canDeleteServices: true,
                    canViewInventory: true,
                    canEditInventory: true,
                    canDeleteInventory: true,
                    canViewReports: true,
                    canViewMarketing: true,
                    canConfirmAppointments: true,
                    canCancelAppointments: true,
                },
            });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Verificar el permiso específico
            const hasPermission = user[permission];
            if (!hasPermission) {
                return res.status(403).json({
                    error: 'No tienes permisos para realizar esta acción',
                    permission
                });
            }
            next();
        }
        catch (error) {
            logger_1.default.error({ error, permission, userId }, 'Error al verificar permisos');
            res.status(500).json({ error: 'Error al verificar permisos' });
        }
    });
};
exports.checkPermission = checkPermission;
// Helper para verificar múltiples permisos (OR)
const checkAnyPermission = (...permissions) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const userRole = req.userRole;
        try {
            // ADMIN siempre tiene todos los permisos
            if (userRole === 'ADMIN') {
                return next();
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    canViewClients: true,
                    canEditClients: true,
                    canDeleteClients: true,
                    canViewPersonal: true,
                    canEditPersonal: true,
                    canDeletePersonal: true,
                    canViewServices: true,
                    canEditServices: true,
                    canDeleteServices: true,
                    canViewInventory: true,
                    canEditInventory: true,
                    canDeleteInventory: true,
                    canViewReports: true,
                    canViewMarketing: true,
                    canConfirmAppointments: true,
                    canCancelAppointments: true,
                },
            });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Verificar si tiene al menos uno de los permisos
            const hasAnyPermission = permissions.some(permission => user[permission] === true);
            if (!hasAnyPermission) {
                return res.status(403).json({
                    error: 'No tienes permisos para realizar esta acción',
                    requiredPermissions: permissions
                });
            }
            next();
        }
        catch (error) {
            logger_1.default.error({ error, permissions, userId }, 'Error al verificar permisos');
            res.status(500).json({ error: 'Error al verificar permisos' });
        }
    });
};
exports.checkAnyPermission = checkAnyPermission;
