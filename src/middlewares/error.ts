import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'ValidationError', details: err.flatten() });
  }
  if (err?.code === 'P2002') { // Prisma unique constraint
    return res.status(409).json({ error: 'UniqueConstraint', meta: err.meta });
  }
  console.error(err);
  return res.status(500).json({ error: 'InternalServerError' });
}
