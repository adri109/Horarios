import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import appointmentRoutes from './routes/appointmentRoutes';
import servicesRoutes from './routes/servicesRoutes';
import salonRoutes from './routes/salonRoutes';
import publicRoutes from './routes/publicRoutes';
import clientRoutes from './routes/clientRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import configRoutes from './routes/configRoutes';
import workerRoutes from './routes/workerRoutes';
import marketingRoutes from './routes/marketingRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger, { bridgeConsoleToLogger } from './utils/logger';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
// Overrides locales (.env.local) — no va a git
dotenv.config({ path: '.env.local', override: true });

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET no configurado. Define JWT_SECRET en variables de entorno.');
}

bridgeConsoleToLogger();

const app = express();
const httpServer = createServer(app);

const isProduction = process.env.NODE_ENV === 'production';

/** Dominio público TimeIt (producción) */
const productionSiteOrigins = ['https://timeit.es', 'https://www.timeit.es'];

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, '');

const parseOrigins = (value?: string) =>
  (value || '')
    .split(',')
    .map(origin => normalizeOrigin(origin))
    .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    ...parseOrigins(process.env.CORS_ORIGINS),
    ...(process.env.FRONTEND_URL ? [normalizeOrigin(process.env.FRONTEND_URL)] : []),
    ...(isProduction ? productionSiteOrigins.map(normalizeOrigin) : []),
    ...(!isProduction
      ? [
          'http://localhost:8080',
          'http://localhost:8081',
          'http://localhost:3000',
          'http://127.0.0.1:8080',
          'http://127.0.0.1:8081',
          'http://127.0.0.1:3000',
        ]
      : []),
  ])
);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOrigins.includes(normalizedOrigin);
};

const requestBodyLimit = process.env.REQUEST_BODY_LIMIT || '1mb';
const globalRateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const globalRateLimitMax = Number(process.env.RATE_LIMIT_MAX || 300);
const authRateLimitMax = Number(process.env.AUTH_RATE_LIMIT_MAX || 30);

app.set('trust proxy', 1);

app.use(helmet());

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      },
      'HTTP request'
    );
  });

  next();
});

const globalLimiter = rateLimit({
  windowMs: globalRateLimitWindowMs,
  max: globalRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo en unos minutos' },
});

const authLimiter = rateLimit({
  windowMs: globalRateLimitWindowMs,
  max: authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de autenticación, intenta más tarde' },
});

app.use(globalLimiter);

// Configurar Socket.IO con CORS
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Exportar io para usarlo en otros módulos
export { io };

// Middleware de autenticación para WebSocket (JWT)
io.use((socket, next) => {
  const tokenFromAuth = socket.handshake.auth?.token as string | undefined;
  const tokenFromHeader = socket.handshake.headers.authorization?.split(' ')[1];
  const token = tokenFromAuth || tokenFromHeader;

  if (!token) {
    return next(new Error('No autenticado'));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      userId?: number;
      role?: string;
    };

    if (!decoded.userId) {
      return next(new Error('Token inválido'));
    }

    (socket.data as any).userId = decoded.userId;
    (socket.data as any).userRole = decoded.role;
    next();
  } catch {
    return next(new Error('Token inválido'));
  }
});

// Gestión de conexiones WebSocket
io.on('connection', (socket) => {
  const userId = (socket.data as any).userId as number;

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

  if (normalizedOrigin && isAllowedOrigin(normalizedOrigin)) {
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

app.use(express.json({ limit: requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: requestBodyLimit }));

// Health check PRIMERO (antes de todas las rutas)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API TimeIt - Backend funcionando correctamente' });
});

// Rutas de la API
app.use('/auth', authLimiter, authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/services', servicesRoutes);
app.use('/salon', salonRoutes);
app.use('/public', publicRoutes);
app.use('/clients', clientRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/config', configRoutes);
app.use('/workers', workerRoutes);
app.use('/marketing', marketingRoutes);
app.use('/notifications', notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Escuchar en todas las interfaces de red (0.0.0.0)
httpServer.listen(PORT, '0.0.0.0', () => {
  if (process.env.NODE_ENV !== 'production') {
    logger.info({ port: PORT }, 'Servidor corriendo');
  }
});
