/**
 * Guía de retiro digital — utilidades compartidas por /g/retiro y /g/estado.
 *
 * GUIAS_URL es la aplicación web de Apps Script de la planilla
 * "ElectroLoop — Guías de retiro" (apps-script/guias-retiro.gs). No es un
 * secreto: cada lectura y escritura exige el token de la operación.
 */
// Planilla "ElectroLoop — Guías de retiro" (unidad compartida Electroloop V2 → Plataforma Operaciones).
const URL_PRODUCCION =
  'https://script.google.com/macros/s/AKfycbz9hZVPCzPmEf2DS57PnCpabhLhLNQXa9Q1g9hYPhyaQcLcZsnqDL6ikWzcTkkqAQIVgA/exec';
// PUBLIC_GUIAS_URL permite apuntar a un simulador local al probar.
export const GUIAS_URL: string = import.meta.env.PUBLIC_GUIAS_URL || URL_PRODUCCION;

export const EMPRESA = {
  razon_social: 'Electroloop SpA',
  rut: '78.501.218-6',
  email: 'contacto@electroloop.cl',
  web: 'electroloop.cl',
};

export function parametros() {
  const p = new URLSearchParams(window.location.search);
  return { folio: (p.get('folio') || '').trim(), k: (p.get('k') || '').trim() };
}

export async function consultar(accion: string, folio: string, k: string) {
  if (!GUIAS_URL) throw new Error('El sistema de guías aún no está conectado.');
  const url = `${GUIAS_URL}?accion=${accion}&folio=${encodeURIComponent(folio)}&k=${encodeURIComponent(k)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error de conexión (${res.status})`);
  return res.json();
}

export async function enviarHito(payload: unknown) {
  if (!GUIAS_URL) throw new Error('El sistema de guías aún no está conectado.');
  // text/plain evita el preflight CORS que Apps Script no responde.
  const res = await fetch(GUIAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error de conexión (${res.status})`);
  return res.json();
}

export function limpiarRut(r: string) {
  return String(r || '').replace(/[^0-9kK]/g, '').toUpperCase();
}

export function rutValido(r: string) {
  const s = limpiarRut(r);
  if (s.length < 2) return false;
  const cuerpo = s.slice(0, -1);
  const dv = s.slice(-1);
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const res = 11 - (suma % 11);
  const esperado = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === esperado;
}

export function formatoRut(r: string) {
  const s = limpiarRut(r);
  if (s.length < 2) return r;
  return s.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + s.slice(-1);
}

/** Reduce la foto a máx. 1600 px y JPEG ~0,72 (de 4-6 MB a ~300 KB). */
export async function comprimirFoto(archivo: File, maxLado = 1600, calidad = 0.72): Promise<string> {
  const url = URL.createObjectURL(archivo);
  try {
    const img = await new Promise<HTMLImageElement>((ok, mal) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => mal(new Error('No se pudo leer la foto'));
      i.src = url;
    });
    const escala = Math.min(1, maxLado / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * escala);
    canvas.height = Math.round(img.naturalHeight * escala);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', calidad);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Ubicación opcional: si el usuario no la autoriza o tarda, se sigue sin ella. */
export function ubicacion(timeoutMs = 7000): Promise<{ lat: number; lng: number; precision_m: number } | null> {
  return new Promise((ok) => {
    if (!('geolocation' in navigator)) return ok(null);
    const t = setTimeout(() => ok(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        clearTimeout(t);
        ok({ lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6), precision_m: Math.round(p.coords.accuracy) });
      },
      () => { clearTimeout(t); ok(null); },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60000 },
    );
  });
}

export function esc(s: unknown) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
