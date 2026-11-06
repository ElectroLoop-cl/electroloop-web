/**
 * ElectroLoop — Guía de retiro digital (cadena de custodia RAEE).
 *
 * Reemplaza la guía en papel "Documento de recolección y disposición final
 * de RAEE". Va pegado en el editor de Apps Script de la planilla
 * "ElectroLoop — Guías de retiro" (Extensiones → Apps Script) y se publica
 * como aplicación web (Ejecutar como: Yo · Acceso: Cualquier usuario).
 *
 * Las páginas públicas viven en electroloop.cl/g/retiro y /g/estado y
 * hablan directo con esta aplicación web. Cada operación tiene un token
 * distinto por rol (generador, transportista, planta) y uno de solo
 * lectura para la página de estado: sin el token no se lee ni se escribe.
 *
 * Este archivo es genérico y vive en el repo público de la web. Los datos
 * de clientes y proveedores NO van aquí: se cargan en la pestaña Actores.
 */

const SITIO = 'https://electroloop.cl';
const ZONA = 'America/Santiago';
const EMPRESA = {
  razon_social: 'Electroloop SpA',
  rut: '78.501.218-6',
  email: 'contacto@electroloop.cl',
  web: 'electroloop.cl',
};
// Correo que recibe el aviso de cada hito. Vacío = el dueño del script.
const NOTIFICAR_A = '';
const CARPETA_FOTOS = 'ElectroLoop — Guías de retiro (fotos)';
const MAX_FOTOS = 3;
const ALCANCE_POR_DEFECTO =
  'Este servicio no incluye destrucción de información de discos duros ni destrucción de marca ante notario.';

const ROLES = {
  generador: { hito: 'A', titulo: 'Entrega en origen', foto: 'Camión cargado', prefijo: 'gen' },
  transportista: { hito: 'B', titulo: 'Retiro y transporte', foto: 'Lote listo para cargar', prefijo: 'tra' },
  planta: { hito: 'C', titulo: 'Recepción en destino', foto: 'Lote recibido en planta', prefijo: 'pla' },
};

const COLUMNAS = {
  Operaciones: [
    'folio', 'estado', 'alerta', 'creada', 'fecha_programada', 'hora_programada',
    'gen_razon_social', 'gen_rut', 'gen_sitio', 'gen_direccion', 'gen_comuna', 'gen_contacto', 'gen_fono', 'gen_email',
    'tipo_residuo', 'descripcion', 'cantidad_declarada', 'peso_estimado_kg', 'alcance',
    'tra_razon_social', 'tra_rut',
    'pla_razon_social', 'pla_rut', 'pla_direccion', 'pla_comuna', 'pla_contacto', 'pla_fono', 'pla_horario',
    'A_registrado', 'A_cantidad', 'B_registrado', 'B_cantidad', 'C_registrado', 'C_cantidad', 'C_peso_kg',
    'carpeta_id', 'token_generador', 'token_transportista', 'token_planta', 'token_estado', 'notas',
  ],
  Hitos: [
    'registrado', 'folio', 'hito', 'rol', 'empresa', 'rut_empresa', 'nombre', 'rut_persona', 'cargo', 'patente',
    'cantidad', 'peso_kg', 'observaciones', 'lat', 'lng', 'precision_m', 'fotos_ids', 'fotos_publicas',
    'fotos_tomadas', 'acepta_declaracion', 'navegador',
  ],
  Actores: [
    'tipo', 'alias', 'razon_social', 'rut', 'sitio', 'direccion', 'comuna', 'contacto', 'fono', 'email', 'horario', 'notas',
  ],
};
// Columnas que se guardan como texto plano para que Sheets no las convierta
// en fechas o números (RUT, teléfonos, horas, timestamps dd-mm-aaaa).
const COLUMNAS_TEXTO = [
  'folio', 'creada', 'registrado', 'fecha_programada', 'hora_programada', 'A_registrado', 'B_registrado', 'C_registrado',
  'gen_rut', 'tra_rut', 'pla_rut', 'gen_fono', 'pla_fono', 'rut', 'fono', 'rut_empresa', 'rut_persona', 'patente',
];

// ─────────────────────────── Menú y configuración ───────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ElectroLoop')
    .addItem('Nueva operación…', 'abrirNuevaOperacion')
    .addItem('Ver links de la operación seleccionada', 'verLinksSeleccion')
    .addSeparator()
    .addItem('Configurar planilla (primera vez)', 'configurarPlanilla')
    .addToUi();
}

