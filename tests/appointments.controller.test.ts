import type { Response } from 'express';

const emitMock = jest.fn();
const toMock = jest.fn(() => ({ emit: emitMock }));

const mockPrisma = {
  salon: {
    findFirst: jest.fn(),
  },
  service: {
    findFirst: jest.fn(),
  },
  client: {
    findFirst: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
  },
  appointment: {
    create: jest.fn(),
  },
};

jest.mock('../src/index', () => ({
  __esModule: true,
  io: {
    to: toMock,
  },
}));

jest.mock('../src/utils/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

import { createAppointment } from '../src/controllers/appointmentController';

const buildResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('appointmentController critical tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createAppointment devuelve 404 cuando el servicio no pertenece al salón del usuario', async () => {
    const req = {
      userId: 3,
      body: {
        clientId: 10,
        stylistId: 20,
        serviceId: 30,
        startTime: '2026-03-01T10:00:00.000Z',
        endTime: '2026-03-01T10:30:00.000Z',
      },
    } as any;
    const res = buildResponse();

    mockPrisma.salon.findFirst.mockResolvedValue({ id: 55, adminId: 3 });
    mockPrisma.service.findFirst.mockResolvedValue(null);

    await createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Servicio no encontrado o no pertenece a tu salón' });
  });

  it('createAppointment crea cita con entidades validadas del salón autenticado', async () => {
    const req = {
      userId: 3,
      body: {
        clientId: 10,
        stylistId: 20,
        serviceId: 30,
        startTime: '2026-03-01T10:00:00.000Z',
        endTime: '2026-03-01T10:30:00.000Z',
      },
    } as any;
    const res = buildResponse();

    mockPrisma.salon.findFirst.mockResolvedValue({ id: 55, adminId: 3 });
    mockPrisma.service.findFirst.mockResolvedValue({ id: 30, salonId: 55 });
    mockPrisma.client.findFirst.mockResolvedValue({ id: 10, salonId: 55 });
    mockPrisma.user.findFirst.mockResolvedValue({ id: 20 });
    mockPrisma.appointment.create.mockResolvedValue({
      id: 99,
      service: {
        salon: {
          adminId: 3,
          workers: [{ id: 8 }, { id: 9 }],
        },
      },
    });

    await createAppointment(req, res);

    expect(mockPrisma.appointment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          clientId: 10,
          stylistId: 20,
          serviceId: 30,
          startTime: new Date('2026-03-01T10:00:00.000Z'),
          endTime: new Date('2026-03-01T10:30:00.000Z'),
        },
      })
    );
    expect(toMock).toHaveBeenCalledTimes(3);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
