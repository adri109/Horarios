/* eslint-disable no-console -- script de verificación operativa */
/**
 * Verificación pre-lanzamiento (producción TimeIt).
 *
 * Uso:
 *   node scripts/prelaunch-verify.js
 *   node scripts/prelaunch-verify.js --smoke
 *
 * Variables opcionales (por defecto: timeit.es / api.timeit.es):
 *   PRELAUNCH_API_URL, PRELAUNCH_FRONTEND_URL
 */
const axios = require('axios');
const { frontendUrl, apiUrl, apiUrl: PRODUCTION_API_URL } = require('../config/production-urls.cjs');

const API_URL = (process.env.PRELAUNCH_API_URL || apiUrl).replace(/\/+$/, '');
const FRONTEND_URL = (process.env.PRELAUNCH_FRONTEND_URL || frontendUrl).replace(/\/+$/, '');

const RUN_SMOKE = process.argv.includes('--smoke');
const LANDING_MARKERS = [
  'Plataforma activa',
  'Gestiona tu salón',
  'de forma profesional',
];

const results = [];

const apiHeaders = (extra = {}) => ({
  Origin: FRONTEND_URL,
  ...extra,
});

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.error(`❌ ${name}${detail ? ` — ${detail}` : ''}`);
}

function extractWebpackChunkPaths(indexBundle) {
  const mapMatch = indexBundle.match(/return"js\/"\+e\+"\."\+(\{[^}]+\})\[e\]/);
  if (!mapMatch) return [];
  return [...mapMatch[1].matchAll(/(\d+):"([a-f0-9]+)"/g)].map(
    ([, id, hash]) => `/js/${id}.${hash}.js`
  );
}

async function fetchText(url) {
  const { status, data } = await axios.get(url, {
    timeout: 90000,
    responseType: 'text',
    validateStatus: () => true,
  });
  if (status !== 200) {
    throw new Error(`HTTP ${status}`);
  }
  return data;
}

async function checkHealth() {
  const response = await axios.get(`${API_URL}/health`, {
    timeout: 90000,
    validateStatus: () => true,
    headers: apiHeaders(),
  });
  const { status, data } = response;
  if (status === 200 && data?.status === 'ok') {
    pass('Health check', API_URL);
    return true;
  }

  let hint = '';
  if (status === 403) {
    hint = ' — el proxy puede exigir header Origin (https://timeit.es)';
  }
  fail('Health check', `status=${status}${hint}`);
  return false;
}

async function checkCors(method, path) {
  const response = await axios({
    method: 'OPTIONS',
    url: `${API_URL}${path}`,
    headers: {
      Origin: FRONTEND_URL,
      'Access-Control-Request-Method': method,
    },
    timeout: 90000,
    validateStatus: () => true,
  });

  const allowOrigin = response.headers['access-control-allow-origin'];
  if (response.status === 200 && allowOrigin === FRONTEND_URL) {
    pass(`CORS preflight ${path}`, allowOrigin);
    return true;
  }

  fail(
    `CORS preflight ${path}`,
    `status=${response.status}, allow-origin=${allowOrigin || '(vacío)'}`
  );
  return false;
}

