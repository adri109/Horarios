import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z, ZodTypeAny } from 'zod';

const formatZodErrors = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));

export const validateBody = (schema: ZodTypeAny): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Payload inválido',
        details: formatZodErrors(result.error),
      });
    }

    req.body = result.data;
    next();
  };
};
