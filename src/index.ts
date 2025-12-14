import express from 'express';
import { PrismaClient } from '@prisma/client';
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
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS configuración
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, 'http://localhost:8080', 'http://localhost:3000']
  : ['http://localhost:8080', 'http://localhost:3000'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use('/notifications', notificationRoutes);

// Health check para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API Horarios - Backend funcionando correctamente' });
});

// Puerto/dashboard', dashboardRoutes);
app.use('/config', configRoutes);
app.use('/workers', workerRoutes);
app.use('/marketing', marketingRoutes);
app.use('/notifications', notificationRoutes);

// servir frontend (opcional si quieres servir desde el backend)
// app.use(express.static(path.join(__dirname, '../../frontend/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
// });

// Puerto
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Escuchar en todas las interfaces de red (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
