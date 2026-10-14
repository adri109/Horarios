import type { Response } from 'express';

const mockPrisma = {
  salon: { findFirst: jest.fn() },
  user: { findUnique: jest.fn(), create: jest.fn() },
};

jest.mock('../src/utils/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

jest.mock('bcrypt', () => ({
  __esModule: true,
  default: { hash: jest.fn().mockResolvedValue('hash') },
}));

import { createWorker } from '../src/controllers/workerController';
import { publicAppointmentSchema } from '../src/validators/publicSchemas';
import { createWorkerSchema, updateWorkerSchema } from '../src/validators/workerSchemas';
import { updateClientSchema } from '../src/validators/clientSchemas';

const buildResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('publicAppointmentSchema', () => {
  const valid = {
    clientName: 'Ana López',
    clientPhone: '600123123',
    clientEmail: null,
    serviceId: 3,
    startTime: '2026-10-20T09:30:00.000Z',
  };

  it('acepta la petición que envía el formulario público', () => {
    const result = publicAppointmentSchema.safeParse({ ...valid, isStaffBooking: false });
    expect(result.success).toBe(true);
  });

  it('convierte cadenas vacías en null y serviceId numérico en número', () => {
    const result = publicAppointmentSchema.parse({
      ...valid,
      clientPhone: '',
      clientEmail: '',
      serviceId: '3',
    });
    expect(result.clientPhone).toBeNull();
    expect(result.clientEmail).toBeNull();
    expect(result.serviceId).toBe(3);
  });

  it('rechaza una fecha inválida, un email mal formado y campos desconocidos', () => {
    expect(publicAppointmentSchema.safeParse({ ...valid, startTime: 'mañana' }).success).toBe(false);
    expect(publicAppointmentSchema.safeParse({ ...valid, clientEmail: 'no-es-email' }).success).toBe(false);
    expect(publicAppointmentSchema.safeParse({ ...valid, salonId: 99 }).success).toBe(false);
  });

  it('rechaza nombres demasiado largos', () => {
    const result = publicAppointmentSchema.safeParse({ ...valid, clientName: 'a'.repeat(121) });
    expect(result.success).toBe(false);
  });
});

describe('workerSchemas', () => {
  it('exige email válido y contraseña de al menos 8 caracteres al crear', () => {
    expect(createWorkerSchema.safeParse({ email: 'x@y.es', password: 'corta' }).success).toBe(false);
    expect(createWorkerSchema.safeParse({ email: 'no-email', password: '12345678' }).success).toBe(false);
    expect(createWorkerSchema.safeParse({ email: 'x@y.es', password: '12345678' }).success).toBe(true);
  });

  it('rechaza permisos desconocidos (p. ej. escalar a ADMIN)', () => {
    const result = updateWorkerSchema.safeParse({ permissions: { isAdmin: true } });
    expect(result.success).toBe(false);
    expect(updateWorkerSchema.safeParse({ role: 'ADMIN' }).success).toBe(false);
  });
});

describe('updateClientSchema', () => {
  it('permite vaciar el email pero no enviar uno inválido', () => {
    expect(updateClientSchema.safeParse({ email: '' }).success).toBe(true);
    expect(updateClientSchema.safeParse({ email: 'mal' }).success).toBe(false);
  });
});

describe('createWorker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('respeta permissions.canViewClients = false (antes se forzaba a true)', async () => {
    mockPrisma.salon.findFirst.mockResolvedValue({ id: 1, adminId: 10 });
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 2 });

    const res = buildResponse();
    await createWorker(
      {
        userId: 10,
        body: {
          email: 'w@salon.es',
          password: '12345678',
          permissions: { canViewClients: false, canViewServices: false },
        },
      } as any,
      res
    );

    const { data } = mockPrisma.user.create.mock.calls[0][0];
    expect(data.canViewClients).toBe(false);
    expect(data.canViewServices).toBe(false);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('mantiene por defecto canViewClients y canViewServices activados', async () => {
    mockPrisma.salon.findFirst.mockResolvedValue({ id: 1, adminId: 10 });
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 2 });

    await createWorker(
      { userId: 10, body: { email: 'w@salon.es', password: '12345678' } } as any,
      buildResponse()
    );

    const { data } = mockPrisma.user.create.mock.calls[0][0];
    expect(data.canViewClients).toBe(true);
    expect(data.canViewServices).toBe(true);
  });
});
