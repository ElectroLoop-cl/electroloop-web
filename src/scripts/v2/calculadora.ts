/**
 * ELECTROLOOP v2 — Calculadora de Obligaciones REP.
 * Lógica DS N°22 de 2025 (Año 1 = 2028). Port fiel del cálculo original:
 * meta general (Pilas+AIT+Otros), meta específica AIT, meta específica PFV,
 * costos referenciales USD/ton, microempresa, gating de productor.
 */
import gsap from 'gsap';

/* ---------- Datos del decreto ---------- */
const FIRST_YEAR = 2028;
const META_GEN = [3, 5, 8, 12, 16, 20, 24, 30, 37, 45];
const META_AIT_ESP = [0, 0, 6, 9, 13, 17, 21, 25, 30, 30];
const META_PFV = [0, 0, 10, 14, 18, 22, 28, 34, 42, 50];
// Sin estimación de costos: no hay fuente documentada para tarifas USD/t.
// El costo real se cotiza caso a caso (volumen, tipo y condición del material).

const CAT_NOMBRE: Record<string, string> = {
  ait: 'AIT — Intercambio de Temperatura',
  pfv: 'PFV — Paneles Fotovoltaicos',
  otros: 'Otros AEE',
  pilas: 'Pilas y Baterías',
};
const CAT_CODE: Record<string, string> = { ait: 'AIT', pfv: 'PFV', otros: 'AEE', pilas: 'PIL' };
const CAT_AYUDA: Record<string, string> = {
  ait: '100 refrigeradores ≈ 5 t · 50 equipos AC ≈ 1,5 t',
  pfv: '100 paneles (~20 kg c/u) ≈ 2 t',
  otros: '100 laptops ≈ 0,25 t · 100 TV 55″ ≈ 0,8 t · 100 PC ≈ 0,5 t',
  pilas: '10.000 pilas AA ≈ 0,23 t · 1.000 pilas 9V ≈ 0,045 t',
};

/* ---------- Estado ---------- */
let cats: string[] = [];
let vols: Record<string, number> = {};
let paso = 1;

/* ---------- Utilidades ---------- */
const $ = (id: string) => document.getElementById(id);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fmt2 = (n: number) =>
  n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Acepta es-CL: "1.250,5" → 1250.5 · "1,5" → 1.5 · "1.5" → 1.5 */
