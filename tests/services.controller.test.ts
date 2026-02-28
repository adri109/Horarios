import type { Response } from 'express';

const mockPrisma = {
  salon: {
    findFirst: jest.fn(),
  },
  service: {
    create: jest.fn(),
  },
};

jest.mock('../src/utils/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

jest.mock('../src/utils/logger', () => ({
  __esModule: true,
  default: {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { createService } from '../src/controllers/servicesController';

const buildResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('servicesController critical tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createService devuelve 401 si no hay userId autenticado', async () => {
    const req = {
      userId: undefined,
      body: {
        name: 'Corte',
        description: 'Corte clásico',
        duration: 30,
        price: 15,
      },
    } as any;
    const res = buildResponse();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No autenticado' });
  });

  it('createService ignora salonId del cliente y usa el salón del usuario', async () => {
    const req = {
      userId: 7,
      body: {
        name: 'Color',
        description: 'Coloración completa',
        duration: 60,
        price: 45,
        salonId: 9999,
      },
    } as any;
    const res = buildResponse();

    mockPrisma.salon.findFirst.mockResolvedValue({ id: 21, adminId: 7 });
    mockPrisma.service.create.mockResolvedValue({ id: 1, name: 'Color', salonId: 21 });

    await createService(req, res);

    expect(mockPrisma.service.create).toHaveBeenCalledWith({
      data: {
        name: 'Color',
        description: 'Coloración completa',
        duration: 60,
        price: 45,
        salonId: 21,
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
