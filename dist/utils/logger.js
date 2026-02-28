"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bridgeConsoleToLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const logger = (0, pino_1.default)({
    level,
    base: {
        service: 'horarios-api',
        env: process.env.NODE_ENV || 'development',
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
const bridgeConsoleToLogger = () => {
    const safeStringify = (value) => {
        try {
            return JSON.stringify(value);
        }
        catch (_a) {
            return String(value);
        }
    };
    const toMessage = (args) => args
        .map((arg) => (typeof arg === 'string' ? arg : safeStringify(arg)))
        .join(' ');
    console.log = (...args) => logger.info(toMessage(args));
    console.info = (...args) => logger.info(toMessage(args));
    console.warn = (...args) => logger.warn(toMessage(args));
    console.error = (...args) => logger.error(toMessage(args));
};
exports.bridgeConsoleToLogger = bridgeConsoleToLogger;
exports.default = logger;
