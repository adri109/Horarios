import { z } from 'zod';

const permissionsSchema = z
  .object({
    canViewClients: z.boolean(),
    canEditClients: z.boolean(),
    canDeleteClients: z.boolean(),
    canViewPersonal: z.boolean(),
    canEditPersonal: z.boolean(),
    canDeletePersonal: z.boolean(),
    canViewServices: z.boolean(),
    canEditServices: z.boolean(),
    canDeleteServices: z.boolean(),
    canViewInventory: z.boolean(),
    canEditInventory: z.boolean(),
    canDeleteInventory: z.boolean(),
    canViewReports: z.boolean(),
    canViewMarketing: z.boolean(),
    canConfirmAppointments: z.boolean(),
    canCancelAppointments: z.boolean(),
  })
  .partial()
  .strict();

const email = z.string().trim().toLowerCase().email('Email inválido').max(255);
const password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(128);
const name = z.string().trim().max(120);
const phone = z.string().trim().max(25);

export const createWorkerSchema = z
  .object({
    email,
    password,
    name: name.optional().nullable(),
    phone: phone.optional().nullable(),
    permissions: permissionsSchema.optional(),
  })
  .strict();

export const updateWorkerSchema = z
  .object({
    email: email.optional(),
    password: password.optional(),
    name: name.optional().nullable(),
    phone: phone.optional().nullable(),
    permissions: permissionsSchema.optional(),
  })
  .strict();