function configurarPlanilla() {
  Object.keys(COLUMNAS).forEach(hoja);
  carpetaRaiz();
  SpreadsheetApp.getUi().alert(
    'Planilla lista: pestañas Operaciones, Hitos y Actores creadas, y carpeta de fotos en tu Drive.\n\n' +
    'Siguiente paso: carga tus generadores, transportistas y plantas en la pestaña Actores (tipo = generador, transportista o planta).'
  );
}

/**
 * Ejecutar una vez desde el editor (botón Ejecutar) para conceder los
 * permisos que usa la aplicación web: planilla, Drive (fotos) y correo
 * (avisos). Deja la carpeta de fotos ubicada y muestra el resultado en el registro.
 */
function autorizar() {
  Object.keys(COLUMNAS).forEach(hoja);
  const carpeta = carpetaRaiz();
  const correo = Session.getEffectiveUser().getEmail();
  console.log('OK · carpeta de fotos: ' + carpeta.getName() + ' · avisos a: ' + (NOTIFICAR_A || correo) + ' · cupo de correos hoy: ' + MailApp.getRemainingDailyQuota());
}

function hoja(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
  let sh = ss.getSheetByName(nombre);
  if (!sh) sh = ss.insertSheet(nombre);
  if (sh.getLastRow() === 0) {
    const cols = COLUMNAS[nombre];
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground('#0B1B32').setFontColor('#F4F4F4');
    sh.setFrozenRows(1);
    cols.forEach((c, i) => {
      if (COLUMNAS_TEXTO.indexOf(c) >= 0) sh.getRange(2, i + 1, sh.getMaxRows() - 1, 1).setNumberFormat('@');
    });
  }
  if (ss.getId && !PropertiesService.getScriptProperties().getProperty('SHEET_ID')) {
    PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
  }
  return sh;
}

function carpetaRaiz() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('CARPETA_RAIZ');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* se recrea abajo */ }
  }
  // La carpeta de fotos vive junto a la planilla (p. ej. en la unidad compartida).
  let padre = null;
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const padres = DriveApp.getFileById(ss.getId()).getParents();
    if (padres.hasNext()) padre = padres.next();
  } catch (e) { /* sin padre accesible: se usa Mi unidad */ }
  let carpeta = null;
  if (padre) {
    const existentes = padre.getFoldersByName(CARPETA_FOTOS);
    carpeta = existentes.hasNext() ? existentes.next() : padre.createFolder(CARPETA_FOTOS);
  } else {
    carpeta = DriveApp.createFolder(CARPETA_FOTOS);
  }
  props.setProperty('CARPETA_RAIZ', carpeta.getId());
  return carpeta;
}

// ─────────────────────────── Lectura y escritura de tablas ───────────────────────────

function leerTabla(nombre) {
  const sh = hoja(nombre);
  const valores = sh.getDataRange().getValues();
  const encabezados = valores.shift() || [];
  const filas = valores.map((v, i) => {
    const o = { _fila: i + 2 };
    encabezados.forEach((h, j) => { o[h] = v[j]; });
    return o;
  });
  return { sh: sh, encabezados: encabezados, filas: filas };
}

function agregar(nombre, obj) {
  const sh = hoja(nombre);
  const fila = COLUMNAS[nombre].map((c) => (obj[c] === undefined || obj[c] === null ? '' : obj[c]));
  sh.appendRow(fila);
}

function actualizar(tabla, fila, cambios) {
  Object.keys(cambios).forEach((c) => {
    const j = tabla.encabezados.indexOf(c);
    if (j >= 0) tabla.sh.getRange(fila._fila, j + 1).setValue(cambios[c]);
    fila[c] = cambios[c];
  });
}

function buscarOperacion(folio) {
  const tabla = leerTabla('Operaciones');
  const f = String(folio || '').trim().toUpperCase();
  const fila = tabla.filas.find((o) => String(o.folio).trim().toUpperCase() === f);
  return { tabla: tabla, op: fila || null };
}

// ─────────────────────────── Utilidades ───────────────────────────

function ahora() {
  return Utilities.formatDate(new Date(), ZONA, 'dd-MM-yyyy HH:mm');
}

