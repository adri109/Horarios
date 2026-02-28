"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.createServiceSchema = void 0;
const zod_1 = require("zod");
const serviceBaseSchema = {
    name: zod_1.z.string().trim().min(2, 'El nombre es obligatorio').max(120),
    description: zod_1.z.string().trim().max(500).optional().nullable(),
    duration: zod_1.z.coerce
        .number()
        .int('La duración debe ser un número entero')
        .positive('La duración debe ser mayor que 0'),
    price: zod_1.z.coerce.number().nonnegative('El precio no puede ser negativo'),
};
exports.createServiceSchema = zod_1.z.object(serviceBaseSchema).strict();
exports.updateServiceSchema = zod_1.z
    .object({
    name: serviceBaseSchema.name.optional(),
    description: serviceBaseSchema.description.optional(),
    duration: serviceBaseSchema.duration.optional(),
    price: serviceBaseSchema.price.optional(),
})
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
});
