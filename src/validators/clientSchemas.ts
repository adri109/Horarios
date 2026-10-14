import { z } from 'zod';

export const updateClientSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre no puede estar vacío').max(120).optional(),
    phone: z.string().trim().max(25).optional(),
    email: z
      .union([z.literal(''), z.string().trim().email('Email inválido').max(255), z.null()])
      .optional(),
  })
  .strict();
