import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ==========================
// GET ALL WORKERS
// ==========================
export const getAllWorkers = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    // 1️⃣ Buscar el salón del usuario (solo ADMIN puede ver workers)
    const salon = await prisma.salon.findFirst({
      where: { adminId: userId },
      include: {
        workers: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            createdAt: true,
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
          },
        },
      },
    });

    if (!salon) {
      return res.status(403).json({ error: 'Solo los administradores pueden gestionar personal' });
    }

    res.json({ workers: salon.workers });
  } catch (error: any) {
    console.error('💥 Error al obtener workers:', error);
    res.status(500).json({ error: 'Error al obtener el personal' });
  }
};

// ==========================
// CREATE WORKER
// ==========================
export const createWorker = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { email, password, name, phone, permissions } = req.body;

  try {
    // 1️⃣ Verificar que el usuario es ADMIN de un salón
    const salon = await prisma.salon.findFirst({
      where: { adminId: userId },
    });

    if (!salon) {
      return res.status(403).json({ error: 'Solo los administradores pueden crear personal' });
    }

    // 2️⃣ Verificar que el email no existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // 3️⃣ Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Crear usuario WORKER vinculado al salón con permisos
    const worker = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
        role: 'WORKER',
        salonId: salon.id,
        // Permisos (por defecto todos en false excepto los que se envíen)
        canViewClients: permissions?.canViewClients || true,
        canEditClients: permissions?.canEditClients || false,
        canDeleteClients: permissions?.canDeleteClients || false,
        canViewPersonal: permissions?.canViewPersonal || false,
        canEditPersonal: permissions?.canEditPersonal || false,
        canDeletePersonal: permissions?.canDeletePersonal || false,
        canViewServices: permissions?.canViewServices || true,
        canEditServices: permissions?.canEditServices || false,
        canDeleteServices: permissions?.canDeleteServices || false,
        canViewInventory: permissions?.canViewInventory || false,
        canEditInventory: permissions?.canEditInventory || false,
        canDeleteInventory: permissions?.canDeleteInventory || false,
        canViewReports: permissions?.canViewReports || false,
        canViewMarketing: permissions?.canViewMarketing || false,
        canConfirmAppointments: permissions?.canConfirmAppointments || false,
        canCancelAppointments: permissions?.canCancelAppointments || false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
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
      },
    });

    res.status(201).json({ worker });
  } catch (error: any) {
    console.error('💥 Error al crear worker:', error);
    res.status(500).json({ error: 'Error al crear el trabajador' });
  }
};

// ==========================
// UPDATE WORKER
// ==========================
export const updateWorker = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const workerId = parseInt(req.params.id);
  const { email, name, phone, password, permissions } = req.body;

  try {
    // 1️⃣ Verificar que el usuario es ADMIN
    const salon = await prisma.salon.findFirst({
      where: { adminId: userId },
    });

    if (!salon) {
      return res.status(403).json({ error: 'Solo los administradores pueden editar personal' });
    }

    // 2️⃣ Verificar que el worker pertenece a este salón
    const worker = await prisma.user.findFirst({
      where: {
        id: workerId,
        salonId: salon.id,
        role: 'WORKER',
      },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    // 3️⃣ Si cambia el email, verificar que no existe
    if (email && email !== worker.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    // 4️⃣ Preparar datos para actualizar
    const updateData: any = {};
    if (email) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Actualizar permisos si se enviaron
    if (permissions) {
      if (permissions.canViewClients !== undefined) updateData.canViewClients = permissions.canViewClients;
      if (permissions.canEditClients !== undefined) updateData.canEditClients = permissions.canEditClients;
      if (permissions.canDeleteClients !== undefined) updateData.canDeleteClients = permissions.canDeleteClients;
      if (permissions.canViewPersonal !== undefined) updateData.canViewPersonal = permissions.canViewPersonal;
      if (permissions.canEditPersonal !== undefined) updateData.canEditPersonal = permissions.canEditPersonal;
      if (permissions.canDeletePersonal !== undefined) updateData.canDeletePersonal = permissions.canDeletePersonal;
      if (permissions.canViewServices !== undefined) updateData.canViewServices = permissions.canViewServices;
      if (permissions.canEditServices !== undefined) updateData.canEditServices = permissions.canEditServices;
      if (permissions.canDeleteServices !== undefined) updateData.canDeleteServices = permissions.canDeleteServices;
      if (permissions.canViewInventory !== undefined) updateData.canViewInventory = permissions.canViewInventory;
      if (permissions.canEditInventory !== undefined) updateData.canEditInventory = permissions.canEditInventory;
      if (permissions.canDeleteInventory !== undefined) updateData.canDeleteInventory = permissions.canDeleteInventory;
      if (permissions.canViewReports !== undefined) updateData.canViewReports = permissions.canViewReports;
      if (permissions.canViewMarketing !== undefined) updateData.canViewMarketing = permissions.canViewMarketing;
      if (permissions.canConfirmAppointments !== undefined) updateData.canConfirmAppointments = permissions.canConfirmAppointments;
      if (permissions.canCancelAppointments !== undefined) updateData.canCancelAppointments = permissions.canCancelAppointments;
    }

    // 5️⃣ Actualizar worker
    const updatedWorker = await prisma.user.update({
      where: { id: workerId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
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
      },
    });

    res.json({ worker: updatedWorker });
  } catch (error: any) {
    console.error('💥 Error al actualizar worker:', error);
    res.status(500).json({ error: 'Error al actualizar el trabajador' });
  }
};

// ==========================
// DELETE WORKER
// ==========================
export const deleteWorker = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const workerId = parseInt(req.params.id);

  try {
    // 1️⃣ Verificar que el usuario es ADMIN
    const salon = await prisma.salon.findFirst({
      where: { adminId: userId },
    });

    if (!salon) {
      return res.status(403).json({ error: 'Solo los administradores pueden eliminar personal' });
    }

    // 2️⃣ Verificar que el worker pertenece a este salón
    const worker = await prisma.user.findFirst({
      where: {
        id: workerId,
        salonId: salon.id,
        role: 'WORKER',
      },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    // 3️⃣ Eliminar worker
    await prisma.user.delete({
      where: { id: workerId },
    });

    res.json({ message: 'Trabajador eliminado exitosamente' });
  } catch (error: any) {
    console.error('💥 Error al eliminar worker:', error);
    res.status(500).json({ error: 'Error al eliminar el trabajador' });
  }
};
