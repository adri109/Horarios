# Configuración de producción — TimeIt

**Web:** https://timeit.es  
**API:** https://api.timeit.es  
**Repo:** https://github.com/adri109/Horarios

El despliegue es **automático desde GitHub**: dos aplicaciones distintas en tu panel de hosting (mismo repo, carpetas diferentes). No se sube `frontend/dist/` a mano.

## Arquitectura

| App en el panel | Carpeta raíz del repo | Build | Arranque / salida | URL |
|-----------------|----------------------|-------|-------------------|-----|
| **API** | `/` (raíz) | `npm ci` → `npm run build` → `npx prisma migrate deploy` | `npm start` (`node dist/index.js`) | `https://api.timeit.es` |
| **Web** | `frontend/` | `npm ci --legacy-peer-deps` → `npm run build` | Servir **`frontend/dist/`** (estático) | `https://timeit.es` |
| **BD** | — | — | PostgreSQL (p. ej. Supabase) | `DATABASE_URL` / `DIRECT_URL` |

Tras un `git push` a la rama conectada, cada app redeploya por su lado.

## 1. DNS

En tu registrador de `timeit.es`:

| Registro | Nombre | Destino |
|----------|--------|---------|
| A o CNAME | `@` o `timeit.es` | App **Web** (frontend) |
| A o CNAME | `api` | App **API** (backend Node) |
| Opcional | `www` | Redirección a `https://timeit.es` |

## 2. App API (backend) — raíz del repo

Configuración típica en el panel (Coolify, CapRover, Dokku, etc.):

| Campo | Valor |
|-------|--------|
| Repositorio | `adri109/Horarios` |
| Rama | `main` (o la que uses) |
| **Root directory** | vacío o `/` |
| Build command | `npm ci && npm run build && npx prisma migrate deploy` |
| Start command | `npm start` |
| Puerto interno | `3000` (variable `PORT`) |

Variables de entorno en el panel (**no** en git):

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
FRONTEND_URL=https://timeit.es
CORS_ORIGINS=https://timeit.es,https://www.timeit.es
SMTP_HOST=...
SMTP_USER=no-reply@timeit.es
SMTP_PASS=...
```

Dominio público de esta app: **`api.timeit.es`**.

Health check: `GET https://api.timeit.es/health` → `{ "status": "ok" }`.

Si `/health` responde **403** con `Server: uvicorn`, el subdominio `api` apunta a **otra app** (Python), no a este backend Node.

## 3. App Web (frontend) — carpeta `frontend/`

| Campo | Valor |
|-------|--------|
| Repositorio | `adri109/Horarios` |
| Rama | `main` |
| **Root directory** | `frontend` |
| Build command | `npm ci --legacy-peer-deps && npm run build` |
| **Publish / output directory** | `dist` |
| Tipo | Sitio estático (SPA) |

La URL del API en el bundle:

- `frontend/.env.production` → `VUE_APP_API_URL=https://api.timeit.es` (commitado, se usa en `npm run build`).
- Respaldo en código: `frontend/src/config/urls.js`.

Dominio público: **`timeit.es`** (y opcional `www`).

Regla SPA: todas las rutas → `index.html` (`frontend/public/_redirects` o `try_files` en nginx).

Build local de prueba (opcional):

```bash
npm run build:frontend:prod
```

## 4. CORS

Detalle: [CONFIGURACION_CORS_PRODUCCION.md](CONFIGURACION_CORS_PRODUCCION.md).

El código ya permite `https://timeit.es` y `https://www.timeit.es` en producción; mantén las variables de entorno alineadas.

## 5. Verificación tras el deploy

```bash
npm run prelaunch:verify
npm run prelaunch:smoke
```

URLs por defecto en `config/production-urls.cjs`.

Señales de deploy correcto en **Web**: `index.html` referencia `/js/index.<hash>.js` (no `/js/index.js` plano).

## 6. Desarrollo local

- API: `npm run dev` → http://localhost:3000  
- Web: `cd frontend && npm run serve` → http://localhost:8080  
- `frontend/.env.development.local` con `VUE_APP_API_URL=http://localhost:3000`

## Referencia rápida

| Entorno | API | Frontend |
|---------|-----|----------|
| Local | `npm run dev` | `npm run serve` |
| Producción (GitHub → panel) | push a raíz → `npm start` | push a `frontend/` → build → `dist/` |