function fecha(v) {
  if (v instanceof Date) return Utilities.formatDate(v, ZONA, 'dd-MM-yyyy');
  const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? m[3] + '-' + m[2] + '-' + m[1] : String(v || '');
}

function hora(v) {
  if (v instanceof Date) return Utilities.formatDate(v, ZONA, 'HH:mm');
  return String(v || '');
}

function token() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 24);
}

function limpiarRut(r) {
  return String(r || '').replace(/[^0-9kK]/g, '').toUpperCase();
}

function rutValido(r) {
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

function formatoRut(r) {
  const s = limpiarRut(r);
  if (s.length < 2) return String(r || '');
  const cuerpo = s.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return cuerpo + '-' + s.slice(-1);
}

function numero(v) {
  if (v === '' || v === null || v === undefined) return null;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  let s = String(v).trim();
  // "1.250,5" (es-CL) → 1250.5 ; "12.5" o "12,5" → 12.5
  if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
  const n = Number(s);
  return isFinite(n) ? n : null;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function rolDeToken(op, k) {
  if (!op || !k) return null;
  const t = String(k);
  if (t === String(op.token_generador)) return 'generador';
  if (t === String(op.token_transportista)) return 'transportista';
  if (t === String(op.token_planta)) return 'planta';
  if (t === String(op.token_estado)) return 'estado';
  return null;
}

function linksDe(op) {
  const base = function (ruta, k) {
    return SITIO + ruta + '?folio=' + encodeURIComponent(op.folio) + '&k=' + k;
  };
  return {
    generador: base('/g/retiro/', op.token_generador),
    transportista: base('/g/retiro/', op.token_transportista),
    planta: base('/g/retiro/', op.token_planta),
    estado: base('/g/estado/', op.token_estado),
  };
}

// ─────────────────────────── Estado y alertas ───────────────────────────

function evaluar(op) {
  const reg = ['A', 'B', 'C'].filter((h) => op[h + '_registrado']);
  const cant = {};
  reg.forEach((h) => { cant[h] = numero(op[h + '_cantidad']); });
  const alertas = [];

  const valores = Object.keys(cant).map((h) => cant[h]);
  const distintos = valores.filter((v, i, a) => a.indexOf(v) === i);
  if (distintos.length > 1) {
    alertas.push('DIFERENCIA EN LA CADENA: ' + reg.map((h) => ({ A: 'entregados', B: 'cargados', C: 'recibidos' }[h]) + ' ' + cant[h]).join(' · '));
  }
  const declarada = numero(op.cantidad_declarada);
  if (declarada !== null && valores.length && valores.some((v) => v !== declarada)) {
    alertas.push('Distinto a lo declarado (' + declarada + ' equipos)');
  }
  const peso = numero(op.C_peso_kg);
  const estimado = numero(op.peso_estimado_kg);
  if (peso !== null && estimado) {
    const desvio = Math.round(((peso - estimado) / estimado) * 100);
    if (Math.abs(desvio) >= 20) alertas.push('Peso real ' + peso + ' kg vs estimado ' + estimado + ' kg (' + (desvio > 0 ? '+' : '') + desvio + '%)');
  }

  let estado = 'Programada';
  if (reg.length === 3) estado = distintos.length > 1 ? 'Completa con diferencias' : 'Completa';
  else if (reg.length > 0) estado = 'En curso (' + reg.length + '/3)';
  return { estado: estado, alerta: alertas.join(' | ') };
}

// ─────────────────────────── Datos públicos de una operación ───────────────────────────

function publica(op) {
  return {
    folio: op.folio,
    estado: op.estado,
    alerta: op.alerta,
    fecha_programada: fecha(op.fecha_programada),
    hora_programada: hora(op.hora_programada),
    tipo_residuo: op.tipo_residuo,
    descripcion: op.descripcion,
    cantidad_declarada: op.cantidad_declarada,
    peso_estimado_kg: op.peso_estimado_kg,
    alcance: op.alcance || ALCANCE_POR_DEFECTO,
    generador: {
      razon_social: op.gen_razon_social, rut: op.gen_rut, sitio: op.gen_sitio, direccion: op.gen_direccion,
      comuna: op.gen_comuna, contacto: op.gen_contacto, fono: op.gen_fono,
    },
    transportista: { razon_social: op.tra_razon_social, rut: op.tra_rut },
    planta: {
      razon_social: op.pla_razon_social, rut: op.pla_rut, direccion: op.pla_direccion, comuna: op.pla_comuna,
      contacto: op.pla_contacto, fono: op.pla_fono, horario: op.pla_horario,
    },
    empresa: EMPRESA,
  };
}

function hitosDe(folio, conFotos) {
  const tabla = leerTabla('Hitos');
  const porRol = {};
  tabla.filas
    .filter((h) => String(h.folio).toUpperCase() === String(folio).toUpperCase())
    .forEach((h) => { porRol[h.rol] = h; });

  const salida = {};
  Object.keys(ROLES).forEach((rol) => {
    const h = porRol[rol];
    if (!h) return;
    const ids = String(h.fotos_ids || '').split(',').filter(String);
    salida[rol] = {
      registrado: h.registrado instanceof Date ? Utilities.formatDate(h.registrado, ZONA, 'dd-MM-yyyy HH:mm') : String(h.registrado),
      empresa: h.empresa, rut_empresa: h.rut_empresa, nombre: h.nombre, rut_persona: h.rut_persona,
      cargo: h.cargo, patente: h.patente, cantidad: h.cantidad, peso_kg: h.peso_kg, observaciones: h.observaciones,
      ubicacion: h.lat ? { lat: h.lat, lng: h.lng, precision_m: h.precision_m } : null,
      fotos: conFotos ? ids.map((id) => urlFoto(id, String(h.fotos_publicas) === 'true')) : [],
    };
  });
  return salida;
}

function urlFoto(id, publica) {
  if (publica) return 'https://drive.google.com/thumbnail?id=' + id + '&sz=w1600';
  try {
    const blob = DriveApp.getFileById(id).getBlob();
    return 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
  } catch (e) {
    return '';
  }
}

// ─────────────────────────── Aplicación web ───────────────────────────

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.accion === 'ping') return json({ ok: true });

    const r = buscarOperacion(p.folio);
    const op = r.op;
    const rol = rolDeToken(op, p.k);
    if (!op || !rol) return json({ ok: false, error: 'Link no válido o vencido. Pide uno nuevo a ElectroLoop.' });

    if (p.accion === 'op') {
      if (!ROLES[rol]) return json({ ok: false, error: 'Este link es solo de consulta.' });
      const h = hitosDe(op.folio, false)[rol] || null;
      return json({
        ok: true, rol: rol, hito: ROLES[rol].hito, titulo: ROLES[rol].titulo, foto: ROLES[rol].foto,
        operacion: publica(op), registrado: h,
        estado_url: linksDe(op).estado,
      });
    }

    if (p.accion === 'estado') {
      return json({ ok: true, operacion: publica(op), hitos: hitosDe(op.folio, true), roles: ROLES });
    }

    return json({ ok: false, error: 'Acción desconocida' });
  } catch (err) {
    return json({ ok: false, error: 'Error interno: ' + err.message });
  }
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'Solicitud mal formada' });
  }
  if (body.accion !== 'hito') return json({ ok: false, error: 'Acción desconocida' });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    return json(registrarHito(body));
  } catch (err) {
    return json({ ok: false, error: 'No se pudo registrar: ' + err.message });
  } finally {
    try { lock.releaseLock(); } catch (e2) { /* nada */ }
  }
}

