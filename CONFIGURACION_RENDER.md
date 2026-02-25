# Configuración en Render (Backend)

Esta guía despliega el backend de Horarios en Render usando `render.yaml`.

## 1) Crear el servicio en Render

1. Entra a Render y pulsa **New +** → **Blueprint**.
2. Conecta tu repositorio y selecciona este proyecto.
3. Render detectará automáticamente `render.yaml` y creará el servicio `horarios-api`.

## 2) Configurar variables de entorno

En Render, abre el servicio y completa estos valores:

- `DATABASE_URL` (Supabase pooler, puerto 6543, con `sslmode=require`)
- `DIRECT_URL` (Supabase directa, puerto 5432, con `sslmode=require`)
- `JWT_SECRET`
- `FRONTEND_URL` (URL pública de tu frontend)
- Opcionales: `SMTP_USER`, `SMTP_PASS`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `STRIPE_SECRET_KEY`

## 3) Primer despliegue

1. Pulsa **Manual Deploy** (o espera el autodeploy).
2. Render ejecutará:
   - Build: `npm ci && npx prisma generate && npm run build`
   - Start: `npm start`
3. El health check debe responder en `/health`.

## 4) Verificación rápida

- API online: `https://<tu-servicio>.onrender.com/health`
- Respuesta esperada: `{ "status": "ok", ... }`

## 5) Notas importantes

- El backend usa `PORT` inyectado por Render automáticamente.
- Las migraciones de Prisma se aplican en arranque de producción desde `src/index.ts`.
- Si falla por conexión de base de datos, revisa `DATABASE_URL` y `DIRECT_URL`.
