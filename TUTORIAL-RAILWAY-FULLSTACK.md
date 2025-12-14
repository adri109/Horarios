# 🚂 Tutorial Railway - Backend + Frontend en el Mismo Servicio

## 📋 Opción: Todo en Railway (sin Vercel)

Si prefieres tener backend y frontend en el mismo lugar:

---

## 🏗️ OPCIÓN 1: Monorepo en Railway

### Paso 1: Configurar package.json raíz

```json
{
  "scripts": {
    "build": "npm install && cd frontend && npm install && npm run build && cd .. && npm run build:backend",
    "build:backend": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Paso 2: Servir frontend desde Express

En tu `src/index.ts`:

```typescript
import express from 'express';
import path from 'path';

const app = express();

// API routes primero
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
// ... resto de tus rutas

// Servir frontend estático (DESPUÉS de las rutas API)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all para Vue Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
```

### Paso 3: Actualizar frontend/src para usar rutas relativas

En lugar de `http://localhost:3000`, usa:

```javascript
// frontend/src/config o donde tengas la URL de la API
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Rutas relativas en producción
  : 'http://localhost:3000';
```

### Paso 4: Ajustar rutas del backend

```typescript
// Todas las rutas API bajo /api
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
// etc.
```

### Paso 5: Deploy en Railway

**Variables de entorno:**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tu-secreto-seguro
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://tu-proyecto.up.railway.app
```

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npx prisma migrate deploy && npm start
```

✅ **Ventaja:** Todo en un solo lugar, una sola URL
❌ **Desventaja:** Más lento que Vercel, más caro

---

## 🏗️ OPCIÓN 2: Dos Servicios en Railway

### Servicio 1: Backend
```
- Repositorio: tu-repo (carpeta raíz)
- Build: npm run build
- Start: npm start
- Variables: DATABASE_URL, JWT_SECRET, etc.
```

### Servicio 2: Frontend
```
- Repositorio: tu-repo
- Root Directory: frontend
- Build: npm install && npm run build
- Start: npx serve dist -s -p $PORT
```

**Instalar serve en frontend:**
```bash
cd frontend
npm install --save-dev serve
```

**package.json del frontend:**
```json
{
  "scripts": {
    "start:prod": "serve dist -s -p $PORT"
  }
}
```

✅ **Ventaja:** Separación clara, cada servicio escala independiente
❌ **Desventaja:** Usas más crédito Railway (2 servicios)

---

## 💰 Comparación de Costos

### Railway + Vercel (RECOMENDADO)
- Railway: ~$2-3/mes (solo backend)
- Vercel: Gratis
- **Total: ~$2-3/mes**

### Todo en Railway
- Railway: ~$5-8/mes (backend + frontend)
- **Total: ~$5-8/mes**

### Dos Servicios Railway
- Railway: ~$8-12/mes (2 servicios activos)
- **Total: ~$8-12/mes**

---

## 🎯 Recomendación

**Para tu proyecto, lo mejor es Railway + Vercel porque:**

1. ✅ **Más barato** - Vercel es gratis para frontend
2. ✅ **Más rápido** - Vercel tiene CDN global
3. ✅ **Mejor separación** - Backend y frontend independientes
4. ✅ **Más fácil** - No necesitas configurar Express para servir estáticos
5. ✅ **Escalable** - Cada parte escala por separado

---

## 🚀 Flujo Recomendado

```
┌─────────────────────────────────────────┐
│ Usuario abre navegador                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Vercel sirve frontend (HTML/CSS/JS)     │
│ https://mi-salon.vercel.app             │
└──────────────┬──────────────────────────┘
               │
               │ Peticiones API (fetch/axios)
               │
               ▼
┌─────────────────────────────────────────┐
│ Railway Backend (Express + Node.js)     │
│ https://mi-salon-api.railway.app        │
│                                         │
│  ┌──────────────────┐                  │
│  │ POST /auth/login │                  │
│  │ GET /appointments│                  │
│  │ etc...           │                  │
│  └──────────────────┘                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ PostgreSQL (Base de Datos)              │
│ Railway Managed Database                │
└─────────────────────────────────────────┘
```

---

## 🔧 Si Decides Usar Solo Railway

### Cambios necesarios en tu código:

**1. backend/src/index.ts:**
```typescript
import path from 'path';

// ... tus imports y configuración

// API routes (con prefijo /api)
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/salon', salonRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/config', configRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/public', publicRoutes);

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all para Vue Router
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});
```

**2. frontend/src/main.js o donde configures axios:**
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // En producción, usa rutas relativas
  : 'http://localhost:3000';

// Todas tus peticiones ahora serían:
axios.get(`${API_URL}/appointments`)
axios.post(`${API_URL}/auth/login`, data)
```

**3. package.json raíz:**
```json
{
  "scripts": {
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm install && npm run build",
    "build:backend": "tsc",
    "start": "node dist/index.js",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "nodemon src/index.ts",
    "dev:frontend": "cd frontend && npm run serve"
  }
}
```

**4. Railway settings:**
```
Build Command: npm run build
Start Command: npx prisma migrate deploy && npm start
Root Directory: / (raíz del proyecto)
```

---

## ✅ Decisión Final

**Usa Railway + Vercel** a menos que:
- Quieras una sola URL para todo
- No quieras crear cuenta en Vercel
- Prefieras pagar más por simplicidad

**Railway solo** tiene sentido si:
- Necesitas autenticación antes de servir el frontend
- Tienes lógica server-side rendering (SSR)
- Tu plan Railway es generoso

Para tu proyecto de salones, **Railway + Vercel es la mejor opción** ✨
