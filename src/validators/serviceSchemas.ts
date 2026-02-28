import { z } from 'zod';

const serviceBaseSchema = {
  name: z.string().trim().min(2, 'El nombre es obligatorio').max(120),
  description: z.string().trim().max(500).optional().nullable(),
  duration: z.coerce
    .number()
    .int('La duración debe ser un número entero')
    .positive('La duración debe ser mayor que 0'),
  price: z.coerce.number().nonnegative('El precio no puede ser negativo'),
};

export const createServiceSchema = z.object(serviceBaseSchema).strict();

export const updateServiceSchema = z
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