function parseVol(raw: string): number {
  const s = raw.trim();
  if (!s) return 0;
  const norm = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const v = parseFloat(norm);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

/* ---------- Navegación ---------- */
function irA(n: number) {
  paso = n;
  document.querySelectorAll<HTMLElement>('.calc-step').forEach((s) => {
    const active = Number(s.dataset.step) === n;
    s.hidden = !active;
    if (active && !reduced) {
      gsap.fromTo(s, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' });
    }
  });

  // Riel de pasos
  document.querySelectorAll<HTMLElement>('.calc-rail .rstep').forEach((r) => {
    const i = Number(r.dataset.rstep);
    r.classList.toggle('active', i === n);
    r.classList.toggle('done', i < n);
    if (i === n) r.setAttribute('aria-current', 'step');
    else r.removeAttribute('aria-current');
  });

  const live = $('calc-step-live');
  if (live) live.textContent = `Paso ${n} de 4`;

  // Foco al título del paso y scroll al marco
  const frame = $('calc-frame');
  const head = document.querySelector<HTMLElement>(`.calc-step[data-step="${n}"] .step-title`);
  if (frame) {
    const w = window as Window & { __lenisV2?: { scrollTo: (t: number, o?: object) => void } };
    const top = window.scrollY + frame.getBoundingClientRect().top - 90;
    if (w.__lenisV2) w.__lenisV2.scrollTo(top, { duration: 0.8 });
    else frame.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  head?.focus({ preventScroll: true });
}

function setError(id: string, on: boolean) {
  const el = $(id);
  if (el) el.hidden = !on;
}

/* ---------- Riel: ficha resumen viva ---------- */
function updateFicha() {
  const fc = $('ficha-cats');
  const fb = $('ficha-base');
  if (fc) fc.textContent = cats.length ? cats.map((c) => CAT_CODE[c]).join(' + ') : '—';
  const total = Object.values(vols).reduce((s, v) => s + v, 0);
  if (fb) fb.textContent = total > 0 ? fmt2(total) + ' t' : '—';
}

/* ---------- Paso 1: gating ---------- */
function initPaso1() {
  const conds = ['calc-c1', 'calc-c2', 'calc-c3'].map((id) => $(id) as HTMLInputElement | null);

  const refresh = () => {
    const alguna = conds.some((c) => c?.checked);
    const micro = document.querySelector<HTMLInputElement>('input[name="calc-micro"]:checked');
    setErrorVisibility('calc-note-noprod', !alguna);
    setErrorVisibility('calc-note-micro', micro?.value === 'yes');
  };
  const setErrorVisibility = (id: string, on: boolean) => {
    const el = $(id);
    if (el) el.hidden = !on;
  };

  conds.forEach((c) => c?.addEventListener('change', refresh));
  document
    .querySelectorAll('input[name="calc-micro"]')
    .forEach((r) => r.addEventListener('change', refresh));

  $('calc-next-1')?.addEventListener('click', () => irA(2));
}

/* ---------- Paso 2: categorías ---------- */
function initPaso2() {
  $('calc-back-2')?.addEventListener('click', () => irA(1));
  $('calc-next-2')?.addEventListener('click', () => {
    cats = [...document.querySelectorAll<HTMLInputElement>('.calc-cat:checked')].map(
      (c) => c.value
    );
    if (!cats.length) { setError('calc-err-cat', true); return; }
    setError('calc-err-cat', false);
    buildVolInputs();
    updateFicha();
    irA(3);
  });
}

/* ---------- Paso 3: volúmenes ---------- */
function buildVolInputs() {
  const cont = $('calc-vols');
  if (!cont) return;
  cont.innerHTML = cats
    .map(
      (cat) => `
    <div class="vol-row">
      <label class="vol-label" for="calc-vol-${cat}">
        <span class="v2-mono v2-mono--copper">[ ${CAT_CODE[cat]} ]</span>
        <span class="vol-name">${CAT_NOMBRE[cat]}</span>
      </label>
      <div class="vol-field">
        <input type="text" inputmode="decimal" id="calc-vol-${cat}" class="vol-input"
               placeholder="0,00" autocomplete="off"
               aria-describedby="calc-help-${cat}" />
        <span class="vol-unit v2-mono v2-mono--steel">TON / AÑO</span>
      </div>
      <p class="vol-help v2-mono v2-mono--steel" id="calc-help-${cat}">[ ${CAT_AYUDA[cat]} ]</p>
    </div>`
    )
    .join('');

  // Enter avanza
  cont.querySelectorAll<HTMLInputElement>('.vol-input').forEach((inp) => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); $('calc-next-3')?.click(); }
    });
  });
}

function initPaso3() {
  $('calc-back-3')?.addEventListener('click', () => irA(2));
  $('calc-next-3')?.addEventListener('click', () => {
    vols = {};
    let alguno = false;
    cats.forEach((cat) => {
      const inp = $(`calc-vol-${cat}`) as HTMLInputElement | null;
      const v = parseVol(inp?.value ?? '');
      vols[cat] = v;
      if (v > 0) alguno = true;
    });
    if (!alguno) { setError('calc-err-vol', true); return; }
    setError('calc-err-vol', false);
    buildResultados();
    updateFicha();
    irA(4);
  });
}

/* ---------- Paso 4: reporte ---------- */
function buildResultados() {
  buildTablas();
  const stamp = $('calc-stamp');
  if (stamp) {
    const d = new Date();
    stamp.textContent = `[ EMITIDO ${d.toLocaleDateString('es-CL')} — REFERENCIAL ]`;
  }
}

