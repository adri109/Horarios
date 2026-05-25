# Frontend — TimeIt

**Producción:** https://timeit.es  
**API:** https://api.timeit.es

## Desarrollo local

```bash
npm install
npm run serve
```

1. API en la raíz: `npm run dev` → `http://localhost:3000`
2. Copia `.env.development.local.example` → `.env.development.local`

## Build de producción

```bash
# Definir la URL del API antes del build (se embebe en el bundle)
VUE_APP_API_URL=https://api.timeit.es npm run build
```

PowerShell:

```powershell
$env:VUE_APP_API_URL="https://api.timeit.es"; npm run build
```

Sube `dist/` a tu servidor web (nginx, Apache, etc.). SPA: `public/_redirects` o regla `try_files` en nginx (ver [CONFIGURACION_PRODUCCION.md](../CONFIGURACION_PRODUCCION.md)).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run serve` | Desarrollo con hot-reload |
| `npm run build` | Build para producción |
| `npm run lint` | ESLint |
