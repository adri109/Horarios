"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const configSchema = zod_1.z
    .object({
    requireConfirmation: zod_1.z.boolean().optional(),
    workersCanCreateServices: zod_1.z.boolean().optional(),
    canAcceptAppointments: zod_1.z.boolean().optional(),
    canModifyAppointments: zod_1.z.boolean().optional(),
})
    .strict();
exports.registerSchema = zod_1.z
    .object({
    email: zod_1.z.string().trim().email('Email inválido'),
    password: zod_1.z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    fullName: zod_1.z.string().trim().min(2, 'El nombre es obligatorio'),
    phone: zod_1.z.string().trim().min(7).max(25).optional(),
    salonName: zod_1.z.string().trim().min(2, 'El nombre del salón es obligatorio'),
    salonAddress: zod_1.z.string().trim().max(255).optional(),
    salonPhone: zod_1.z.string().trim().min(7).max(25).optional(),
    config: configSchema.optional(),
})
    .strict();
exports.loginSchema = zod_1.z
    .object({
    email: zod_1.z.string().trim().email('Email inválido'),
    password: zod_1.z.string().min(1, 'La contraseña es obligatoria'),
})
    .strict();
exports.forgotPasswordSchema = zod_1.z
    .object({
    email: zod_1.z.string().trim().email('Email inválido'),
})
    .strict();
exports.resetPasswordSchema = zod_1.z
    .object({
    token: zod_1.z.string().min(1, 'El token es obligatorio'),
    newPassword: zod_1.z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
})
    .strict();
