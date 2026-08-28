// Expone solo agregados (promedios, conteo) del Google Sheet de respuestas —
// nunca comentarios de texto libre ni el nombre del cliente. Consumido por
// el widget público de calificaciones en la home (ConfianzaV2.astro).

// Mismo Web App que submit-satisfaccion.mjs, vía su ruta doGet.
const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwb9XlnCByuiY71fsH577rw3R-YLmwJ213yh-7oYm1UJAmBcNUhGAZ7JUKKHdbLFwBU/exec';

const MIN_RESPONSES = 5;

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  if (!SHEETS_WEBHOOK_URL) {
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  try {
    const res = await fetch(SHEETS_WEBHOOK_URL, { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error(`Apps Script respondió ${res.status}`);

    const data = await res.json();
    const count = Number(data.count) || 0;

    const body = count >= MIN_RESPONSES
      ? {
          count,
          avgNps: data.avgNps,
          avgEjecucion: data.avgEjecucion,
          avgTrazabilidad: data.avgTrazabilidad,
          promoterPct: data.promoterPct,
        }
      : { count };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('Error obteniendo resumen de satisfacción:', err);
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
};
