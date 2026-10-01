import nodemailer from 'nodemailer';

// Netlify Functions v2: recibe un Request y debe devolver un Response.
// Avisa al equipo de cada contacto del formulario de la home y envía autorespuesta al cliente.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const json = (body, status) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const escapeHtml = (value) =>
  String(value ?? '')
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);

  let data;
  try {
    data = await req.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const email = String(data.email ?? '').trim();
  const nombre = String(data.nombre ?? data.name ?? '').trim();
  if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Nombre y email válidos son obligatorios' }, 400);
  }
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('GMAIL_USER / GMAIL_APP_PASSWORD no configurados');
    return json({ error: 'Servicio de correo no configurado' }, 500);
  }

  const safe = {
    nombre: escapeHtml(nombre),
    email: escapeHtml(email),
    empresa: escapeHtml(data.empresa),
    categoria: escapeHtml(data.categoria),
    mensaje: escapeHtml(data.mensaje).replace(/\n/g, '<br/>'),
    origen: escapeHtml(data.origen),
  };

  // Ambos correos salen en paralelo: en serie superaban el límite de 10 s de
  // las funciones de Netlify y la autorespuesta al cliente se cortaba.
  const adminMailOptions = {
    from: `"ElectroLoop" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `[CONTACTO WEB] ${nombre}${data.empresa ? ' — ' + String(data.empresa).slice(0, 80) : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #B97333; border-bottom: 2px solid #B97333; padding-bottom: 10px;">Nuevo contacto desde electroloop.cl</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Nombre:</strong> ${safe.nombre}</p>
          <p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
          <p><strong>Empresa:</strong> ${safe.empresa || '—'}</p>
          <p><strong>Tipo:</strong> ${safe.categoria || '—'}</p>
          <p><strong>Mensaje:</strong><br/>${safe.mensaje || '—'}</p>
          <p><strong>Página:</strong> ${safe.origen || '—'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</p>
        </div>
        <p>Responde directamente a este correo para contactar al cliente.</p>
      </div>
    `,
  };

  const userMailOptions = {
    from: `"ElectroLoop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '✅ Recibimos tu solicitud - ElectroLoop',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FB923C; margin: 0; font-size: 28px;">ElectroLoop</h1>
          <p style="color: #CBD5E1; margin: 5px 0 0 0; font-size: 14px;">Gestor RAEE Integrador</p>
        </div>

        <!-- Content -->
        <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px;">
          <p style="color: #1E293B; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
            Hola <strong>${safe.nombre}</strong>,
          </p>

          <p style="color: #64748B; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
            ¡Gracias por contactarnos! 🎉
          </p>

          <div style="background: white; border-left: 4px solid #FB923C; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #1E293B; margin: 0; font-weight: 600;">Hemos recibido tu solicitud correctamente</p>
            <p style="color: #64748B; margin: 8px 0 0 0; font-size: 14px;">
              Nuestro equipo revisará tu mensaje y nos comunicaremos contigo a la brevedad para conocer tus necesidades de gestión de residuos electrónicos.
            </p>
          </div>

          <p style="color: #64748B; font-size: 15px; line-height: 1.7; margin: 20px 0;">
            <strong>¿Qué sigue?</strong>
          </p>
          <ul style="color: #64748B; font-size: 14px; line-height: 2; margin: 10px 0 20px 20px; padding: 0;">
            <li>📧 Nuestro equipo analizará tu solicitud</li>
            <li>📞 Te contactaremos en los próximos días</li>
            <li>🤝 Coordinaremos una consulta personalizada si es necesario</li>
          </ul>

          <p style="color: #64748B; font-size: 15px; line-height: 1.7; margin: 20px 0 30px 0;">
            Si tienes dudas mientras tanto, puedes escribirnos a <strong>contacto@electroloop.cl</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #1E293B; color: #94A3B8; padding: 30px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 10px 0;">
            <strong style="color: #FB923C;">ElectroLoop</strong><br/>
            Recolección • Tratamiento • Gestión REP
          </p>
          <p style="margin: 10px 0 0 0;">
            <a href="https://electroloop.cl" style="color: #FB923C; text-decoration: none;">electroloop.cl</a> |
            <a href="mailto:contacto@electroloop.cl" style="color: #FB923C; text-decoration: none;">contacto@electroloop.cl</a>
          </p>
          <p style="margin: 10px 0 0 0; color: #64748B;">
            Chile
          </p>
        </div>
      </div>
    `,
  };

  const [admin, user] = await Promise.allSettled([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(userMailOptions),
  ]);

  // Diagnóstico temporal: solo códigos SMTP, sin datos sensibles.
  const diag = (r) =>
    r.status === 'fulfilled'
      ? { ok: true, response: String(r.value?.response ?? '').slice(0, 120), rejected: r.value?.rejected?.length ?? 0 }
      : { ok: false, code: r.reason?.code, responseCode: r.reason?.responseCode, command: r.reason?.command, response: String(r.reason?.response ?? r.reason?.message ?? '').slice(0, 160) };

  if (user.status === 'rejected') console.error('Error enviando autorespuesta:', user.reason);
  if (admin.status === 'rejected') {
    console.error('Error enviando aviso al equipo:', admin.reason);
    return json({ error: 'No se pudo enviar el aviso', admin: diag(admin), user: diag(user) }, 500);
  }

  return json({ success: true, admin: diag(admin), user: diag(user) }, 200);
};