function buildTablas() {
  const cont = $('calc-results');
  if (!cont) return;
  cont.innerHTML = '';

  const hasPFV = cats.includes('pfv');
  const hasAIT = cats.includes('ait');
  const catsGral = cats.filter((c) => c !== 'pfv');
  const tonGral = catsGral.reduce((s, c) => s + (vols[c] || 0), 0);
  const tonAIT = vols['ait'] || 0;
  const tonPFV = vols['pfv'] || 0;

  if (catsGral.length && tonGral > 0) {
    let rows = '';
    for (let y = 1; y <= 10; y++) {
      const mg = META_GEN[y - 1];
      const ma = hasAIT ? META_AIT_ESP[y - 1] : 0;
      rows += `
        <tr class="${y === 1 ? 'row-first' : ''}">
          <td class="c-num">${y >= 10 ? '10+' : String(y).padStart(2, '0')}</td>
          <td class="c-cal">${FIRST_YEAR + y - 1}${y >= 10 ? '+' : ''}</td>
          <td><b class="acc">${mg}%</b></td>
          <td class="c-num"><b>${fmt2((tonGral * mg) / 100)}</b> t</td>
          ${hasAIT ? `
          <td>${ma > 0 ? `<b class="acc">${ma}%</b>` : '<span class="dim">—</span>'}</td>
          <td class="c-num">${ma > 0 ? `<b>${fmt2((tonAIT * ma) / 100)}</b> t` : '<span class="dim">—</span>'}</td>` : ''}
        </tr>`;
    }
    cont.insertAdjacentHTML(
      'beforeend',
      `<div class="res-block">
        <p class="res-tag v2-mono v2-mono--copper">[ META GENERAL${hasAIT ? ' + META ESPECÍFICA AIT' : ''} ]</p>
        <p class="res-base">${catsGral.map((c) => CAT_NOMBRE[c]).join(' + ')} —
          base <b>${fmt2(tonGral)} t/año</b>${hasAIT && tonAIT > 0 ? ` · AIT: <b>${fmt2(tonAIT)} t</b>` : ''}</p>
        <div class="res-scroll">
          <table class="res-table">
            <thead><tr>
              <th>AÑO</th><th>CAL.</th><th>META GEN.</th><th>A VALORIZAR</th>
              ${hasAIT ? '<th>META AIT</th><th>MÍN. AIT</th>' : ''}
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`
    );
  }

  if (hasPFV && tonPFV > 0) {
    let rows = '';
    for (let y = 1; y <= 10; y++) {
      const mp = META_PFV[y - 1];
      rows += `
        <tr class="${y === 3 ? 'row-first' : mp === 0 ? 'row-dim' : ''}">
          <td class="c-num">${y >= 10 ? '10+' : String(y).padStart(2, '0')}</td>
          <td class="c-cal">${FIRST_YEAR + y - 1}${y >= 10 ? '+' : ''}</td>
          <td>${mp > 0 ? `<b class="acc">${mp}%</b>` : '<span class="dim">SIN META</span>'}</td>
          <td class="c-num">${mp > 0 ? `<b>${fmt2((tonPFV * mp) / 100)}</b> t` : '<span class="dim">—</span>'}</td>
        </tr>`;
    }
    cont.insertAdjacentHTML(
      'beforeend',
      `<div class="res-block">
        <p class="res-tag v2-mono v2-mono--copper">[ META ESPECÍFICA PFV ]</p>
        <p class="res-base">${CAT_NOMBRE['pfv']} — base <b>${fmt2(tonPFV)} t/año</b>
          · sin meta general: solo meta específica</p>
        <div class="res-scroll">
          <table class="res-table">
            <thead><tr><th>AÑO</th><th>CAL.</th><th>META PFV</th><th>A VALORIZAR</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`
    );
  }
}

/* ---------- Reinicio ---------- */
function initRestart() {
  $('calc-restart')?.addEventListener('click', () => {
    ['calc-c1', 'calc-c2', 'calc-c3'].forEach((id) => {
      const el = $(id) as HTMLInputElement | null;
      if (el) el.checked = false;
    });
    const no = document.querySelector<HTMLInputElement>('input[name="calc-micro"][value="no"]');
    if (no) no.checked = true;
    document.querySelectorAll<HTMLInputElement>('.calc-cat').forEach((c) => (c.checked = false));
    const n1 = $('calc-note-noprod'); if (n1) n1.hidden = true;
    const n2 = $('calc-note-micro'); if (n2) n2.hidden = true;
    cats = [];
    vols = {};
    updateFicha();
    irA(1);
  });
}

/* ---------- Init ---------- */
initPaso1();
initPaso2();
initPaso3();
initRestart();
updateFicha();
