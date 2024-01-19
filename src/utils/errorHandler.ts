import { NextFunction, Request, Response } from "express"
import { logger } from "./winston.createLogger"
import { inspect } from "util"

export class AppError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
  }
}

export function errorHandler(err: Error | AppError, req: Request, res: Response, next: NextFunction) {
  console.log("ERROR FIRED", err)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    })
    next()
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    })
    next()
  }
  logger.error(inspect(err))
}

export const catchWrapper = (callback) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await callback(req, res, next)
  } catch (err) {
    errorHandler(err, req, res, next)
  }
}
