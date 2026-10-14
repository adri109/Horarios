import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // Express identifica un manejador de errores por tener 4 parámetros
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Error interno del servidor';

  if (statusCode >= 500) {
    logger.error({ err, method: req.method, path: req.originalUrl }, 'Unhandled server error');
  }

  res.status(statusCode).json({ error: message });
};