function registrarHito(body) {
  const r = buscarOperacion(body.folio);
  const op = r.op;
  const rol = rolDeToken(op, body.k);
  if (!op || !ROLES[rol]) return { ok: false, error: 'Link no válido o vencido. Pide uno nuevo a ElectroLoop.' };

  const def = ROLES[rol];
  if (op[def.hito + '_registrado']) {
    const cuando = op[def.hito + '_registrado'] instanceof Date
      ? Utilities.formatDate(op[def.hito + '_registrado'], ZONA, 'dd-MM-yyyy HH:mm')
      : op[def.hito + '_registrado'];
    return { ok: false, error: 'Este hito ya fue registrado el ' + cuando + '. Si hay que corregir algo, escribe a ' + EMPRESA.email + '.' };
  }

  const d = body.datos || {};
  const errores = [];
  if (!String(d.empresa || '').trim()) errores.push('razón social de la empresa');
  if (!String(d.nombre || '').trim()) errores.push('nombre');
  if (!rutValido(d.rut_persona)) errores.push('RUT de la persona');
  if (rol === 'transportista') {
    if (!rutValido(d.rut_empresa)) errores.push('RUT de la empresa');
    if (!String(d.patente || '').trim()) errores.push('patente');
  }
  const cantidad = numero(d.cantidad);
  if (cantidad === null || cantidad < 0 || Math.floor(cantidad) !== cantidad) errores.push('cantidad de equipos');
  const peso = numero(d.peso_kg);
  if (rol === 'planta' && (peso === null || peso <= 0)) errores.push('peso total en kg');
  if (d.acepta !== true) errores.push('aceptación de la declaración');
  const fotos = (body.fotos || []).slice(0, MAX_FOTOS);
  if (!fotos.length) errores.push('al menos una foto');
  if (errores.length) return { ok: false, error: 'Falta o no es válido: ' + errores.join(', ') + '.' };

  // Fotos a la carpeta de la operación
  let carpeta;
  try { carpeta = DriveApp.getFolderById(op.carpeta_id); } catch (e) {
    carpeta = carpetaRaiz().createFolder(op.folio);
    actualizar(r.tabla, op, { carpeta_id: carpeta.getId() });
  }
  const ids = [];
  let publicas = true;
  fotos.forEach((f, i) => {
    const bytes = Utilities.base64Decode(String(f.base64 || '').replace(/^data:[^,]+,/, ''));
    const nombre = op.folio + '_' + def.hito + '_' + rol + '_' + (i + 1) + '.jpg';
    const archivo = carpeta.createFile(Utilities.newBlob(bytes, f.mime || 'image/jpeg', nombre));
    try { archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { publicas = false; }
    ids.push(archivo.getId());
  });

  const registrado = ahora();
  agregar('Hitos', {
    registrado: registrado, folio: op.folio, hito: def.hito, rol: rol,
    empresa: String(d.empresa).trim(), rut_empresa: d.rut_empresa ? formatoRut(d.rut_empresa) : '',
    nombre: String(d.nombre).trim(), rut_persona: formatoRut(d.rut_persona), cargo: d.cargo || '',
    patente: String(d.patente || '').toUpperCase().trim(), cantidad: cantidad, peso_kg: peso === null ? '' : peso,
    observaciones: d.observaciones || '',
    lat: d.ubicacion ? d.ubicacion.lat : '', lng: d.ubicacion ? d.ubicacion.lng : '', precision_m: d.ubicacion ? d.ubicacion.precision_m : '',
    fotos_ids: ids.join(','), fotos_publicas: publicas, fotos_tomadas: (body.fotos || []).map((f) => f.tomada || '').join(' | '),
    acepta_declaracion: true, navegador: String(body.navegador || '').slice(0, 200),
  });

  const cambios = {};
  cambios[def.hito + '_registrado'] = registrado;
  cambios[def.hito + '_cantidad'] = cantidad;
  if (rol === 'planta') cambios.C_peso_kg = peso;
  if (!op[def.prefijo + '_razon_social']) cambios[def.prefijo + '_razon_social'] = String(d.empresa).trim();
  if (d.rut_empresa && !op[def.prefijo + '_rut']) cambios[def.prefijo + '_rut'] = formatoRut(d.rut_empresa);
  actualizar(r.tabla, op, cambios);
  const ev = evaluar(op);
  actualizar(r.tabla, op, { estado: ev.estado, alerta: ev.alerta });

  notificar(op, def, rol, d, cantidad, peso, ev);
  return { ok: true, registrado: registrado, estado: ev.estado, alerta: ev.alerta, estado_url: linksDe(op).estado };
}

function notificar(op, def, rol, d, cantidad, peso, ev) {
  try {
    const para = NOTIFICAR_A || Session.getEffectiveUser().getEmail();
    if (!para) return;
    const asunto = '[Guía ' + op.folio + '] Hito ' + def.hito + ' — ' + def.titulo + (ev.alerta ? ' · REVISAR' : '');
    const html =
      '<p><b>' + def.titulo + '</b> registrado por ' + d.nombre + ' (' + d.empresa + ').</p>' +
      '<p>Equipos: <b>' + cantidad + '</b>' + (rol === 'planta' ? ' · Peso: <b>' + peso + ' kg</b>' : '') + '</p>' +
      '<p>Estado: <b>' + ev.estado + '</b></p>' +
      (ev.alerta ? '<p style="color:#A23B3B"><b>' + ev.alerta + '</b></p>' : '') +
      '<p><a href="' + linksDe(op).estado + '">Ver la guía completa</a></p>';
    MailApp.sendEmail({ to: para, subject: asunto, htmlBody: html, name: 'ElectroLoop — Guías' });
  } catch (e) {
    console.warn('No se pudo enviar el aviso: ' + e.message);
  }
}

// ─────────────────────────── Nueva operación (diálogo) ───────────────────────────

function listarActores() {
  return leerTabla('Actores').filas
    .filter((a) => a.razon_social)
    .map((a) => {
      const o = {};
      COLUMNAS.Actores.forEach((c) => { o[c] = a[c] instanceof Date ? fecha(a[c]) : String(a[c] || ''); });
      return o;
    });
}

function crearOperacion(d) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    let folio = String(d.folio || '').trim().toUpperCase();
    if (!folio) throw new Error('Falta el folio.');
    if (!/-GD$/.test(folio)) folio += '-GD';
    const faltan = [];
    if (!d.fecha_programada) faltan.push('fecha programada');
    if (!d.gen_razon_social) faltan.push('generador');
    if (!d.gen_direccion) faltan.push('dirección de retiro');
    if (d.cantidad_declarada === '' || d.cantidad_declarada === undefined) faltan.push('cantidad declarada');
    if (!d.pla_razon_social) faltan.push('planta de destino');
    if (faltan.length) throw new Error('Falta: ' + faltan.join(', ') + '.');
    if (buscarOperacion(folio).op) throw new Error('Ya existe una operación con el folio ' + folio + '.');

    const carpeta = carpetaRaiz().createFolder(folio);
    const op = {
      folio: folio, estado: 'Programada', alerta: '', creada: ahora(),
      fecha_programada: d.fecha_programada, hora_programada: d.hora_programada || '',
      gen_razon_social: d.gen_razon_social, gen_rut: d.gen_rut ? formatoRut(d.gen_rut) : '', gen_sitio: d.gen_sitio || '',
      gen_direccion: d.gen_direccion, gen_comuna: d.gen_comuna || '', gen_contacto: d.gen_contacto || '',
      gen_fono: d.gen_fono || '', gen_email: d.gen_email || '',
      tipo_residuo: d.tipo_residuo || 'RAEE no peligroso', descripcion: d.descripcion || '',
      cantidad_declarada: numero(d.cantidad_declarada), peso_estimado_kg: numero(d.peso_estimado_kg) === null ? '' : numero(d.peso_estimado_kg),
      alcance: d.alcance || ALCANCE_POR_DEFECTO,
      tra_razon_social: d.tra_razon_social || '', tra_rut: d.tra_rut ? formatoRut(d.tra_rut) : '',
      pla_razon_social: d.pla_razon_social, pla_rut: d.pla_rut ? formatoRut(d.pla_rut) : '', pla_direccion: d.pla_direccion || '',
      pla_comuna: d.pla_comuna || '', pla_contacto: d.pla_contacto || '', pla_fono: d.pla_fono || '', pla_horario: d.pla_horario || '',
      carpeta_id: carpeta.getId(),
      token_generador: token(), token_transportista: token(), token_planta: token(), token_estado: token(),
      notas: d.notas || '',
    };
    agregar('Operaciones', op);
    return { folio: folio, links: linksDe(op), fecha: fecha(op.fecha_programada), hora: op.hora_programada, generador: op.gen_razon_social, sitio: op.gen_sitio || op.gen_direccion, planta: op.pla_razon_social };
  } finally {
    lock.releaseLock();
  }
}

