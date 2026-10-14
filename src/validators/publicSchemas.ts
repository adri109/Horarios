import { z } from 'zod';

// El formulario público envía cadenas vacías como null; aquí se normalizan.
const emptyToNull = (value: unknown) => (value === '' ? null : value);

export const publicAppointmentSchema = z
  .object({
    clientName: z.string().trim().min(2, 'El nombre es obligatorio').max(120),
    clientPhone: z.preprocess(emptyToNull, z.string().trim().max(25).nullable().optional()),
    clientEmail: z.preprocess(
      emptyToNull,
      z.string().trim().email('Email inválido').max(255).nullable().optional()
    ),
    serviceId: z.coerce.number().int().positive(),
    startTime: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Fecha y hora inválidas'),
    isStaffBooking: z.boolean().optional(),
  })
  .strict();
