# 🔧 Solución: Railway Crashea - Guía de Troubleshooting

## ✅ Cambios Aplicados

He arreglado los siguientes problemas comunes:

### 1. **Prisma Client no generado**
- Añadido `npx prisma generate` al build
- Añadido `postinstall` script para generar automáticamente

### 2. **CORS configurado incorrectamente**
- Eliminada dependencia innecesaria de `cors`
- Implementado CORS manual con orígenes específicos
- Incluye soporte para FRONTEND_URL de Vercel

### 3. **Health check para Railway**
- Añadida ruta `/health` para que Railway verifique que el servidor está vivo
- Railway reiniciará automáticamente si `/health` falla

### 4. **Configuración optimizada**
- Archivo `railway.json` con configuración específica
- `Procfile` actualizado para ejecutar migraciones antes de iniciar

---

## 🚀 Pasos para Desplegar en Railway

### 1. Variables de Entorno OBLIGATORIAS

En Railway → Tu servicio → Variables, asegúrate de tener:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tu_secreto_de_minimo_32_caracteres_aleatorio
PORT=3000
NODE_ENV=production
```

**⚠️ CRÍTICO:** 
- `DATABASE_URL` debe ser **exactamente** `${{Postgres.DATABASE_URL}}`
- Asegúrate de que tienes PostgreSQL agregado al proyecto
- El PostgreSQL y tu backend deben estar en el MISMO proyecto

### 2. Configuración del Servicio

**Settings → Build:**
```
Build Command: npm install && npx prisma generate && npm run build
Start Command: npx prisma migrate deploy && node dist/index.js
```

**O deja que use railway.json automáticamente** (ya está configurado)

### 3. Verificar PostgreSQL

```
1. Ve a tu proyecto en Railway
2. Debes ver DOS servicios:
   - Postgres (base de datos)
   - horarios (tu backend)
   
3. Click en Postgres → Variables
4. Verifica que DATABASE_URL existe
```

Si NO ves Postgres:
```
1. Click en "+ New" en tu proyecto
2. Selecciona "Database" → "Add PostgreSQL"
3. Espera 30 segundos a que se cree
4. Vuelve a tu servicio backend → Variables
5. DATABASE_URL=${{Postgres.DATABASE_URL}}
```

---

## 🐛 Diagnóstico de Errores Comunes

### ❌ Error: "PrismaClient is not configured"

**Causa:** Prisma Client no se generó

**Solución:**
```bash
# En Railway logs, deberías ver:
✓ Running 'npx prisma generate'
✓ Generated Prisma Client

# Si no lo ves, añade en Settings → Build:
Build Command: npm install && npx prisma generate && npm run build
```

### ❌ Error: "Can't reach database server"

**Causa:** DATABASE_URL mal configurado

**Solución:**
```
1. Variables → DATABASE_URL debe ser: ${{Postgres.DATABASE_URL}}
2. NO pongas una URL directa
3. Asegúrate de tener Postgres en el mismo proyecto
4. Redespliega después de cambiar
```

### ❌ Error: "Port already in use" o "EADDRINUSE"

**Causa:** Railway asigna el puerto automáticamente

**Solución:** Ya está arreglado en el código:
```typescript
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

Railway usa $PORT automáticamente.

### ❌ Error: "Module not found" o "Cannot find module"

**Causa:** Dependencias no instaladas correctamente

**Solución:**
```bash
# Verifica que package.json tenga todas las deps en dependencies (no devDependencies)
# Importante: typescript, @types/*, prisma deben estar en dependencies para Railway

# En Settings → verificar:
Install Command: npm install (por defecto)
```

### ❌ Crash Loop (se reinicia constantemente)

**Causas posibles:**

1. **Código crashea al iniciar:**
```
# Ver logs completos en Deployments → Click en deploy activo
# Busca el stack trace del error
```

2. **Puerto incorrecto:**
```
# Asegúrate de usar process.env.PORT
# No hardcodear puerto 3000
```

3. **Migraciones fallan:**
```
# Si ves "Migration failed", es porque:
- La BD no está conectada
- Ya existe data incompatible
- Schema tiene errores

# Solución temporal:
Start Command: node dist/index.js
# (sin las migraciones, para probar)
```

