import { z } from 'zod';

const configSchema = z
  .object({
    requireConfirmation: z.boolean().optional(),
    workersCanCreateServices: z.boolean().optional(),
    canAcceptAppointments: z.boolean().optional(),
    canModifyAppointments: z.boolean().optional(),
  })
  .strict();

export const registerSchema = z
  .object({
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    fullName: z.string().trim().min(2, 'El nombre es obligatorio'),
    phone: z.string().trim().min(7).max(25).optional(),
    salonName: z.string().trim().min(2, 'El nombre del salón es obligatorio'),
    salonAddress: z.string().trim().max(255).optional(),
    salonPhone: z.string().trim().min(7).max(25).optional(),
    config: configSchema.optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.string().trim().email('Email inválido'),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'El token es obligatorio'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  })
  .strict();
