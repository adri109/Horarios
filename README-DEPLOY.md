# 🚀 Guía de Despliegue - Railway + Vercel

## 📋 Requisitos Previos
- Cuenta en GitHub
- Cuenta en Railway (https://railway.app)
- Cuenta en Vercel (https://vercel.com)

---

## 🎯 PARTE 1: Desplegar Backend en Railway

### 1. Crear cuenta en Railway
1. Ir a https://railway.app
2. Click en "Login" → "Login with GitHub"
3. Autorizar Railway en GitHub

### 2. Crear nuevo proyecto
1. En el dashboard, click "New Project"
2. Seleccionar "Deploy from GitHub repo"
3. Autorizar acceso a tus repositorios
4. Seleccionar tu repositorio "Horarios"

### 3. Agregar Base de Datos PostgreSQL
1. En tu proyecto, click "+ New"
2. Seleccionar "Database" → "Add PostgreSQL"
3. Railway creará automáticamente la base de datos
4. La variable `DATABASE_URL` se conectará automáticamente

### 4. Configurar Variables de Entorno
En tu servicio backend (no en la BD), ve a "Variables" y añade:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=TuClaveSecretaDe32CaracteresOMas123456
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.vercel.app
```

**⚠️ IMPORTANTE:** 
- Copia `DATABASE_URL=${{Postgres.DATABASE_URL}}` exactamente así
- Railway lo reemplazará automáticamente con la URL de tu BD
- Cambia `JWT_SECRET` por una clave aleatoria segura

### 5. Generar Dominio Público
1. Ve a tu servicio backend → "Settings"
2. Sección "Networking" → Click "Generate Domain"
3. Railway te dará una URL como: `https://tu-proyecto.up.railway.app`
4. **¡Guarda esta URL!** La necesitarás para el frontend

### 6. Verificar el Deploy
1. Ve a la pestaña "Deployments"
2. Espera a que el deploy termine (puede tardar 2-5 minutos)
3. Verifica los logs para errores
4. Debería ejecutar automáticamente:
   - `npm install`
   - `npm run build`
   - `npx prisma migrate deploy`
   - `npm start`

---

## 🎨 PARTE 2: Desplegar Frontend en Vercel

### 1. Crear cuenta en Vercel
1. Ir a https://vercel.com
2. "Sign Up" → "Continue with GitHub"
3. Autorizar Vercel

### 2. Importar Proyecto
1. Click "Add New..." → "Project"
2. Seleccionar tu repositorio "Horarios"
3. **⚠️ IMPORTANTE:** Configurar:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vue.js
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`

### 3. Configurar Variables de Entorno
En "Environment Variables", añade:

```
VITE_API_URL=https://tu-proyecto.up.railway.app
```

Reemplaza con la URL de Railway del paso 1.5

### 4. Deploy
1. Click "Deploy"
2. Espera 1-2 minutos
3. Vercel te dará una URL: `https://tu-proyecto.vercel.app`

### 5. Actualizar CORS en Backend
1. Vuelve a Railway
2. Actualiza la variable `FRONTEND_URL` con tu URL de Vercel:
   ```
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```
3. Railway redesplegará automáticamente

---

## ✅ Verificar que Todo Funciona

### 1. Probar el Frontend
- Ir a `https://tu-proyecto.vercel.app`
- Intentar hacer login
- Verificar que las peticiones llegan al backend

### 2. Probar el Backend Directamente
```bash
# Test de health check
curl https://tu-proyecto.up.railway.app/health

# Test de login
curl -X POST https://tu-proyecto.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Ver Logs en Railway
1. Ve a tu proyecto en Railway
2. Click en tu servicio backend
3. Pestaña "Deployments" → Click en el deploy activo
4. Ver logs en tiempo real

---

## 🔧 Comandos Útiles

### Redeployar manualmente:
**Railway:**
- Ve a "Deployments" → "Deploy" (icono de flecha)

**Vercel:**
- Ve a tu proyecto → "Deployments" → "Redeploy"

### Ver logs en tiempo real:
**Railway:**
- Click en tu servicio → "Deployments" → Click en deploy activo → Logs

**Vercel:**
- Proyecto → Último deployment → "View Function Logs"

---

## 🐛 Solución de Problemas Comunes

### Error: "DATABASE_URL not defined"
**Solución:** Asegúrate de que en Railway:
1. Tienes la base de datos PostgreSQL creada
2. La variable `DATABASE_URL=${{Postgres.DATABASE_URL}}` está exactamente así
3. El backend y la BD están en el mismo proyecto

### Error: "CORS policy"
**Solución:**
1. Verifica que `FRONTEND_URL` en Railway sea exactamente tu URL de Vercel
2. No incluyas `/` al final de la URL
3. Redespliega después de cambiar

### Error: "Failed to compile"
**Solución en Vercel:**
1. Verifica que "Root Directory" sea `frontend`
2. Build Command: `npm install && npm run build`
3. Output Directory: `dist`

### Error: Migraciones no se aplican
**Solución en Railway:**
1. Ve a tu servicio → "Settings" → "Deploy"
2. Asegúrate que ejecuta: `npx prisma migrate deploy`
3. O ejecuta manualmente en la consola de Railway

---

## 📊 Monitoreo

### Railway
- Ve a "Metrics" para ver uso de recursos
- Ve a "Deployments" para historial
- Logs en tiempo real en cada deployment

### Vercel
- Ve a "Analytics" para estadísticas de tráfico
- "Insights" para rendimiento
- "Logs" para errores

---

## 💰 Costos

**Railway (Plan Gratuito):**
- $5 de crédito mensual gratis
- ~500 horas de ejecución
- Suficiente para desarrollo y pruebas

**Vercel (Plan Gratuito):**
- 100 GB bandwidth/mes
- Despliegues ilimitados
- Suficiente para producción pequeña

---

## 🔐 Seguridad Post-Deploy

✅ **Checklist:**
- [ ] Cambiar `JWT_SECRET` por uno aleatorio y seguro
- [ ] Configurar correctamente `FRONTEND_URL` para CORS
- [ ] No compartir las variables de entorno
- [ ] Habilitar HTTPS (automático en Railway y Vercel)
- [ ] Configurar dominio personalizado (opcional)

---

## 🌐 Dominio Personalizado (Opcional)

### En Railway:
1. Settings → Networking → Custom Domain
2. Añadir tu dominio
3. Configurar DNS según instrucciones

### En Vercel:
1. Proyecto → Settings → Domains
2. Añadir dominio
3. Configurar DNS (A record o CNAME)

---

## 📞 Soporte

**Railway:**
- Discord: https://discord.gg/railway
- Docs: https://docs.railway.app

**Vercel:**
- Discord: https://vercel.com/discord
- Docs: https://vercel.com/docs

---

## ✨ URLs Finales

Después del deploy tendrás:
- **Frontend:** `https://tu-proyecto.vercel.app`
- **Backend API:** `https://tu-proyecto.up.railway.app`
- **Página Pública:** `https://tu-proyecto.vercel.app/salon/{slug}`
- **Dashboard:** `https://tu-proyecto.vercel.app/dashboard`

¡Listo para usar en producción! 🎉
