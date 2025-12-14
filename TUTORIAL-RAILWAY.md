# 🚂 Tutorial Railway - Paso a Paso Visual

## 🎯 Objetivo
Desplegar tu backend de Horarios en Railway con PostgreSQL incluido.

---

## 📝 ANTES DE EMPEZAR

### ✅ Checklist Pre-Deploy:
- [ ] Tu código está en un repositorio de GitHub
- [ ] Tienes cuenta en Railway (https://railway.app)
- [ ] Has pusheado todos los cambios a GitHub

---

## 🚀 PASO 1: Crear Proyecto en Railway

### 1.1 - Iniciar Sesión
```
1. Ve a https://railway.app
2. Click en "Start a New Project"
3. Selecciona "Login with GitHub"
4. Autoriza Railway a acceder a GitHub
```

### 1.2 - Crear Nuevo Proyecto
```
1. En el Dashboard de Railway, click "+ New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca tu repositorio "Horarios"
4. Click en el repositorio para seleccionarlo
```

**🎉 ¡Proyecto creado!** Railway empezará a analizar tu código.

---

## 🗄️ PASO 2: Agregar Base de Datos

### 2.1 - Añadir PostgreSQL
```
1. En tu proyecto, verás tu servicio "horarios"
2. Click en el botón "+ New" (arriba a la derecha)
3. Selecciona "Database"
4. Click en "Add PostgreSQL"
```

**✨ Railway crea la BD automáticamente en ~30 segundos**

### 2.2 - Verificar Conexión
```
1. Click en el recuadro "Postgres"
2. Ve a la pestaña "Variables"
3. Verás "DATABASE_URL" con una URL larga
   Ejemplo: postgresql://postgres:xxxxx@containers-us-west-1.railway.app:6543/railway
```

**✅ Tu base de datos está lista**

---

## ⚙️ PASO 3: Configurar Variables de Entorno

### 3.1 - Ir a Variables del Backend
```
1. Click en el recuadro de tu servicio "horarios" (NO en Postgres)
2. Ve a la pestaña "Variables"
3. Click en "+ New Variable"
```

### 3.2 - Agregar Variables Una por Una

**Variable 1 - DATABASE_URL:**
```
Name: DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```
⚠️ **Copia exactamente** `${{Postgres.DATABASE_URL}}` - Railway lo conectará automáticamente

**Variable 2 - JWT_SECRET:**
```
Name: JWT_SECRET
Value: [Genera una clave aleatoria de 32+ caracteres]
```
💡 Puedes usar: https://generate-random.org/api-token-generator?count=1&length=32

**Variable 3 - PORT:**
```
Name: PORT
Value: 3000
```

**Variable 4 - NODE_ENV:**
```
Name: NODE_ENV
Value: production
```

**Variable 5 - FRONTEND_URL:**
```
Name: FRONTEND_URL
Value: http://localhost:8080
```
⚠️ **Actualizarás esto después** cuando despliegues el frontend en Vercel

### 3.3 - Variables Opcionales (si usas email/WhatsApp)

**Para Email (Gmail):**
```
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-de-gmail
```

**Para WhatsApp:**
```
WHATSAPP_TOKEN=tu-token-de-whatsapp
WHATSAPP_PHONE_ID=tu-phone-id
```

---

## 🌐 PASO 4: Generar Dominio Público

### 4.1 - Habilitar Acceso Público
```
1. En tu servicio "horarios" → Settings
2. Scroll hasta "Networking"
3. Click "Generate Domain"
```

**🎊 Railway te dará una URL como:**
```
https://horarios-production-XXXX.up.railway.app
```

**📋 COPIA Y GUARDA ESTA URL** - La necesitarás para el frontend

### 4.2 - Verificar que Funciona
```
1. Copia tu URL de Railway
2. Ábrela en el navegador
3. Deberías ver tu API respondiendo
```

---

## 🔨 PASO 5: Configurar el Deploy

### 5.1 - Verificar Build Command (opcional)
```
1. En tu servicio → Settings
2. Sección "Build"
3. Debería detectar automáticamente:
   - Build Command: npm run build
   - Start Command: npm start
```

Si no lo detecta:
```
Build Command: npm install && npm run build && npx prisma generate
Start Command: npm start
```

### 5.2 - Configurar Script de Deploy para Migraciones
```
1. Settings → Deploy
2. En "Deploy Command" añade:
   npx prisma migrate deploy && npm start
```

Esto ejecutará las migraciones de BD antes de iniciar.

---

## 🚦 PASO 6: Desplegar

### 6.1 - Trigger Deploy
```
1. Ve a la pestaña "Deployments"
2. Click en el botón "Deploy" (icono circular con flecha)
```

### 6.2 - Monitorear el Deploy
```
1. En "Deployments", click en el deploy activo (en progreso)
2. Verás los logs en tiempo real
```

**Proceso esperado (2-4 minutos):**
```
✓ Clonando repositorio...
✓ Instalando dependencias... (npm install)
✓ Compilando TypeScript... (npm run build)
✓ Generando Prisma Client... (npx prisma generate)
✓ Aplicando migraciones... (npx prisma migrate deploy)
✓ Iniciando servidor... (npm start)
✓ Servidor escuchando en puerto 3000
```

### 6.3 - Verificar Logs
Busca en los logs:
```
✓ "Server running on port 3000"
✓ "Connected to database"
✓ "Prisma Client generated"
```

❌ Si ves errores:
- Revisa que DATABASE_URL esté configurado correctamente
- Verifica que todas las variables estén definidas
- Comprueba los logs para detalles del error

---

## ✅ PASO 7: Probar el Backend

### 7.1 - Test Básico
Abre en el navegador:
```
https://tu-proyecto.up.railway.app/
```

Deberías ver respuesta del servidor.

### 7.2 - Test de API (usando Thunder Client, Postman o curl)

**Health Check:**
```bash
curl https://tu-proyecto.up.railway.app/health
```

**Test Login:**
```bash
curl -X POST https://tu-proyecto.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@salon.com","password":"tu-password"}'
```

### 7.3 - Ver la Base de Datos
```
1. Click en el recuadro "Postgres"
2. Ve a "Data"
3. Verás tus tablas (User, Salon, Appointment, etc.)
4. Puedes hacer queries SQL directamente
```

---

## 🔄 PASO 8: Configurar Auto-Deploy (opcional)

### 8.1 - Deploy Automático en cada Push
```
1. Settings → "Source"
2. Activa "Deploy on push"
3. Selecciona la rama (main o master)
```

**Ahora cada vez que hagas push a GitHub, Railway redesplegará automáticamente.**

---

## 📊 PASO 9: Monitoreo

### 9.1 - Ver Métricas
```
1. Click en tu servicio
2. Pestaña "Metrics"
3. Verás:
   - CPU usage
   - Memory usage
   - Network traffic
```

### 9.2 - Ver Logs en Tiempo Real
```
1. Pestaña "Deployments"
2. Click en el deploy activo
3. Logs se actualizan automáticamente
```

### 9.3 - Configurar Alertas (opcional)
```
1. Settings → "Health Checks"
2. Añade URL: /health
3. Railway verificará que tu app esté viva
```

---

## 🎨 SIGUIENTE PASO: Desplegar Frontend en Vercel

Ahora que tu backend está en Railway, necesitas:

1. **Copiar tu URL de Railway:**
   ```
   https://horarios-production-XXXX.up.railway.app
   ```

2. **Ir a Vercel:**
   - https://vercel.com
   - "New Project"
   - Importar tu repositorio
   - Root Directory: `frontend`
   - Variable de entorno: `VITE_API_URL=https://tu-railway-url.up.railway.app`

3. **Actualizar FRONTEND_URL en Railway:**
   Después de desplegar en Vercel, vuelve a Railway y actualiza:
   ```
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```

---

## 🐛 Solución de Problemas

### ❌ Error: "DATABASE_URL not defined"
**Causa:** La variable no está conectada correctamente
**Solución:**
```
1. Ve a Variables
2. Borra DATABASE_URL si existe
3. Añádela de nuevo: DATABASE_URL=${{Postgres.DATABASE_URL}}
4. Asegúrate de que Postgres y tu servicio estén en el mismo proyecto
```

### ❌ Error: "Port already in use"
**Causa:** El PORT no está configurado correctamente
**Solución:**
```
1. Ve a Variables
2. Asegúrate de que PORT=3000
3. En tu código, usa: const port = process.env.PORT || 3000
```

### ❌ Error: "Prisma Client not generated"
**Causa:** Las migraciones no se ejecutaron
**Solución:**
```
1. Settings → Deploy
2. Build Command: npm install && npm run build && npx prisma generate
3. Start Command: npx prisma migrate deploy && npm start
```

### ❌ Error: "CORS policy blocked"
**Causa:** FRONTEND_URL no coincide con tu dominio
**Solución:**
```
1. Ve a Variables
2. Actualiza FRONTEND_URL con la URL exacta de Vercel
3. NO incluyas / al final
4. Ejemplo correcto: https://mi-proyecto.vercel.app
```

### ❌ Deploy Fails (Build Error)
**Ver logs detallados:**
```
1. Deployments → Click en el deploy fallido
2. Lee el error completo en los logs
3. Busca líneas que empiecen con "Error:" o "Failed:"
```

---

## 💡 Tips y Trucos

### 🔐 Seguridad
- Nunca compartas tu JWT_SECRET
- Usa variables de entorno para datos sensibles
- Cambia JWT_SECRET si se filtra

### 📈 Performance
- Railway escala automáticamente
- Monitorea uso en "Metrics"
- Plan gratuito: $5/mes de crédito

### 🔄 Rollback
```
1. Ve a "Deployments"
2. Click en un deploy anterior exitoso
3. Click "Redeploy"
```

### 📝 Variables de Entorno desde CLI (avanzado)
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Añadir variable
railway variables set JWT_SECRET=tu-secreto
```

---

## 📞 Soporte Railway

- **Docs:** https://docs.railway.app
- **Discord:** https://discord.gg/railway
- **Status:** https://railway.app/status

---

## ✨ Resultado Final

Después de seguir este tutorial tendrás:

✅ Backend desplegado en Railway
✅ Base de datos PostgreSQL funcionando
✅ URL pública accesible desde cualquier lugar
✅ Logs y métricas en tiempo real
✅ Deploy automático en cada push a GitHub

**Tu backend está listo para producción** 🎉

---

## 🎯 URLs Importantes

| Recurso | URL |
|---------|-----|
| Dashboard Railway | https://railway.app/dashboard |
| Tu Backend API | https://tu-proyecto.up.railway.app |
| PostgreSQL (interno) | postgresql://... (en Variables) |
| Documentación | https://docs.railway.app |

---

**Siguiente paso:** [Tutorial Vercel](README-DEPLOY.md#parte-2-desplegar-frontend-en-vercel)
