/* eslint-disable no-console -- script de build operativo */
/**
 * Build del frontend con VUE_APP_API_URL de producción.
 * Uso: npm run build:frontend:prod
 */
const { spawnSync } = require('child_process');
const path = require('path');
const { apiUrl } = require('../config/production-urls.cjs');

const frontendDir = path.join(__dirname, '..', 'frontend');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

console.log(`\n📦 Build frontend — VUE_APP_API_URL=${apiUrl}\n`);

const result = spawnSync(npmCmd, ['run', 'build'], {
  cwd: frontendDir,
  stdio: 'inherit',
  env: { ...process.env, VUE_APP_API_URL: apiUrl },
});

process.exit(result.status ?? 1);
