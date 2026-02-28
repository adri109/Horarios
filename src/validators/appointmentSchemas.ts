import { z } from 'zod';

export const createAppointmentSchema = z
  .object({
    clientId: z.coerce.number().int().positive(),
    stylistId: z.coerce.number().int().positive(),
    serviceId: z.coerce.number().int().positive(),
    startTime: z.string().datetime('startTime debe ser una fecha ISO válida'),
    endTime: z.string().datetime('endTime debe ser una fecha ISO válida'),
  })
  .strict()
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'endTime debe ser mayor que startTime',
    path: ['endTime'],
  });

export const updateAppointmentStatusSchema = z
  .object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  })
  .strict();
