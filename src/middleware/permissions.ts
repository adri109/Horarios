import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest, UserPermissionKey } from '../types/auth';
import logger from '../utils/logger';

// Middleware para verificar permisos específicos
export const checkPermission = (permission: UserPermissionKey) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const userRole = req.userRole;

    logger.debug({ permission, userId, userRole }, 'Verificando permiso');

    try {
      // ADMIN siempre tiene todos los permisos
      if (userRole === 'ADMIN') {
        logger.debug({ permission, userId }, 'Permiso concedido automáticamente por rol ADMIN');
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
      const hasPermission = user[permission];
      
      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'No tienes permisos para realizar esta acción',
          permission 
        });
      }

      next();
    } catch (error) {
      logger.error({ error, permission, userId }, 'Error al verificar permisos');
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};

// Helper para verificar múltiples permisos (OR)
export const checkAnyPermission = (...permissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const userRole = req.userRole;

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
        permission => user[permission as UserPermissionKey] === true
      );

      if (!hasAnyPermission) {
        return res.status(403).json({ 
          error: 'No tienes permisos para realizar esta acción',
          requiredPermissions: permissions 
        });
      }

      next();
    } catch (error) {
      logger.error({ error, permissions, userId }, 'Error al verificar permisos');
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};
