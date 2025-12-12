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
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS: permitir cualquier origen temporalmente para desarrollo
app.use(cors({
  origin: '*', // para pruebas desde móvil/PC
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// rutas
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
