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
exports.deleteWorker = exports.updateWorker = exports.createWorker = exports.getAllWorkers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// ==========================
// GET ALL WORKERS
// ==========================
const getAllWorkers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        // 1️⃣ Buscar el salón del usuario (solo ADMIN puede ver workers)
        const salon = yield prisma.salon.findFirst({
            where: { adminId: userId },
            include: {
                workers: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        role: true,
                        createdAt: true,
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
                },
            },
        });
        if (!salon) {
            return res.status(403).json({ error: 'Solo los administradores pueden gestionar personal' });
        }
        res.json({ workers: salon.workers });
    }
    catch (error) {
        console.error('💥 Error al obtener workers:', error);
        res.status(500).json({ error: 'Error al obtener el personal' });
    }
});
exports.getAllWorkers = getAllWorkers;
// ==========================
// CREATE WORKER
// ==========================
const createWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { email, password, name, phone, permissions } = req.body;
    try {
        // 1️⃣ Verificar que el usuario es ADMIN de un salón
        const salon = yield prisma.salon.findFirst({
            where: { adminId: userId },
        });
        if (!salon) {
            return res.status(403).json({ error: 'Solo los administradores pueden crear personal' });
        }
        // 2️⃣ Verificar que el email no existe
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        // 3️⃣ Hashear contraseña
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // 4️⃣ Crear usuario WORKER vinculado al salón con permisos
        const worker = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                phone: phone || null,
                role: 'WORKER',
                salonId: salon.id,
                // Permisos (por defecto todos en false excepto los que se envíen)
                canViewClients: (permissions === null || permissions === void 0 ? void 0 : permissions.canViewClients) || true,
                canEditClients: (permissions === null || permissions === void 0 ? void 0 : permissions.canEditClients) || false,
                canDeleteClients: (permissions === null || permissions === void 0 ? void 0 : permissions.canDeleteClients) || false,
                canViewPersonal: (permissions === null || permissions === void 0 ? void 0 : permissions.canViewPersonal) || false,
                canEditPersonal: (permissions === null || permissions === void 0 ? void 0 : permissions.canEditPersonal) || false,
                canDeletePersonal: (permissions === null || permissions === void 0 ? void 0 : permissions.canDeletePersonal) || false,
                canViewServices: (permissions === null || permissions === void 0 ? void 0 : permissions.canViewServices) || true,
                canEditServices: (permissions === null || permissions === void 0 ? void 0 : permissions.canEditServices) || false,
                canDeleteServices: (permissions === null || permissions === void 0 ? void 0 : permissions.canDeleteServices) || false,
                canViewInventory: (permissions === null || permissions === void 0 ? void 0 : permissions.canViewInventory) || false,
                canEditInventory: (permissions === null || permissions === void 0 ? void 0 : permissions.canEditInventory) || false,
                canDeleteInventory: (permissions === null || permissions === void 0 ? void 0 : permissions.canDeleteInventory) || false,
                canViewReports: (permissions === null || permissions === void 0 ? void 0 : permissions.canViewReports) || false,
                canViewMarketing: (permissions === null || permissions === void 0 ? void 0 : permissions.canViewMarketing) || false,
                canConfirmAppointments: (permissions === null || permissions === void 0 ? void 0 : permissions.canConfirmAppointments) || false,
                canCancelAppointments: (permissions === null || permissions === void 0 ? void 0 : permissions.canCancelAppointments) || false,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
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
        res.status(201).json({ worker });
    }
    catch (error) {
        console.error('💥 Error al crear worker:', error);
        res.status(500).json({ error: 'Error al crear el trabajador' });
    }
});
exports.createWorker = createWorker;
// ==========================
// UPDATE WORKER
// ==========================
const updateWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const workerId = parseInt(req.params.id);
    const { email, name, phone, password, permissions } = req.body;
    try {
        // 1️⃣ Verificar que el usuario es ADMIN
        const salon = yield prisma.salon.findFirst({
            where: { adminId: userId },
        });
        if (!salon) {
            return res.status(403).json({ error: 'Solo los administradores pueden editar personal' });
        }
        // 2️⃣ Verificar que el worker pertenece a este salón
        const worker = yield prisma.user.findFirst({
            where: {
                id: workerId,
                salonId: salon.id,
                role: 'WORKER',
            },
        });
        if (!worker) {
            return res.status(404).json({ error: 'Trabajador no encontrado' });
        }
        // 3️⃣ Si cambia el email, verificar que no existe
        if (email && email !== worker.email) {
            const existingEmail = yield prisma.user.findUnique({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
        }
        // 4️⃣ Preparar datos para actualizar
        const updateData = {};
        if (email)
            updateData.email = email;
        if (name !== undefined)
            updateData.name = name;
        if (phone !== undefined)
            updateData.phone = phone;
        if (password) {
            updateData.password = yield bcrypt_1.default.hash(password, 10);
        }
        // Actualizar permisos si se enviaron
        if (permissions) {
            if (permissions.canViewClients !== undefined)
                updateData.canViewClients = permissions.canViewClients;
            if (permissions.canEditClients !== undefined)
                updateData.canEditClients = permissions.canEditClients;
            if (permissions.canDeleteClients !== undefined)
                updateData.canDeleteClients = permissions.canDeleteClients;
            if (permissions.canViewPersonal !== undefined)
                updateData.canViewPersonal = permissions.canViewPersonal;
            if (permissions.canEditPersonal !== undefined)
                updateData.canEditPersonal = permissions.canEditPersonal;
            if (permissions.canDeletePersonal !== undefined)
                updateData.canDeletePersonal = permissions.canDeletePersonal;
            if (permissions.canViewServices !== undefined)
                updateData.canViewServices = permissions.canViewServices;
            if (permissions.canEditServices !== undefined)
                updateData.canEditServices = permissions.canEditServices;
            if (permissions.canDeleteServices !== undefined)
                updateData.canDeleteServices = permissions.canDeleteServices;
            if (permissions.canViewInventory !== undefined)
                updateData.canViewInventory = permissions.canViewInventory;
            if (permissions.canEditInventory !== undefined)
                updateData.canEditInventory = permissions.canEditInventory;
            if (permissions.canDeleteInventory !== undefined)
                updateData.canDeleteInventory = permissions.canDeleteInventory;
            if (permissions.canViewReports !== undefined)
                updateData.canViewReports = permissions.canViewReports;
            if (permissions.canViewMarketing !== undefined)
                updateData.canViewMarketing = permissions.canViewMarketing;
            if (permissions.canConfirmAppointments !== undefined)
                updateData.canConfirmAppointments = permissions.canConfirmAppointments;
            if (permissions.canCancelAppointments !== undefined)
                updateData.canCancelAppointments = permissions.canCancelAppointments;
        }
        // 5️⃣ Actualizar worker
        const updatedWorker = yield prisma.user.update({
            where: { id: workerId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
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
        res.json({ worker: updatedWorker });
    }
    catch (error) {
        console.error('💥 Error al actualizar worker:', error);
        res.status(500).json({ error: 'Error al actualizar el trabajador' });
    }
});
exports.updateWorker = updateWorker;
// ==========================
// DELETE WORKER
// ==========================
const deleteWorker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const workerId = parseInt(req.params.id);
    try {
        // 1️⃣ Verificar que el usuario es ADMIN
        const salon = yield prisma.salon.findFirst({
            where: { adminId: userId },
        });
        if (!salon) {
            return res.status(403).json({ error: 'Solo los administradores pueden eliminar personal' });
        }
        // 2️⃣ Verificar que el worker pertenece a este salón
        const worker = yield prisma.user.findFirst({
            where: {
                id: workerId,
                salonId: salon.id,
                role: 'WORKER',
            },
        });
        if (!worker) {
            return res.status(404).json({ error: 'Trabajador no encontrado' });
        }
        // 3️⃣ Eliminar worker
        yield prisma.user.delete({
            where: { id: workerId },
        });
        res.json({ message: 'Trabajador eliminado exitosamente' });
    }
    catch (error) {
        console.error('💥 Error al eliminar worker:', error);
        res.status(500).json({ error: 'Error al eliminar el trabajador' });
    }
});
exports.deleteWorker = deleteWorker;
