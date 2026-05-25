# CORS — TimeIt (producción)

**Web:** `https://timeit.es`  
**API:** `https://api.timeit.es`

## Variables en el servidor del API

```env
FRONTEND_URL=https://timeit.es
CORS_ORIGINS=https://timeit.es,https://www.timeit.es
```

Sin barra final (`/`).

En `src/index.ts` también están permitidos `timeit.es` y `www.timeit.es` en producción como respaldo.

## Verificación

```bash
npm run prelaunch:verify
```

Manual:

1. `GET https://api.timeit.es/health` → `200`
2. `OPTIONS https://api.timeit.es/auth/login` con `Origin: https://timeit.es` → `Access-Control-Allow-Origin: https://timeit.es`
3. Login en https://timeit.es sin errores CORS

## Documentación relacionada

- [CONFIGURACION_PRODUCCION.md](CONFIGURACION_PRODUCCION.md)
- [.env.example](.env.example)
