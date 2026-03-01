# Checklist de Pre-lanzamiento (Operativo)

Fecha de ejecución: 2026-02-28
Objetivo: dejar la app lista para publicación controlada en producción.

Actualización: 2026-02-28 (estado deploy)

## 1) Calidad técnica mínima

- [x] Tests críticos backend ejecutados (`auth`, `appointments`, `services`)
- [x] Build backend en verde (`npm run build`)
- [x] Build frontend en verde (`frontend/npm run build`)
- [ ] Smoke test manual de login + creación de cita en entorno deployado

## 2) Claims y comunicación comercial

- [x] Mensajes de landing alineados a funcionalidad real
- [x] `README` alineado a estado real del producto
- [x] Inventario marcado como “Próximamente” (sin sobrepromesa funcional)

## 3) Configuración de producción (Render + Vercel)

- [x] Backend en Render con `DATABASE_URL` y `DIRECT_URL` configuradas (confirmado)
- [x] `JWT_SECRET` robusto (32+ caracteres aleatorios) (confirmado)
- [x] `FRONTEND_URL` y `CORS_ORIGINS` apuntando al frontend real
  - Frontend reportado: `https://horarios-six.vercel.app/`
- [x] Frontend en Vercel con `VUE_APP_API_URL` hacia backend en Render (confirmado)
- [ ] Migraciones aplicadas en deploy (`npx prisma migrate deploy`) (pendiente confirmación)
- [x] Health check `/health` respondiendo OK en URL pública
  - URL: `https://horarios-20ey.onrender.com/health`
  - Verificación actual: `HTTP 200` con `{ "status": "ok" }`

## 3.1) Coherencia de release frontend

- [ ] Redeploy de frontend con último commit aprobado
  - Verificación actual en producción: landing muestra copy antiguo (claims y branding previos).
  - Riesgo: desalineación con los ajustes de publicación ya cerrados en repositorio.

## 3.2) Incidencia de conexión front-back (Mar 2026)

- [x] Diagnóstico realizado
  - Frontend desplegado apunta a backend correcto (`horarios-20ey.onrender.com`).
  - Fallo principal detectado: CORS sin `Access-Control-Allow-Origin` para el dominio de Vercel en respuestas reales.
- [x] Corrección aplicada en backend (repositorio)
  - Normalización de orígenes CORS en [src/index.ts](src/index.ts) para aceptar valores con/sin slash final.
- [ ] Pendiente despliegue del fix en Render
  - Acción: redeploy del backend para publicar la corrección.
  - Verificación posterior: `OPTIONS /auth/login` debe incluir `Access-Control-Allow-Origin: https://horarios-six.vercel.app`.

## 4) Revisión funcional mínima post-deploy

- [ ] Estado actual: validación parcial (falta checklist funcional completo)
- [ ] Registro de salón nuevo
- [ ] Login ADMIN
- [ ] Alta de servicio
- [ ] Alta de cliente
- [ ] Alta de cita
- [ ] Cambio de estado de cita
- [ ] Carga de página pública `/salon/:slug`

## 5) Riesgos no bloqueantes detectados

- [ ] Bundle frontend por encima de recomendación de tamaño (warning de webpack).
  - Estado actual: **no bloqueante para publicar**.
  - Acción recomendada: dividir vistas grandes con `import()` en una iteración de performance.

## Criterio de Go-Live recomendado

Publicar cuando estén completados todos los checks de los bloques 1, 3 y 4.
