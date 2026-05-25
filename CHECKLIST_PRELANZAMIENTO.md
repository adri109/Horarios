# Checklist de Pre-lanzamiento — TimeIt

**Web:** https://timeit.es  
**API:** https://api.timeit.es  
**Deploy:** automático desde GitHub → dos apps (API = raíz repo, Web = carpeta `frontend/`)

Fecha: 2026-05-25

Guía: [CONFIGURACION_PRODUCCION.md](CONFIGURACION_PRODUCCION.md)

## 1) Calidad técnica mínima

- [x] Tests críticos backend (`auth`, `appointments`, `services`) — 6/6 OK
- [x] Build frontend local — OK
- [x] Build backend (`npm run build`)
- [x] Smoke test API (`npm run prelaunch:smoke`) — flujo E2E OK (con header Origin)
- [ ] Smoke test manual: https://timeit.es/login → dashboard → cita

## 2) Comunicación y producto

- [x] Landing alineada a funcionalidad real
- [x] Docs con dominio timeit.es (sin Render/Vercel/Railway)
- [x] Inventario como “Próximamente”
- [x] Copy de login sin promesa de inventario activo

## 3) Producción (panel de hosting + GitHub)

Dos apps en el panel, mismo repo `adri109/Horarios`:

### App API (root `/`)

- [x] API operativa (registro, login, servicios, citas, `/public/:slug`)
- [x] CORS con `https://timeit.es`
- [ ] Env en panel: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `FRONTEND_URL`, `CORS_ORIGINS`, SMTP
- [x] `/health` OK (desde navegador/proxy con Origin; el proxy bloquea peticiones sin Origin)

### App Web (root `frontend/`)

- [ ] Root directory: `frontend`
- [ ] Build: `npm ci --legacy-peer-deps && npm run build`
- [ ] Publish directory: `dist`
- [ ] Dominio: `timeit.es`
- [x] `frontend/.env.production` con `VUE_APP_API_URL=https://api.timeit.es`
- [ ] **Redeploy pendiente** — producción sirve build antiguo (`/js/index.js` sin hash)

**Estado actual:**

| Componente | Estado |
|------------|--------|
| API funcional | OK (smoke E2E pasó) |
| Web en producción | Build antiguo — falta push + redeploy |

## 4) Funcional mínimo post-deploy

Verificado por `npm run prelaunch:smoke`:

- [x] Registro de salón
- [x] Login ADMIN
- [x] Alta de servicio
- [x] Alta de cliente (reserva pública)
- [x] Alta de cita (panel)
- [x] Cambio de estado de cita
- [ ] `/salon/:slug` en https://timeit.es (requiere redeploy frontend)

## 5) No bloqueante

- [x] Bundle frontend con `import()` en router

## Verificación

```bash
npm run prelaunch:verify
npm run prelaunch:smoke
```

## Go-Live

1. **Commit + push** de los cambios pendientes a GitHub.
2. Redeploy app **Web** (`frontend/`) — es lo que falta para landing, login copy y rutas lazy.
3. Prueba manual en https://timeit.es/login.
4. `npm run prelaunch:verify` debe pasar también el check de frontend bundle.

Dominio público: **timeit.es**.
