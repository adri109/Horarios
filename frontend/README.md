# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Desarrollo local (API)

1. En la raíz del repo: `npm run dev` (backend en `http://localhost:3000`).
2. En `frontend/`: copia `.env.development.local.example` → `.env.development.local`.
3. `npm run serve` — el frontend usará `http://localhost:3000` y **no** tocará la config de Vercel.

Los archivos `.env*` y `.env.development.local` están en `.gitignore` y no se suben a GitHub.

## Deploy en Vercel

- Configura el proyecto en Vercel con `Root Directory = frontend`.
- Define `VUE_APP_API_URL` apuntando al backend de Render (solo en el panel de Vercel).
- Este proyecto incluye `vercel.json` con rewrite SPA para Vue Router.
