import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function generatePDFBuffer(data) {
  const doc = new PDFDocument({
    margin: 50,
    bufferPages: true,
  });

  const chunks = [];
  doc.on('data', chunk => chunks.push(chunk));

  // Header
  doc.fontSize(24).font('Helvetica-Bold').text('ElectroLoop', { align: 'left' });
  doc.fontSize(10).font('Helvetica').text('Reporte de Cálculo REP', { align: 'left', moveDown: 0.5 });
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Title
  const titles = {
    '1': 'Generador RAEE',
    '2': 'Productor',
    '3': 'Gestor RAEE',
    '4': 'Consultoría Personalizada',
  };

  const flow = data['current-flow'] || '1';
  doc.fontSize(18).font('Helvetica-Bold').text(titles[flow] || 'Cálculo REP', { moveDown: 1 });

  // Recipient info
  doc.fontSize(11).font('Helvetica-Bold').text('Datos del Solicitante', { moveDown: 0.5 });
  doc.fontSize(10).font('Helvetica');
  doc.text(`Nombre: ${data['calc-name']}`);
  doc.text(`Email: ${data['calc-email']}`);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`);
  doc.moveDown();

  // Result summary
  doc.fontSize(12).font('Helvetica-Bold').text('Resultado del Cálculo', { moveDown: 0.5 });
  doc.fontSize(10).font('Helvetica');

  if (flow === '1') {
    const pc = parseFloat(data['flow1-pc'] || 0);
    const monitor = parseFloat(data['flow1-monitor'] || 0);
    const printer = parseFloat(data['flow1-printer'] || 0);
    const other = parseFloat(data['flow1-other'] || 0);
    const total = (pc * 0.025 + monitor * 0.015 + printer * 0.020 + other * 0.010);

    doc.text(`PCs: ${pc} unidades`);
    doc.text(`Monitores: ${monitor} unidades`);
    doc.text(`Impresoras: ${printer} unidades`);
    doc.text(`Otros: ${other} unidades`);
    doc.moveDown();
    doc.rect(50, doc.y, 500, 40).stroke();
    doc.fontSize(11).font('Helvetica-Bold').text(`Meta anual estimada: ${total.toFixed(2)} toneladas`, 55, doc.y + 8, {
      width: 490,
      align: 'center',
    });
  } else if (flow === '2') {
    const volume = parseFloat(data['flow2-volume'] || 0);
    doc.text(`Volumen de ventas: ${volume} unidades`);
    doc.text(`Categoría: ${data['flow2-category']}`);
    doc.moveDown();
    doc.rect(50, doc.y, 500, 40).stroke();
    doc.fontSize(11).font('Helvetica-Bold').text('Meta REP: Contacta para análisis personalizado', 55, doc.y + 8, {
      width: 490,
      align: 'center',
    });
  } else if (flow === '3') {
    const monthly = parseFloat(data['flow3-monthly'] || 0);
    const months = parseFloat(data['flow3-months'] || 12);
    const annual = monthly * months;

    doc.text(`Procesamiento mensual: ${monthly} toneladas`);
    doc.text(`Meses operativos: ${months}`);
    doc.moveDown();
    doc.rect(50, doc.y, 500, 40).stroke();
    doc.fontSize(11).font('Helvetica-Bold').text(`Proyección anual: ${annual.toFixed(2)} toneladas`, 55, doc.y + 8, {
      width: 490,
      align: 'center',
    });
  } else if (flow === '4') {
    doc.text(`Descripción: ${data['flow4-description'] || 'N/A'}`);
    doc.moveDown();
    doc.rect(50, doc.y, 500, 40).stroke();
    doc.fontSize(11).font('Helvetica-Bold').text('Análisis personalizado solicitado', 55, doc.y + 8, {
      width: 490,
      align: 'center',
    });
  }

  doc.moveDown(3);

  // Footer
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.fontSize(9).font('Helvetica').text(
    'Este reporte fue generado por ElectroLoop. Para más información, visita electroloop.cl',
    { align: 'center', color: '#999999', moveDown: 0.5 }
  );

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

export default async (req, context) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(req.body);
    const { 'calc-name': name, 'calc-email': email } = data;

    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and email required' }),
      };
    }

    // Generate PDF
    const pdfBuffer = await generatePDFBuffer(data);

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Tu Reporte de Cálculo REP - ElectroLoop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0B1B32;">Hola ${name},</h2>
          <p style="color: #8E9297; line-height: 1.6;">
            Tu reporte de cálculo REP está adjunto en PDF. En este documento encontrarás:
          </p>
          <ul style="color: #8E9297;">
            <li>Resumen de tus datos ingresados</li>
            <li>Cálculos y proyecciones personalizadas</li>
            <li>Recomendaciones para cumplimiento normativo</li>
          </ul>
          <p style="color: #8E9297; line-height: 1.6;">
            Si tienes preguntas sobre tu reporte, <strong>contacta a ElectroLoop</strong> para una consultoría personalizada.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #8E9297; font-size: 12px;">
              ElectroLoop - Gestor RAEE Integrador<br/>
              <a href="https://electroloop.cl" style="color: #B97333; text-decoration: none;">electroloop.cl</a> |
              <a href="mailto:contacto@electroloop.cl" style="color: #B97333; text-decoration: none;">contacto@electroloop.cl</a>
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `REP-Report-${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Also send to ElectroLoop
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `[CALCULADORA REP] Nuevo reporte generado - ${name}`,
      html: `
        <p><strong>Usuario:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Datos:</strong></p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    };
  } catch (err) {
    console.error('Email Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error sending email', details: err.message }),
    };
  }
};
