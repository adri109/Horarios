import pino from 'pino';

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const logger = pino({
  level,
  base: {
    service: 'horarios-api',
    env: process.env.NODE_ENV || 'development',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const bridgeConsoleToLogger = () => {
  const safeStringify = (value: unknown) => {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const toMessage = (args: unknown[]) =>
    args
      .map((arg) => (typeof arg === 'string' ? arg : safeStringify(arg)))
      .join(' ');

  console.log = (...args: unknown[]) => logger.info(toMessage(args));
  console.info = (...args: unknown[]) => logger.info(toMessage(args));
  console.warn = (...args: unknown[]) => logger.warn(toMessage(args));
  console.error = (...args: unknown[]) => logger.error(toMessage(args));
};

export default logger;
