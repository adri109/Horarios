import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthUserPayload } from '../types/auth';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ error: 'Configuración de autenticación inválida' });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // si viene "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    const payload = decoded as AuthUserPayload;
    req.user = payload;
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  });
};
