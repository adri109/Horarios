/* eslint-disable no-console -- script */
require('dotenv').config();
const nodemailer = require('nodemailer');

async function tryVerify(label, opts) {
  const t = nodemailer.createTransport(opts);
  try {
    await t.verify();
    console.log(label, '=> OK');
  } catch (e) {
    console.log(label, '=>', e.code || '', e.responseCode || '', String(e.response || e.message));
  }
}

(async () => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();
  console.log('SMTP_USER=', user);

  const variants = [
    ['smtppro.zoho.eu:587 STARTTLS', { host: 'smtppro.zoho.eu', port: 587, secure: false, requireTLS: true }],
    ['smtppro.zoho.com:587 STARTTLS', { host: 'smtppro.zoho.com', port: 587, secure: false, requireTLS: true }],
    ['smtppro.zoho.eu:465 SSL', { host: 'smtppro.zoho.eu', port: 465, secure: true }],
    ['smtppro.zoho.com:465 SSL', { host: 'smtppro.zoho.com', port: 465, secure: true }],
  ];

  for (const [label, base] of variants) {
    await tryVerify(label, { ...base, auth: { user, pass } });
  }
})();
