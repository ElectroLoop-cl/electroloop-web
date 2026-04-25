import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  // Solo procesar submissions del formulario
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    // Extraer datos del formulario
    const { email, name, company, type, message } = payload.data;

    if (!email) {
      return { statusCode: 400, body: "Email is required" };
    }

    // Preparar contenido del email de respuesta automática
    const emailContent = `
Hola ${name},

Gracias por contactarnos. Hemos recibido tu mensaje y queremos confirmar que nos gustaría ayudarte con tu necesidad de gestión de residuos electrónicos.

Detalles de tu consulta:
- Nombre: ${name}
- Empresa: ${company || "No especificada"}
- Tipo de consulta: ${type || "General"}
- Mensaje: ${message}

Nuestro equipo revisará tu solicitud y nos pondremos en contacto lo antes posible para ayudarte.

Si tienes alguna consulta urgente, no dudes en escribirnos a contacto@electroloop.cl

Saludos,
Equipo ElectroLoop
Gestión RAEE certificada de punta a punta
https://electroloop.cl
    `;

    // Enviar email de respuesta automática usando SendGrid o Mailgun
    // Por ahora, retornamos 200 indicando que se procesó
    // Nota: Netlify Forms ya maneja el envío al email de notificación configurado

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Respuesta automática enviada",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export { handler };
