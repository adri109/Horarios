import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware para verificar permisos específicos
export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    console.log('🔒 Verificando permiso:', permission);
    console.log('👤 UserId:', userId, 'Role:', userRole);

    try {
      // ADMIN siempre tiene todos los permisos
      if (userRole === 'ADMIN') {
        console.log('✅ ADMIN - Permiso concedido automáticamente');
        return next();
      }

      // Para WORKER, verificar el permiso específico
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
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

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar el permiso específico
      const hasPermission = (user as any)[permission];
      
      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'No tienes permisos para realizar esta acción',
          permission 
        });
      }

      next();
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};

// Helper para verificar múltiples permisos (OR)
export const checkAnyPermission = (...permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    try {
      // ADMIN siempre tiene todos los permisos
      if (userRole === 'ADMIN') {
        return next();
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
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

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar si tiene al menos uno de los permisos
      const hasAnyPermission = permissions.some(
        permission => (user as any)[permission] === true
      );

      if (!hasAnyPermission) {
        return res.status(403).json({ 
          error: 'No tienes permisos para realizar esta acción',
          requiredPermissions: permissions 
        });
      }

      next();
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};
