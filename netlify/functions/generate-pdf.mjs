import PDFDocument from 'pdfkit';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(req.body);
    const { flow, name, email } = data;

    // Create PDF
    const doc = new PDFDocument({
      margin: 50,
      bufferPages: true,
    });

    // Set up response stream
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('ElectroLoop', { align: 'left' });
    doc.fontSize(10).font('Helvetica').text('Reporte de Cálculo REP', { align: 'left', moveDown: 0.5 });
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Title based on flow
    const titles = {
      '1': 'Generador RAEE',
      '2': 'Productor',
      '3': 'Gestor RAEE',
      '4': 'Consultoría Personalizada',
    };

    doc.fontSize(18).font('Helvetica-Bold').text(titles[flow] || 'Cálculo REP', { moveDown: 1 });

    // Recipient info
    doc.fontSize(11).font('Helvetica-Bold').text('Datos del Solicitante', { moveDown: 0.5 });
    doc.fontSize(10).font('Helvetica');
    doc.text(`Nombre: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`);
    doc.moveDown();

    // Content by flow
    const flowData = {
      '1': {
        title: 'Resumen: Generador RAEE',
        items: [
          `PCs: ${data['flow1-pc']} unidades`,
          `Monitores: ${data['flow1-monitor']} unidades`,
          `Impresoras: ${data['flow1-printer']} unidades`,
          `Otros: ${data['flow1-other']} unidades`,
        ],
        result: `Meta anual estimada: ${(parseFloat(data['flow1-pc']) * 0.025 + parseFloat(data['flow1-monitor']) * 0.015 + parseFloat(data['flow1-printer']) * 0.020 + parseFloat(data['flow1-other']) * 0.010).toFixed(2)} toneladas`,
      },
      '2': {
        title: 'Resumen: Productor',
        items: [
          `Volumen de ventas: ${data['flow2-volume']} unidades`,
          `Categoría: ${data['flow2-category']}`,
        ],
        result: `Meta REP: ${(parseFloat(data['flow2-category'] || '1') * 10).toFixed(0)}% de recolección`,
      },
      '3': {
        title: 'Resumen: Gestor RAEE',
        items: [
          `Procesamiento mensual: ${data['flow3-monthly']} toneladas`,
          `Meses operativos: ${data['flow3-months']}`,
        ],
        result: `Proyección anual: ${(parseFloat(data['flow3-monthly']) * parseFloat(data['flow3-months'] || 12)).toFixed(2)} toneladas/año`,
      },
      '4': {
        title: 'Resumen: Consultoría',
        items: [
          `Descripción: ${data['flow4-description'] || 'N/A'}`,
        ],
        result: 'Análisis personalizado solicitado. Te contactaremos pronto.',
      },
    };

    const content = flowData[flow];
    doc.fontSize(12).font('Helvetica-Bold').text(content.title, { moveDown: 0.5 });
    doc.fontSize(10).font('Helvetica');
    content.items.forEach(item => {
      doc.text(`• ${item}`);
    });
    doc.moveDown();

    // Result box
    doc.rect(50, doc.y, 500, 50).stroke();
    doc.fontSize(11).font('Helvetica-Bold').text(content.result, 55, doc.y + 10, {
      width: 490,
      align: 'center',
    });
    doc.moveDown(3);

    // Footer
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.fontSize(9).font('Helvetica').text(
      'Este reporte fue generado por ElectroLoop. Para más información, visita electroloop.cl',
      { align: 'center', color: '#999999', moveDown: 0.5 }
    );

    // Finalize PDF
    doc.end();

    // Return PDF
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="REP-Report-${new Date().toISOString().split('T')[0]}.pdf"`,
          },
          body: pdfBuffer.toString('base64'),
          isBase64Encoded: true,
        });
      });
    });
  } catch (err) {
    console.error('PDF Generation Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generating PDF' }),
    };
  }
};
