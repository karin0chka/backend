import winston from 'winston';
import config from './utils/config';
const { combine, timestamp, printf, colorize, align, errors, json } = winston.format;

const env_type = config.SERVER.NODE_TYPE;
const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

export const logger = winston.createLogger({
  level:'info',
  format: combine(
    errors({ stack: true }),
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
    }),
    new winston.transports.File({
      filename: 'app-error.log',
      level: 'error',
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'app-info.log',
      level: 'info',
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'exception.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'rejections.log' })],
});

logger.info('Info message');
logger.error('Error message');
logger.warn('Warning message');

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (env_type !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
