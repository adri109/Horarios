# Configuración en Vercel (Frontend)

Esta guía despliega el frontend Vue desde la carpeta `frontend`.

## 1) Crear proyecto en Vercel

1. Entra a Vercel y pulsa **Add New...** → **Project**.
2. Importa tu repositorio `Horarios`.
3. En **Root Directory**, selecciona `frontend`.

## 2) Ajustes de build

Con `frontend/vercel.json`, Vercel usará automáticamente:

- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- Rewrites SPA para rutas Vue Router (`createWebHistory`)

## 3) Variables de entorno (frontend)

Añade en Vercel:

- `VUE_APP_API_URL=https://<tu-backend>.onrender.com`

## 4) Desplegar

1. Pulsa **Deploy**.
2. Copia la URL final de Vercel (por ejemplo `https://tu-front.vercel.app`).

## 5) Conectar con Render (CORS)

En Render, actualiza:

- `FRONTEND_URL=https://tu-front.vercel.app`

y redeploy del backend.

## 6) Verificación rápida

- Carga `/`, `/login`, `/dashboard` y refresca la página: no debe haber 404.
- Verifica que el frontend consume la API en Render.
