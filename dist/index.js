"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const prisma = new client_1.PrismaClient();
// Configurar Socket.IO con CORS
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = process.env.FRONTEND_URL
                ? [
                    process.env.FRONTEND_URL,
                    'http://localhost:8080',
                    'http://localhost:3000',
                    'https://horariosv2-mizto6ixm-adri109s-projects.vercel.app',
                ]
                : ['http://localhost:8080', 'http://localhost:3000'];
            const isVercelApp = origin && origin.match(/https:\/\/.*\.vercel\.app$/);
            if (!origin || allowedOrigins.includes(origin) || isVercelApp) {
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
// Gestión de conexiones WebSocket
io.on('connection', (socket) => {
    // Unir al usuario a su room personal
    socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
    });
    socket.on('disconnect', () => {
        // Cliente desconectado
    });
});
// CORS configuración
const allowedOrigins = process.env.FRONTEND_URL
    ? [
        process.env.FRONTEND_URL,
        'http://localhost:8080',
        'http://localhost:3000',
        'https://horariosv2-mizto6ixm-adri109s-projects.vercel.app', // Dominio de preview Vercel
    ]
    : ['http://localhost:8080', 'http://localhost:3000'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Permitir cualquier subdominio de vercel.app
    const isVercelApp = origin && origin.match(/https:\/\/.*\.vercel\.app$/);
    // Permitir cualquier IP local en desarrollo
    const isLocalDev = origin && origin.match(/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):\d+$/);
    if (origin && (allowedOrigins.includes(origin) || isVercelApp || isLocalDev)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express_1.default.json());
// Health check PRIMERO (antes de todas las rutas)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: 'API Horarios - Backend funcionando correctamente' });
});
// Rutas de la API
app.use('/auth', auth_1.default);
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
// Puerto
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
// Escuchar en todas las interfaces de red (0.0.0.0)
httpServer.listen(PORT, '0.0.0.0', () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    }
});
