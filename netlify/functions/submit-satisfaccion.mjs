import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const RECIPIENT = process.env.SURVEY_RECIPIENT_EMAIL || 'contacto@electroloop.cl';

const INTERES_LABELS = {
  si: 'Sí, contáctenme',
  quizas: 'Quizás, contáctenme',
  no: 'Por ahora no',
};

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const data = await req.json();
    const { nps, ejecucion, trazabilidad, valor, mejorar, interes, cliente, token } = data;

    const npsNum = Number(nps);
    const ejecucionNum = Number(ejecucion);
    const trazabilidadNum = Number(trazabilidad);

    if (
      !Number.isInteger(npsNum) || npsNum < 0 || npsNum > 10 ||
      !Number.isInteger(ejecucionNum) || ejecucionNum < 1 || ejecucionNum > 7 ||
      !Number.isInteger(trazabilidadNum) || trazabilidadNum < 1 || trazabilidadNum > 7 ||
      !valor || !String(valor).trim()
    ) {
      return new Response(JSON.stringify({ error: 'Respuestas obligatorias incompletas o inválidas' }), { status: 400 });
    }

    const segmento = npsNum >= 9 ? 'PROMOTOR' : npsNum >= 7 ? 'PASIVO' : 'DETRACTOR';
    const segmentoColor = npsNum >= 9 ? '#B87333' : npsNum >= 7 ? '#8E9297' : '#A23B3B';

    const clienteLine = cliente
      ? `<p style="margin:0 0 4px;color:#8E9297;font-size:13px;">Cliente / referencia: <strong style="color:#0B1B32;">${escapeHtml(cliente)}</strong>${token ? ` (token: ${escapeHtml(token)})` : ''}</p>`
      : '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color:#0B1B32;">
        <div style="background:#0B1B32;padding:20px 24px;">
          <span style="color:#F4F4F4;font-size:18px;font-weight:bold;">Electro<span style="color:#B87333;">Loop</span></span>
          <div style="color:#8E9297;font-size:12px;margin-top:4px;">Nueva respuesta — Encuesta de Satisfacción</div>
        </div>
        <div style="padding:24px;border:1px solid #eee;border-top:none;">
          ${clienteLine}
          <p style="margin:0 0 16px;color:#8E9297;font-size:13px;">Recibida: ${new Date().toLocaleString('es-CL')}</p>

          <div style="display:inline-block;background:${segmentoColor};color:#fff;font-size:12px;font-weight:bold;padding:4px 10px;border-radius:4px;margin-bottom:16px;">
            ${segmento} · NPS ${npsNum}/10
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#8E9297;font-size:13px;width:60%;">1. Recomendación (NPS 0–10)</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;text-align:right;">${npsNum} / 10</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#8E9297;font-size:13px;">2. Ejecución del retiro (1–7)</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;text-align:right;">${ejecucionNum} / 7</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#8E9297;font-size:13px;">3. Informe de trazabilidad (1–7)</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;text-align:right;">${trazabilidadNum} / 7</td>
            </tr>
          </table>

          <p style="margin:0 0 4px;color:#8E9297;font-size:13px;">4. ¿Qué generó más valor / tranquilidad?</p>
          <p style="margin:0 0 16px;padding:10px 12px;background:#F4F4F4;border-left:3px solid #B87333;">${escapeHtml(valor)}</p>

          ${mejorar && String(mejorar).trim() ? `
          <p style="margin:0 0 4px;color:#8E9297;font-size:13px;">5. ¿Qué mejorar?</p>
          <p style="margin:0 0 16px;padding:10px 12px;background:#F4F4F4;border-left:3px solid #8E9297;">${escapeHtml(mejorar)}</p>
          ` : ''}

          ${interes ? `
          <p style="margin:0 0 16px;color:#8E9297;font-size:13px;">6. Interés en retiros periódicos / extender servicio: <strong style="color:#0B1B32;">${escapeHtml(INTERES_LABELS[interes] || interes)}</strong></p>
          ` : ''}

          <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;">
            <p style="color:#8E9297;font-size:12px;margin:0;">
              ElectroLoop · Sociedad de Reciclaje La Serena SpA ·
              <a href="https://electroloop.cl" style="color:#B87333;text-decoration:none;">electroloop.cl</a>
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: RECIPIENT,
      subject: `[ENCUESTA] ${segmento} · NPS ${npsNum} ${cliente ? '· ' + cliente : ''}`,
      html,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Survey submission error:', err);
    return new Response(JSON.stringify({ error: 'Error al enviar la encuesta' }), { status: 500 });
  }
};