function abrirNuevaOperacion() {
  const html = HtmlService.createHtmlOutput(HTML_NUEVA_OPERACION).setWidth(620).setHeight(720);
  SpreadsheetApp.getUi().showModalDialog(html, 'Nueva operación de retiro');
}

function verLinksSeleccion() {
  const sh = SpreadsheetApp.getActiveSheet();
  if (sh.getName() !== 'Operaciones' || sh.getActiveRange().getRow() < 2) {
    SpreadsheetApp.getUi().alert('Ve a la pestaña Operaciones y selecciona una celda de la fila de la operación.');
    return;
  }
  const folio = sh.getRange(sh.getActiveRange().getRow(), 1).getValue();
  const op = buscarOperacion(folio).op;
  if (!op) { SpreadsheetApp.getUi().alert('No encontré esa operación.'); return; }
  const datos = { folio: op.folio, links: linksDe(op), fecha: fecha(op.fecha_programada), hora: hora(op.hora_programada), generador: op.gen_razon_social, sitio: op.gen_sitio || op.gen_direccion, planta: op.pla_razon_social };
  const html = HtmlService.createHtmlOutput(HTML_LINKS.replace('__DATOS__', JSON.stringify(datos).replace(/</g, '\\u003c'))).setWidth(620).setHeight(640);
  SpreadsheetApp.getUi().showModalDialog(html, 'Links de ' + op.folio);
}

