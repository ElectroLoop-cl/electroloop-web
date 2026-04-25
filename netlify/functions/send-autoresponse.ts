import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { email, name } = body;

    if (!email || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email and name are required" }),
      };
    }

    // Usar SendGrid API para enviar email automático
    // Nota: Necesitas tener SENDGRID_API_KEY como variable de entorno en Netlify
    const sendgridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendgridApiKey) {
      console.warn("SENDGRID_API_KEY not configured");
      // Retornar éxito de todas formas para no mostrar error al usuario
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0B1B32; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #B97333; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    .accent { color: #B97333; font-weight: bold; }
    a { color: #B97333; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Gracias por contactarnos</h1>
    </div>

    <div class="content">
      <p>Hola <strong>${name}</strong>,</p>

      <p>Confirmamos que hemos recibido tu mensaje en <span class="accent">ElectroLoop</span>.</p>

      <p>Nos alegra mucho que te intereses en nuestros servicios de gestión de residuos electrónicos. Nuestro equipo especializado revisará tu consulta y nos pondremos en contacto <strong>lo antes posible</strong> para ayudarte a optimizar tu cumplimiento REP y tus metas de recuperación.</p>

      <p><strong>¿Necesitas ayuda urgente?</strong><br>
      Si tu consulta es urgente, puedes escribirnos directamente a <a href="mailto:contacto@electroloop.cl">contacto@electroloop.cl</a></p>

      <p><strong>Sobre ElectroLoop:</strong><br>
      Somos especialistas en gestión integral de RAEE con trazabilidad auditable y destrucción certificada de datos. Simplificamos tu cumplimiento normativo y te entregamos reportería lista para el Ministerio del Medio Ambiente.</p>
    </div>

    <div class="footer">
      <p><strong>ElectroLoop</strong><br>
      Gestión RAEE certificada de punta a punta<br>
      <a href="https://electroloop.cl">electroloop.cl</a><br>
      <br>
      <em>Este es un mensaje automático. Por favor, no respondas a este email. Usa el formulario de contacto en nuestra web para consultas adicionales.</em></p>
    </div>
  </div>
</body>
</html>
    `;

    // Enviar usando fetch a SendGrid API
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email, name: name }],
            subject: "Confirmación de recepción - ElectroLoop",
          },
        ],
        from: {
          email: "contacto@electroloop.cl",
          name: "ElectroLoop",
        },
        content: [
          {
            type: "text/html",
            value: emailContent,
          },
        ],
        reply_to: {
          email: "contacto@electroloop.cl",
        },
      }),
    });

    if (!response.ok) {
      console.error("SendGrid error:", await response.text());
      // No retornar error para no confundir al usuario
      return {
        statusCode: 202,
        body: JSON.stringify({ success: true, note: "Form received" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Autoresponse sent" }),
    };
  } catch (error) {
    console.error("Function error:", error);
    // Retornar éxito para no mostrar error al usuario
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  }
};

export { handler };
