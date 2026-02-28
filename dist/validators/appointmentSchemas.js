"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentStatusSchema = exports.createAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.createAppointmentSchema = zod_1.z
    .object({
    clientId: zod_1.z.coerce.number().int().positive(),
    stylistId: zod_1.z.coerce.number().int().positive(),
    serviceId: zod_1.z.coerce.number().int().positive(),
    startTime: zod_1.z.string().datetime('startTime debe ser una fecha ISO válida'),
    endTime: zod_1.z.string().datetime('endTime debe ser una fecha ISO válida'),
})
    .strict()
    .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'endTime debe ser mayor que startTime',
    path: ['endTime'],
});
exports.updateAppointmentStatusSchema = zod_1.z
    .object({
    status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
})
    .strict();
