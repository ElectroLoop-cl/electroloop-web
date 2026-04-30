// Netlify Function: envía autorespuesta vía Gmail SMTP
// Variables de entorno requeridas en Netlify:
//   GMAIL_USER         = cristian@electroloop.cl
//   GMAIL_APP_PASSWORD = (App Password de 16 caracteres)

const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { email, name } = JSON.parse(event.body || '{}');

    if (!email || !name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing email or name' }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"ElectroLoop" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '¡Recibimos tu mensaje! — ElectroLoop',
      text: `¡Hola ${name}!\n\nRecibimos tu solicitud y te contactaremos a la brevedad.\n\nSaludos,\nElectroLoop`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1A2535;">
          <p style="font-size:16px;">¡Hola <strong>${name}</strong>!</p>
          <p style="font-size:15px;">Recibimos tu solicitud y te contactaremos a la brevedad.</p>
          <p style="font-size:15px;margin-top:24px;">Saludos,<br/><strong style="color:#0B1B32;">ElectroLoop</strong></p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:12px;color:#8E9297;">© 2026 ElectroLoop SpA · Santiago, Chile</p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Autoresponse error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal error' }),
    };
  }
};
