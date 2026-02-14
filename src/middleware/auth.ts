import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any; // aquí guardaremos los datos del usuario después de validar el token
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // si viene "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    req.user = decoded;
    (req as any).userId = decoded.userId; // Para compatibilidad con controllers que usan req.userId
    (req as any).userRole = decoded.role; // Agregar rol para verificación de permisos
    next();
  });
};
