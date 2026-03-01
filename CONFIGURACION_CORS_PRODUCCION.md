# Configuración CORS y conexión Front-Backend (Producción)

Fecha: 2026-03-01
Proyecto: Horarios

## Objetivo

Dejar estable la conexión entre frontend (Vercel) y backend (Render), evitando bloqueos CORS tanto en dominio estable como en dominios preview de Vercel.

## Cambios aplicados en backend

Archivo modificado: `src/index.ts`

### 1) Normalización de orígenes

Se agregó una normalización para comparar orígenes con y sin slash final:

- `https://dominio.com`
- `https://dominio.com/`

Ambos quedan tratados como el mismo origen permitido.

### 2) Dominio estable permitido por defecto

Se añadió un origen permitido por defecto en producción:

- `https://horarios-six.vercel.app`

Esto evita depender exclusivamente de variables de entorno para este dominio principal.

### 3) Soporte para previews de Vercel

Se añadieron patrones confiables para previews del proyecto:

- `https://horarios-<hash>-adri109s-projects.vercel.app`

Ejemplo real que fallaba y ahora queda cubierto:

- `https://horarios-8e9hrxve3-adri109s-projects.vercel.app`

### 4) Reutilización centralizada de validación CORS

Se creó una función común para validar orígenes (`isAllowedOrigin`) y se usa en:

- CORS de Socket.IO
- Middleware CORS HTTP de Express

Con esto se evita que un canal (HTTP o sockets) funcione y el otro no.

## Variables de entorno recomendadas

Aunque el código ya cubre dominio estable y previews confiables, se recomienda mantener estas variables:

- `FRONTEND_URL=https://horarios-six.vercel.app`
- `CORS_ORIGINS=https://horarios-six.vercel.app`

Recomendación importante:

- Guardar URLs sin slash final (`/`).

## Documentación actualizada

Se actualizó también:

- `.env.example`
- `CONFIGURACION_RENDER.md`

Para dejar explícito el formato correcto de orígenes.

## Verificación después de deploy

Tras desplegar backend en Render, verificar:

1. Health
- URL: `https://horarios-20ey.onrender.com/health`
- Esperado: `200` con `{ "status": "ok" }`

2. Preflight CORS para register/login desde frontend
- Endpoint: `OPTIONS /auth/register` y `OPTIONS /auth/login`
- Origen: dominio Vercel activo (estable o preview)
- Esperado: cabecera `Access-Control-Allow-Origin` con ese origen

3. Flujo real en frontend
- Registro
- Login

Si ambos funcionan sin error CORS en consola, la integración está correcta.

## Causa raíz del incidente

El frontend cambió a un dominio preview de Vercel no incluido en allowlist CORS. Como resultado, el backend respondía sin `Access-Control-Allow-Origin` para ese origin, y el navegador bloqueaba la petición antes de llegar al flujo normal de la API.

## Estado

- Fix implementado en código
- Build y tests locales en verde
- Requiere deploy del backend para aplicarse en producción
