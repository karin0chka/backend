import winston from "winston"
import config from "./config"
const { combine, timestamp, printf, colorize, align, errors, json } = winston.format

const env_type = config.SERVER.NODE_TYPE
const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false
})

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false
})

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    // printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    printf(({ level, message, label, timestamp, [Symbol.for("splat")]: splat }) => {
      const prefix = splat && splat.length > 0 ? splat[0] : ""
      return `${level.toUpperCase()}   ${timestamp}    [${prefix}] ${message}`
    }),

    colorize({
      level: true,
      message: true,
      all: true,
      colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        debug: "blue",
        verbose: "cyan",
      },
    })
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
    new winston.transports.File({
      filename: "logs/app-error.log",
      level: "error",
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: "logs/app-info.log",
      level: "info",
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: "logs/exception.log" })],
  rejectionHandlers: [new winston.transports.File({ filename: "logs/rejections.log" })],
})

logger.info("Info message")
logger.error("Error message")
logger.warn("Warning message")

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (env_type !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}
