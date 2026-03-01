"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const servicesRoutes_1 = __importDefault(require("./routes/servicesRoutes"));
const salonRoutes_1 = __importDefault(require("./routes/salonRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const configRoutes_1 = __importDefault(require("./routes/configRoutes"));
const workerRoutes_1 = __importDefault(require("./routes/workerRoutes"));
const marketingRoutes_1 = __importDefault(require("./routes/marketingRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importStar(require("./utils/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET no configurado. Define JWT_SECRET en variables de entorno.');
}
(0, logger_1.bridgeConsoleToLogger)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const isProduction = process.env.NODE_ENV === 'production';
const defaultProductionOrigins = ['https://horarios-six.vercel.app'];
const normalizeOrigin = (value) => value.trim().replace(/\/+$/, '');
const parseOrigins = (value) => (value || '')
    .split(',')
    .map(origin => normalizeOrigin(origin))
    .filter(Boolean);
const allowedOrigins = Array.from(new Set([
    ...parseOrigins(process.env.CORS_ORIGINS),
    ...(process.env.FRONTEND_URL ? [normalizeOrigin(process.env.FRONTEND_URL)] : []),
    ...(isProduction ? defaultProductionOrigins.map(normalizeOrigin) : []),
    ...(!isProduction
        ? [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://127.0.0.1:8080',
            'http://127.0.0.1:3000',
        ]
        : []),
]));
const requestBodyLimit = process.env.REQUEST_BODY_LIMIT || '1mb';
const globalRateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const globalRateLimitMax = Number(process.env.RATE_LIMIT_MAX || 300);
const authRateLimitMax = Number(process.env.AUTH_RATE_LIMIT_MAX || 30);
app.set('trust proxy', 1);
app.use((0, helmet_1.default)());
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        logger_1.default.info({
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
        }, 'HTTP request');
    });
    next();
});
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: globalRateLimitWindowMs,
    max: globalRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes, intenta de nuevo en unos minutos' },
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: globalRateLimitWindowMs,
    max: authRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos de autenticación, intenta más tarde' },
});
app.use(globalLimiter);
// Configurar Socket.IO con CORS
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            const normalizedOrigin = origin ? normalizeOrigin(origin) : undefined;
            if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true
    }
});
exports.io = io;
// Middleware de autenticación para WebSocket (JWT)
io.use((socket, next) => {
    var _a, _b;
    const tokenFromAuth = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
    const tokenFromHeader = (_b = socket.handshake.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    const token = tokenFromAuth || tokenFromHeader;
    if (!token) {
        return next(new Error('No autenticado'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decoded.userId) {
            return next(new Error('Token inválido'));
        }
        socket.data.userId = decoded.userId;
        socket.data.userRole = decoded.role;
        next();
    }
    catch (_c) {
        return next(new Error('Token inválido'));
    }
});
// Gestión de conexiones WebSocket
io.on('connection', (socket) => {
    const userId = socket.data.userId;
    if (userId) {
        socket.join(`user_${userId}`);
    }
    socket.on('disconnect', () => {
        // Cliente desconectado
    });
});
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const normalizedOrigin = origin ? normalizeOrigin(origin) : undefined;
    if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
        res.header('Access-Control-Allow-Origin', normalizedOrigin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express_1.default.json({ limit: requestBodyLimit }));
app.use(express_1.default.urlencoded({ extended: true, limit: requestBodyLimit }));
// Health check PRIMERO (antes de todas las rutas)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: 'API Horarios - Backend funcionando correctamente' });
});
// Rutas de la API
app.use('/auth', authLimiter, auth_1.default);
app.use('/appointments', appointmentRoutes_1.default);
app.use('/services', servicesRoutes_1.default);
app.use('/salon', salonRoutes_1.default);
app.use('/public', publicRoutes_1.default);
app.use('/clients', clientRoutes_1.default);
app.use('/dashboard', dashboardRoutes_1.default);
app.use('/config', configRoutes_1.default);
app.use('/workers', workerRoutes_1.default);
app.use('/marketing', marketingRoutes_1.default);
app.use('/notifications', notificationRoutes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// Puerto
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
// Escuchar en todas las interfaces de red (0.0.0.0)
httpServer.listen(PORT, '0.0.0.0', () => {
    if (process.env.NODE_ENV !== 'production') {
        logger_1.default.info({ port: PORT }, 'Servidor corriendo');
    }
});
