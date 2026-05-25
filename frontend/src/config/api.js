/**
 * URL del API. Local: .env.development.local. Producción: VUE_APP_API_URL → https://api.timeit.es
 */
import { PRODUCTION_API_URL } from './urls';

export const API_BASE_URL =
  process.env.VUE_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : 'http://localhost:3000');
