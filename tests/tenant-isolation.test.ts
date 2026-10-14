import type { Response } from 'express';

/**
 * Aislamiento multi-tenant: un usuario de un salón nunca debe poder modificar
 * ni borrar recursos que pertenecen a otro salón o a otro usuario.
 * En cada caso el recurso "existe" pero la búsqueda acotada por salón/usuario
 * no lo devuelve, así que el controlador debe responder 404 y NO escribir.
 */

const mockPrisma = {
  user: { findUnique: jest.fn(), findFirst: jest.fn(), delete: jest.fn(), update: jest.fn() },
  salon: { findFirst: jest.fn() },
  service: { findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
  client: { findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
  appointment: { findFirst: jest.fn(), update: jest.fn() },
  notification: { findFirst: jest.fn(), update: jest.fn() },
};

jest.mock('../src/utils/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

jest.mock('../src/index', () => ({
  io: { to: jest.fn().mockReturnValue({ emit: jest.fn() }) },
}));

jest.mock('../src/utils/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

import { updateService, deleteService } from '../src/controllers/servicesController';
import { updateClient, deleteClient } from '../src/controllers/clientController';
import { updateAppointmentStatus } from '../src/controllers/appointmentController';
import { deleteWorker } from '../src/controllers/workerController';
import { markAsRead } from '../src/controllers/notificationController';

const buildResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const MY_SALON = { id: 1, adminId: 10 };

describe('aislamiento entre salones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('updateService no modifica un servicio de otro salón', async () => {
    mockPrisma.salon.findFirst.mockResolvedValue(MY_SALON);
    mockPrisma.service.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await updateService(
      { userId: 10, params: { id: '99' }, body: { name: 'X', duration: 30, price: 1 } } as any,
      res
    );

    expect(mockPrisma.service.findFirst).toHaveBeenCalledWith({ where: { id: 99, salonId: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockPrisma.service.update).not.toHaveBeenCalled();
  });

  it('deleteService no borra un servicio de otro salón', async () => {
    mockPrisma.salon.findFirst.mockResolvedValue(MY_SALON);
    mockPrisma.service.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await deleteService({ userId: 10, params: { id: '99' } } as any, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockPrisma.service.delete).not.toHaveBeenCalled();
  });

  it('updateClient no modifica un cliente de otro salón', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 10, salon: { id: 1 }, worksAt: null });
    mockPrisma.client.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await updateClient(
      { user: { userId: 10 }, params: { id: '55' }, body: { name: 'Nuevo' } } as any,
      res
    );

    expect(mockPrisma.client.findFirst).toHaveBeenCalledWith({ where: { id: 55, salonId: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockPrisma.client.update).not.toHaveBeenCalled();
  });

  it('deleteClient no borra un cliente de otro salón', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 10, salon: { id: 1 }, worksAt: null });
    mockPrisma.client.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await deleteClient({ user: { userId: 10 }, params: { id: '55' } } as any, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockPrisma.client.delete).not.toHaveBeenCalled();
  });

  it('updateAppointmentStatus no cambia el estado de una cita de otro salón', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      role: 'ADMIN',
      canConfirmAppointments: true,
      canCancelAppointments: true,
    });
    mockPrisma.salon.findFirst.mockResolvedValue(MY_SALON);
    mockPrisma.appointment.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await updateAppointmentStatus(
      { userId: 10, params: { id: '77' }, body: { status: 'CONFIRMED' } } as any,
      res
    );

    expect(mockPrisma.appointment.findFirst).toHaveBeenCalledWith({
      where: { id: 77, service: { salonId: 1 } },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockPrisma.appointment.update).not.toHaveBeenCalled();
  });

  it('un WORKER sin permiso no puede cancelar citas', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      role: 'WORKER',
      canConfirmAppointments: false,
      canCancelAppointments: false,
    });

    const res = buildResponse();
    await updateAppointmentStatus(
      { userId: 11, params: { id: '77' }, body: { status: 'CANCELLED' } } as any,
      res
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockPrisma.appointment.update).not.toHaveBeenCalled();
  });

  it('deleteWorker no borra personal de otro salón', async () => {
    mockPrisma.salon.findFirst.mockResolvedValue(MY_SALON);
    mockPrisma.user.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await deleteWorker({ userId: 10, params: { id: '33' } } as any, res);

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { id: 33, salonId: 1, role: 'WORKER' },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockPrisma.user.delete).not.toHaveBeenCalled();
  });

  it('un usuario sin rol de administrador no puede borrar personal', async () => {
    mockPrisma.salon.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await deleteWorker({ userId: 11, params: { id: '33' } } as any, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockPrisma.user.delete).not.toHaveBeenCalled();
  });

  it('markAsRead no marca la notificación de otro usuario', async () => {
    mockPrisma.notification.findFirst.mockResolvedValue(null);

    const res = buildResponse();
    await markAsRead({ user: { userId: 10 }, params: { id: '5' } } as any, res);

    expect(mockPrisma.notification.findFirst).toHaveBeenCalledWith({
      where: { id: 5, userId: 10 },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockPrisma.notification.update).not.toHaveBeenCalled();
  });
});
