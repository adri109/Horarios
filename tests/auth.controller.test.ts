import type { Request, Response } from 'express';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  salon: {
    create: jest.fn(),
  },
  config: {
    create: jest.fn(),
  },
};

jest.mock('../src/utils/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

import bcrypt from 'bcrypt';
import { login, register } from '../src/controllers/authController';

const buildResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authController critical tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('login devuelve 401 cuando la contraseña es inválida', async () => {
    const req = {
      body: { email: 'admin@test.com', password: 'bad-pass' },
    } as Request;
    const res = buildResponse();

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'admin@test.com',
      password: 'hashed',
      role: 'ADMIN',
      name: 'Admin',
      salon: { id: 10 },
      worksAt: null,
      canViewClients: true,
      canEditClients: true,
      canDeleteClients: true,
      canViewPersonal: true,
      canEditPersonal: true,
      canDeletePersonal: true,
      canViewServices: true,
      canEditServices: true,
      canDeleteServices: true,
      canViewInventory: true,
      canEditInventory: true,
      canDeleteInventory: true,
      canViewReports: true,
      canViewMarketing: true,
      canConfirmAppointments: true,
      canCancelAppointments: true,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' });
  });

  it('register falla con 500 si JWT_SECRET no está configurado', async () => {
    delete process.env.JWT_SECRET;

    const req = {
      body: {
        email: 'new@test.com',
        password: '123456',
        fullName: 'Nuevo Usuario',
        salonName: 'Salon Demo',
      },
    } as Request;
    const res = buildResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Configuración de autenticación inválida' });
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });
});
