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
import { execSync } from 'child_process';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Ejecutar migraciones en producción DESPUÉS de iniciar el servidor
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  setTimeout(() => {
    try {
      console.log('🔄 Ejecutando migraciones de Prisma...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migraciones aplicadas correctamente');
    } catch (error) {
      console.error('❌ Error al aplicar migraciones:', error);
    }
  }, 2000);
}

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
  
  if (origin && (allowedOrigins.includes(origin) || isVercelApp)) {
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

// Health check PRIMERO (antes de todas las rutas)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API Horarios - Backend funcionando correctamente' });
});

// Rutas de la API
app.use('/auth', authRoutes);
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

// Puerto
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Escuchar en todas las interfaces de red (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
