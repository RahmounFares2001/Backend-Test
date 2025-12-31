import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // validated data
    req.body = result.data;

    next();
  };
};