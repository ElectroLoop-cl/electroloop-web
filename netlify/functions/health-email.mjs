import nodemailer from 'nodemailer';
import { timingSafeEqual } from 'node:crypto';

// Chequeo de salud del correo del formulario: inicia sesión en Gmail con las
// mismas credenciales que send-autoresponse, sin enviar ningún correo.
// Uso: GET /.netlify/functions/health-email con el header x-health-token igual
// a la variable de entorno HEALTHCHECK_TOKEN.

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const sameToken = (given, expected) => {
  const a = Buffer.from(String(given ?? ''));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

export default async (req) => {
  if (req.method !== 'GET') return json({ error: 'Method Not Allowed' }, 405);

  const expected = process.env.HEALTHCHECK_TOKEN;
  if (!expected) return json({ error: 'Chequeo no configurado' }, 404);
  if (!sameToken(req.headers.get('x-health-token'), expected)) {
    return json({ error: 'No autorizado' }, 401);
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return json({ ok: false, error: 'Faltan GMAIL_USER o GMAIL_APP_PASSWORD' }, 503);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.verify();
    return json({ ok: true, checkedAt: new Date().toISOString() }, 200);
  } catch (err) {
    console.error('health-email: falló el login SMTP', err);
    // Solo códigos: suficiente para distinguir contraseña inválida de caída de red.
    return json({ ok: false, code: err?.code, responseCode: err?.responseCode }, 503);
  }
};