async function checkFrontendIndex() {
  const { status, data } = await axios.get(`${FRONTEND_URL}/`, {
    timeout: 60000,
    responseType: 'text',
    validateStatus: () => true,
  });

  if (status !== 200) {
    fail('Frontend index', `HTTP ${status}`);
    return false;
  }

  const scriptMatch = data.match(/\/js\/index\.([a-f0-9]+)\.js/);
  if (!scriptMatch) {
    const legacy = data.includes('/js/index.js');
    fail(
      'Frontend bundle',
      legacy
        ? 'Build antiguo sin hash — push a GitHub y redeploy app frontend (root: frontend/)'
        : 'No se encontró /js/index.<hash>.js en index.html'
    );
    return false;
  }

  pass('Frontend index', `bundle index.${scriptMatch[1]}.js`);

  try {
    const indexBundle = await fetchText(`${FRONTEND_URL}/js/index.${scriptMatch[1]}.js`);
    const chunkPaths = extractWebpackChunkPaths(indexBundle);
    const inlineScripts = [...data.matchAll(/\/js\/[^"']+\.js/g)].map((m) => m[0]);
    const scriptPaths = [...new Set([...inlineScripts, ...chunkPaths])];

    const bundles = await Promise.all(
      scriptPaths.map((p) => fetchText(`${FRONTEND_URL}${p}`).catch(() => ''))
    );
    const combined = [indexBundle, ...bundles].join('\n');

    if (!combined.includes(PRODUCTION_API_URL)) {
      fail(
        'Frontend API URL',
        `No aparece ${PRODUCTION_API_URL} — rebuild con npm run build:frontend:prod`
      );
    } else {
      pass('Frontend API URL', PRODUCTION_API_URL);
    }

    const missing = LANDING_MARKERS.filter((m) => !combined.includes(m));
    if (missing.length === 0) {
      pass('Landing copy en producción', 'markers actuales presentes (chunks lazy)');
      return true;
    }
    fail(
      'Landing copy en producción',
      `Falta redeploy: no aparecen ${missing.join(', ')} en los bundles publicados`
    );
    return false;
  } catch (error) {
    fail('Frontend bundles', error.message);
    return false;
  }
}

async function runSmokeFlow() {
  const stamp = Date.now();
  const email = `prelaunch.${stamp}@mailinator.com`;
  const password = 'Prelaunch1!';
  const salonName = `Salon Prelaunch ${stamp}`;

  let token;
  let slug;
  let adminId;
  let serviceId;
  let appointmentId;

  const authHeaders = () => apiHeaders({ Authorization: `Bearer ${token}` });

  const registerRes = await axios.post(
    `${API_URL}/auth/register`,
    {
      email,
      password,
      fullName: 'Prelaunch Bot',
      salonName,
      salonPhone: '600000000',
    },
    {
      headers: apiHeaders({ 'Content-Type': 'application/json' }),
      timeout: 90000,
      validateStatus: () => true,
    }
  );

  if (registerRes.status !== 201 || !registerRes.data?.token) {
    fail('Smoke: registro salón', `status=${registerRes.status}`);
    return false;
  }

  token = registerRes.data.token;
  slug = registerRes.data.user?.salon?.slug;
  adminId = registerRes.data.user?.id;
  pass('Smoke: registro salón', `slug=${slug}`);

  const loginRes = await axios.post(
    `${API_URL}/auth/login`,
    { email, password },
    {
      headers: apiHeaders({ 'Content-Type': 'application/json' }),
      timeout: 90000,
      validateStatus: () => true,
    }
  );

  if (loginRes.status !== 200 || !loginRes.data?.token) {
    fail('Smoke: login ADMIN', `status=${loginRes.status}`);
    return false;
  }
  token = loginRes.data.token;
  pass('Smoke: login ADMIN');

  const serviceRes = await axios.post(
    `${API_URL}/services`,
    {
      name: 'Corte prelaunch',
      description: 'Verificación automática',
      duration: 30,
      price: 15,
    },
    {
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      timeout: 90000,
      validateStatus: () => true,
    }
  );

  if (serviceRes.status !== 201 && serviceRes.status !== 200) {
    fail('Smoke: alta servicio', `status=${serviceRes.status}`);
    return false;
  }
  serviceId = serviceRes.data?.id || serviceRes.data?.service?.id;
  pass('Smoke: alta servicio', `id=${serviceId}`);

  const publicRes = await axios.get(`${API_URL}/public/${slug}`, {
    headers: apiHeaders(),
    timeout: 90000,
    validateStatus: () => true,
  });
  const publicSalonName = publicRes.data?.salon?.name;
  if (publicRes.status !== 200 || !publicSalonName) {
    fail('Smoke: página pública API', `status=${publicRes.status}`);
    return false;
  }
  pass('Smoke: página pública API', publicSalonName);

  const start = new Date();
  start.setDate(start.getDate() + 2);
  start.setHours(10, 0, 0, 0);

  const publicAptRes = await axios.post(
    `${API_URL}/public/${slug}/appointments`,
    {
      clientName: 'Cliente Prelaunch',
      clientPhone: '611111111',
      serviceId,
      startTime: start.toISOString(),
    },
    {
      headers: apiHeaders({ 'Content-Type': 'application/json' }),
      timeout: 90000,
      validateStatus: () => true,
    }
  );

  if (publicAptRes.status !== 201 && publicAptRes.status !== 200) {
    fail(
      'Smoke: cita pública (alta cliente)',
      `status=${publicAptRes.status} — ${JSON.stringify(publicAptRes.data)}`
    );
    return false;
  }
  appointmentId = publicAptRes.data?.appointment?.id;
  pass('Smoke: cita pública (alta cliente)', `cita=${appointmentId}`);

  const clientsRes = await axios.get(`${API_URL}/clients`, {
    headers: authHeaders(),
    timeout: 90000,
    validateStatus: () => true,
  });
  if (clientsRes.status !== 200 || !Array.isArray(clientsRes.data) || clientsRes.data.length < 1) {
    fail('Smoke: listado clientes', `status=${clientsRes.status}`);
    return false;
  }
  pass('Smoke: listado clientes', `${clientsRes.data.length} cliente(s)`);

  const panelStart = new Date(start);
  panelStart.setHours(12, 0, 0, 0);
  const panelEnd = new Date(panelStart.getTime() + 30 * 60000);

  const panelAptRes = await axios.post(
    `${API_URL}/appointments`,
    {
      clientId: clientsRes.data[0].id,
      stylistId: adminId,
      serviceId,
      startTime: panelStart.toISOString(),
      endTime: panelEnd.toISOString(),
    },
    {
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      timeout: 90000,
      validateStatus: () => true,
    }
  );

  if (panelAptRes.status !== 201 && panelAptRes.status !== 200) {
    fail('Smoke: alta cita panel', `status=${panelAptRes.status} — ${JSON.stringify(panelAptRes.data)}`);
    return false;
  }
  const panelAptId = panelAptRes.data?.id || panelAptRes.data?.appointment?.id;
  pass('Smoke: alta cita panel', `id=${panelAptId}`);

  const statusRes = await axios.put(
    `${API_URL}/appointments/${panelAptId}/status`,
    { status: 'CONFIRMED' },
    {
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      timeout: 90000,
      validateStatus: () => true,
    }
  );

  if (statusRes.status !== 200) {
    fail('Smoke: cambio estado cita', `status=${statusRes.status}`);
    return false;
  }
  pass('Smoke: cambio estado cita', 'CONFIRMED');

  console.log('\nℹ️  Cuenta de prueba creada en producción:');
  console.log(`   email: ${email}`);
  console.log(`   password: ${password}`);
  console.log(`   slug: ${slug}`);
  console.log(`   URL pública: ${FRONTEND_URL}/salon/${slug}`);

  return true;
}

(async () => {
  console.log(`\n🔍 Prelaunch verify — TimeIt`);
  console.log(`   API: ${API_URL}`);
  console.log(`   Web: ${FRONTEND_URL}`);
  console.log(`   Modo smoke: ${RUN_SMOKE ? 'sí' : 'no'}\n`);

  try {
    await checkHealth();
    await checkCors('POST', '/auth/login');
    await checkCors('POST', '/auth/register');
    await checkFrontendIndex();

    if (RUN_SMOKE) {
      await runSmokeFlow();
    } else {
      console.log('\nℹ️  Flujo completo: npm run prelaunch:smoke');
    }
  } catch (error) {
    fail('Error inesperado', error.message);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n📊 Resultado: ${results.length - failed.length}/${results.length} OK`);

  if (failed.length > 0) {
    process.exit(1);
  }
})();
