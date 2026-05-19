import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async (req, context) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(req.body);
    const { email, name } = data;

    console.log('🔍 send-autoresponse called with:', { email, name });
    console.log('📧 GMAIL_USER env:', process.env.GMAIL_USER ? '✅ Configurado' : '❌ NO configurado');
    console.log('🔑 GMAIL_APP_PASSWORD env:', process.env.GMAIL_APP_PASSWORD ? '✅ Configurado' : '❌ NO configurado');

    if (!email || !name) {
      console.error('❌ Missing email or name:', { email, name });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and name required' }),
      };
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Gmail environment variables NOT configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' }),
      };
    }

    // 1. AUTORESPONSE TO USER
    const userMailOptions = {
      from: process.env.GMAIL_USER,
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
              Hola <strong>${name}</strong>,
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
              Si tienes dudas mientras tanto, puedes escribirnos a <strong>contacto@electroloop.cl</strong> o contactar por WhatsApp.
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
              Región IV de Coquimbo • La Serena, Chile
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(userMailOptions);

    // 2. NOTIFICATION TO ADMIN
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `📋 [CONTACTO] Nueva solicitud - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #FB923C; border-bottom: 2px solid #FB923C; padding-bottom: 10px;">
            Nueva Solicitud de Contacto
          </h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleString('es-CL')}</p>
          </div>

          <p>
            <strong>⏱️ Acción requerida:</strong> Contacta al cliente a través del email arriba para seguimiento personalizado.
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Este es un mensaje automático del sistema de contacto de ElectroLoop.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Autoresponse email sent successfully'
      }),
    };
  } catch (err) {
    console.error('Autoresponse Email Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error sending autoresponse email',
        details: err.message
      }),
    };
  }
};
