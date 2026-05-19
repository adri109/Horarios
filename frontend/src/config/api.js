/**
 * URL del API. En local usa .env.development.local (gitignored).
 * En producción, Vercel inyecta VUE_APP_API_URL (p. ej. Render).
 */
export const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
