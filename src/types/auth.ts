import { Request } from 'express';

export interface AuthUserPayload {
  userId: number;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
  userId?: number;
  userRole?: string;
}

export type UserPermissionKey =
  | 'canViewClients'
  | 'canEditClients'
  | 'canDeleteClients'
  | 'canViewPersonal'
  | 'canEditPersonal'
  | 'canDeletePersonal'
  | 'canViewServices'
  | 'canEditServices'
  | 'canDeleteServices'
  | 'canViewInventory'
  | 'canEditInventory'
  | 'canDeleteInventory'
  | 'canViewReports'
  | 'canViewMarketing'
  | 'canConfirmAppointments'
  | 'canCancelAppointments';
