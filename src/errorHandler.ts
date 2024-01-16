import { Request, Response } from 'express';
import { logger } from './winston.createLogger';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export function errorHandler(err: Error, req: Request, res: Response) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    logger.error(err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
}