4. **Health check falla:**
```
# Railway verifica /health cada 30s
# Si no responde, reinicia el servicio

# Verifica que la ruta /health funcione:
curl https://tu-proyecto.railway.app/health
```

---

## 🔍 Cómo Ver Logs Detallados

### En Railway:

```
1. Tu servicio → Deployments
2. Click en el deploy ACTIVO (o fallido)
3. Verás logs en tiempo real
4. Busca líneas rojas (errores)
```

**Logs importantes a buscar:**

✅ **Deploy exitoso:**
```
Nixpacks build
✓ Detected Node.js
✓ Installing dependencies
✓ Building application
✓ Prisma Client generated
✓ Migrations applied
✓ Server running on port 3000
```

❌ **Deploy fallido:**
```
Error: Cannot find module '@prisma/client'
  → Prisma no generado, falta build command

Error: connect ECONNREFUSED
  → DATABASE_URL mal configurado

Error: listen EADDRINUSE
  → No usa process.env.PORT

SyntaxError: Unexpected token
  → TypeScript no compilado correctamente
```

---

## 📋 Checklist Pre-Deploy

Antes de desplegar, verifica:

- [ ] PostgreSQL agregado al proyecto Railway
- [ ] DATABASE_URL=${{Postgres.DATABASE_URL}} (exactamente así)
- [ ] JWT_SECRET configurado (32+ caracteres)
- [ ] PORT=3000 (Railway lo sobreescribe automáticamente)
- [ ] NODE_ENV=production
- [ ] Build command incluye `npx prisma generate`
- [ ] Start command incluye `npx prisma migrate deploy`
- [ ] Todos los cambios pusheados a GitHub
- [ ] Railway conectado al repo correcto
- [ ] Branch correcta seleccionada (main/master)

---

## 🧪 Test Manual del Backend

Una vez desplegado, prueba estas URLs:

```bash
# 1. Health check
curl https://tu-proyecto.railway.app/health
# Respuesta esperada: {"status":"ok","timestamp":"..."}

# 2. Ruta raíz
curl https://tu-proyecto.railway.app/
# Respuesta: {"message":"API Horarios - Backend funcionando correctamente"}

# 3. Test login (si tienes un usuario)
curl -X POST https://tu-proyecto.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## 🔄 Comandos Útiles Railway CLI (opcional)

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Ver logs en tiempo real
railway logs

# Ver variables
railway variables

# Ejecutar comando en Railway
railway run node dist/index.js
```

---

## 💡 Optimizaciones Adicionales

### 1. Ignorar frontend en build (más rápido)

Crea `.railwayignore`:
```
frontend/
*.md
.git/
.github/
.vscode/
```

### 2. Mejorar tiempo de build

En `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 3. Cachear dependencias

Railway cachea automáticamente `node_modules`, pero asegúrate de tener `package-lock.json` en el repo.

---

## 🆘 Si Nada Funciona

### Plan B: Reset completo

```
1. Borra el servicio en Railway (no el proyecto)
2. Click "+ New" → "GitHub Repo"
3. Selecciona tu repo de nuevo
4. Añade PostgreSQL de nuevo
5. Configura variables desde cero
6. Deploy
```

### Plan C: Logs del crasheo

```
1. Deployments → Click en deploy fallido
2. Copia TODO el log de error
3. Busca en Google el mensaje de error específico
4. O compártelo para ayuda específica
```

---

## ✅ Señales de Deploy Exitoso

Cuando todo funciona, verás:

✓ **En Railway Deployments:**
- Estado: "Active" (verde)
- Uptime: más de 1 minuto sin reiniciar
- Logs sin errores rojos

✓ **En el navegador:**
- https://tu-proyecto.railway.app/ responde
- /health devuelve {"status":"ok"}

✓ **En logs:**
```
Servidor corriendo en puerto 3000
Connected to database
Prisma Client initialized
```

---

## 📞 Recursos

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Prisma Docs:** https://www.prisma.io/docs
- **Ejemplo trabajando:** https://github.com/railwayapp/examples

---

**Con los cambios aplicados, tu proyecto debería funcionar en Railway.** 

Sigue los pasos de este documento y revisa los logs detalladamente. Si sigue crasheando, busca el error específico en los logs y compártelo para ayuda más precisa.
