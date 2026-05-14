import nodemailer from 'nodemailer';

/**
 * Zoho Mail con dominio propio (ej. no-reply@timeit.es) debe usar
 * smtppro.zoho.eu (datacenter UE) o smtppro.zoho.com (US), no smtp.zoho.*.
 * Ver "Server Configuration Details" en Zoho Mail si sigue fallando la auth.
 */
export function createSmtpTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure =
    process.env.SMTP_SECURE === 'true' || port === 465;

  const user = process.env.SMTP_USER?.trim() ?? '';
  const pass =
    (process.env.SMTP_PASS ?? '').replace(/\s+/g, '').trim();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(secure ? {} : { requireTLS: true }),
  });
}

/** Nombre visible del remitente si no se indica otro (cabecera From). */
export function smtpDefaultFromName(): string {
  return (process.env.SMTP_FROM_NAME || 'TimeIt').trim();
}

/** From para nodemailer: `{ name, address }` usa SMTP_USER como dirección. */
export function smtpFrom(displayName?: string): { name: string; address: string } {
  const address = process.env.SMTP_USER?.trim() ?? '';
  const name = (displayName ?? smtpDefaultFromName()).trim();
  return { name, address };
}