// Bloque compartido: muestra los 4 links con botón copiar y mensaje sugerido para WhatsApp.
const JS_LINKS = `
function mostrarLinks(r, cont) {
  const roles = [
    ['generador', 'Generador — Hito A (entrega en origen)', 'saca una foto del camión cargado'],
    ['transportista', 'Transportista — Hito B (retiro y transporte)', 'saca una foto del lote listo para cargar'],
    ['planta', 'Planta valorizadora — Hito C (recepción)', 'saca una foto del lote al recibirlo e indica el peso total'],
    ['estado', 'Estado de la guía (solo lectura, para el cliente)', ''],
  ];
  const cuando = r.fecha + (r.hora ? ' a las ' + r.hora : '');
  cont.innerHTML = '<p class="ok">Operación <b>' + r.folio + '</b> · ' + r.generador + ' → ' + r.planta + ' · ' + cuando + '</p>';
  roles.forEach(function (x) {
    const msg = x[0] === 'estado'
      ? 'Hola, este es el link de seguimiento de su retiro ' + r.folio + ' con ElectroLoop. Ahí verá cada hito con fotos y horario: ' + r.links.estado
      : 'Hola, para el retiro ' + r.folio + ' (' + cuando + ', ' + r.sitio + ') le pedimos registrar su parte en este link: ' + x[2] + ', indique la cantidad de equipos y acepte la declaración. Toma 2 minutos: ' + r.links[x[0]];
    const d = document.createElement('div');
    d.className = 'link';
    d.innerHTML = '<b>' + x[1] + '</b><textarea readonly rows="3"></textarea><button>Copiar mensaje</button>';
    d.querySelector('textarea').value = msg;
    d.querySelector('button').onclick = function () {
      const t = d.querySelector('textarea'); t.select(); document.execCommand('copy');
      this.textContent = 'Copiado ✓';
    };
    cont.appendChild(d);
  });
}`;

const CSS_DIALOGO = `
  body{font-family:Arial,sans-serif;font-size:13px;color:#0B1B32;margin:0;padding:4px 8px}
  h3{margin:14px 0 6px;font-size:12px;color:#B87333;text-transform:uppercase;letter-spacing:.04em}
  label{display:block;margin:6px 0 2px;color:#5d6267;font-size:12px}
  input,select,textarea{width:100%;box-sizing:border-box;padding:6px;border:1px solid #c9ccd0;border-radius:4px;font-size:13px}
  .fila{display:flex;gap:8px}.fila>div{flex:1}
  button{background:#B87333;color:#fff;border:0;border-radius:4px;padding:9px 14px;font-weight:bold;cursor:pointer;margin-top:6px}
  .err{color:#A23B3B;font-weight:bold}.ok{background:#F4F4F4;padding:8px;border-left:3px solid #B87333}
  .link{margin:10px 0;padding:8px;border:1px solid #e3e3e3;border-radius:4px}
  .link textarea{margin-top:4px;font-size:12px}
`;

const HTML_NUEVA_OPERACION = `<!DOCTYPE html><html><head><base target="_top"><style>${CSS_DIALOGO}</style></head><body>
<div id="form">
  <div class="fila">
    <div><label>Folio (n° de cotización, ej. EL-2026-0014)</label><input id="folio" placeholder="EL-2026-0000"></div>
    <div><label>Fecha programada</label><input id="fecha_programada" type="date"></div>
    <div><label>Hora</label><input id="hora_programada" type="time"></div>
  </div>

  <h3>Generador</h3>
  <label>Elegir de Actores</label><select id="sel_generador" data-tipo="generador" data-prefijo="gen"></select>
  <div class="fila"><div><label>Razón social</label><input id="gen_razon_social"></div><div><label>RUT</label><input id="gen_rut"></div></div>
  <label>Sitio de retiro (ej. Bodega, Mall X)</label><input id="gen_sitio">
  <div class="fila"><div><label>Dirección</label><input id="gen_direccion"></div><div><label>Comuna</label><input id="gen_comuna"></div></div>
  <div class="fila"><div><label>Contacto</label><input id="gen_contacto"></div><div><label>Teléfono</label><input id="gen_fono"></div><div><label>Email</label><input id="gen_email"></div></div>

  <h3>Residuo</h3>
  <div class="fila">
    <div><label>Tipo</label><input id="tipo_residuo" value="RAEE no peligroso"></div>
    <div><label>Cantidad declarada (equipos)</label><input id="cantidad_declarada" type="number" min="0"></div>
    <div><label>Peso estimado (kg)</label><input id="peso_estimado_kg" type="number" min="0" step="0.1"></div>
  </div>
  <label>Descripción de los equipos</label><input id="descripcion" placeholder="ej. 18 tótems de autoatención fuera de uso">
  <label>Alcance / exclusiones</label><textarea id="alcance" rows="2"></textarea>

  <h3>Transportista (puede quedar en blanco: lo completa el transportista)</h3>
  <label>Elegir de Actores</label><select id="sel_transportista" data-tipo="transportista" data-prefijo="tra"></select>
  <div class="fila"><div><label>Razón social</label><input id="tra_razon_social"></div><div><label>RUT</label><input id="tra_rut"></div></div>

  <h3>Planta valorizadora (destino final)</h3>
  <label>Elegir de Actores</label><select id="sel_planta" data-tipo="planta" data-prefijo="pla"></select>
  <div class="fila"><div><label>Razón social</label><input id="pla_razon_social"></div><div><label>RUT</label><input id="pla_rut"></div></div>
  <div class="fila"><div><label>Dirección</label><input id="pla_direccion"></div><div><label>Comuna</label><input id="pla_comuna"></div></div>
  <div class="fila"><div><label>Contacto</label><input id="pla_contacto"></div><div><label>Teléfono</label><input id="pla_fono"></div><div><label>Horario de recepción</label><input id="pla_horario"></div></div>

  <label>Notas internas (no las ve nadie más)</label><input id="notas">
  <p id="error" class="err"></p>
  <button id="crear">Crear operación y generar links</button>
</div>
<div id="resultado"></div>
<script>
${JS_LINKS}
document.getElementById('alcance').value = ${JSON.stringify(ALCANCE_POR_DEFECTO)};
let actores = [];
const mapa = { razon_social: 'razon_social', rut: 'rut', sitio: 'sitio', direccion: 'direccion', comuna: 'comuna', contacto: 'contacto', fono: 'fono', email: 'email', horario: 'horario' };
google.script.run.withSuccessHandler(function (lista) {
  actores = lista;
  document.querySelectorAll('select[data-tipo]').forEach(function (sel) {
    const propios = lista.filter(function (a) { return a.tipo.toLowerCase() === sel.dataset.tipo; });
    sel.innerHTML = '<option value="">— escribir a mano —</option>' + propios.map(function (a, i) {
      return '<option value="' + lista.indexOf(a) + '">' + (a.alias || a.razon_social) + '</option>';
    }).join('');
    sel.onchange = function () {
      const a = actores[sel.value];
      Object.keys(mapa).forEach(function (k) {
        const el = document.getElementById(sel.dataset.prefijo + '_' + k);
        if (el) el.value = a ? (a[mapa[k]] || '') : '';
      });
    };
  });
}).listarActores();

document.getElementById('crear').onclick = function () {
  const datos = {};
  document.querySelectorAll('#form input, #form textarea').forEach(function (el) { datos[el.id] = el.value.trim(); });
  const b = this; b.disabled = true; b.textContent = 'Creando…';
  document.getElementById('error').textContent = '';
  google.script.run
    .withSuccessHandler(function (r) {
      document.getElementById('form').style.display = 'none';
      mostrarLinks(r, document.getElementById('resultado'));
    })
    .withFailureHandler(function (e) {
      document.getElementById('error').textContent = e.message;
      b.disabled = false; b.textContent = 'Crear operación y generar links';
    })
    .crearOperacion(datos);
};
</script></body></html>`;

const HTML_LINKS = `<!DOCTYPE html><html><head><base target="_top"><style>${CSS_DIALOGO}</style></head><body>
<div id="resultado"></div>
<script>${JS_LINKS}
mostrarLinks(__DATOS__, document.getElementById('resultado'));
</script></body></html>`;
