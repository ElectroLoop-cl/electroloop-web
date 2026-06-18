/**
 * ELECTROLOOP v2 — Chrome global del documento blueprint.
 * Lenis + GSAP, preloader, cursor custom, botones magnéticos,
 * índice de sección en la espina, menú overlay.
 */
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

declare global {
  interface Window {
    __v2Revealed?: boolean;
    __lenisV2?: Lenis;
  }
}

/* ---------- Smooth scroll ---------- */
function initLenis() {
  if (reduced) return;
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenisV2 = lenis;
}

/* ---------- Preloader: contador 000→100 + loop que se traza ---------- */
function reveal() {
  window.__v2Revealed = true;
  document.dispatchEvent(new CustomEvent('v2:reveal'));
}

function initPreloader() {
  const pre = document.getElementById('v2-preloader');
  if (!pre) { reveal(); return; }

  const seen = sessionStorage.getItem('el-v2-preloaded');
  if (seen || reduced) {
    pre.remove();
    reveal();
    return;
  }

  const countEl = pre.querySelector<HTMLElement>('.v2-preloader-count b');
  const circle = pre.querySelector<SVGCircleElement>('circle');
  const node = pre.querySelector<SVGRectElement>('rect');

  const state = { n: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      sessionStorage.setItem('el-v2-preloaded', '1');
      gsap.to(pre, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.7,
        ease: 'expo.inOut',
        onStart: reveal,
        onComplete: () => pre.remove(),
      });
    },
  });

  tl.to(state, {
    n: 100,
    duration: 1.0,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (countEl) countEl.textContent = String(Math.round(state.n)).padStart(3, '0');
    },
  }, 0);

  if (circle) tl.to(circle, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0);
  if (node) tl.to(node, { opacity: 1, duration: 0.2, ease: 'power1.out' }, 0.95);
  tl.to({}, { duration: 0.15 }); // respiro antes del barrido

  // Skip con click
  pre.addEventListener('click', () => tl.progress(1), { once: true });
}

/* ---------- Cursor: punto + anillo con etiqueta contextual ---------- */
function initCursor() {
  if (!finePointer || reduced) return;
  const dot = document.querySelector<HTMLElement>('.v2-cursor-dot');
  const ring = document.querySelector<HTMLElement>('.v2-cursor-ring');
  const label = document.querySelector<HTMLElement>('.v2-cursor-label');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
  }, { passive: true });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    const half = ring.offsetWidth / 2;
    ring.style.transform = `translate(${rx - half}px, ${ry - half}px)`;
  });

  // Delegación: cualquier elemento interactivo activa el anillo
  document.addEventListener('mouseover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
    if (!t) return;
    ring.classList.add('is-active');
    if (label) label.textContent = t.dataset.cursor ?? '';
  });
  document.addEventListener('mouseout', (e) => {
    const t = (e.target as HTMLElement).closest('a, button, [data-cursor]');
    if (t) ring.classList.remove('is-active');
  });
}

/* ---------- Botones magnéticos ---------- */
function initMagnetic() {
  if (!finePointer || reduced) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.32;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ---------- Índice de sección en la espina ---------- */
function initSpineIndex() {
  const num = document.querySelector<HTMLElement>('.v2-spine-index .idx-num');
  const lab = document.querySelector<HTMLElement>('.v2-spine-index .idx-label');
  if (!num) return;

  document.querySelectorAll<HTMLElement>('[data-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        num.textContent = sec.dataset.index ?? '—';
        if (lab) lab.textContent = sec.dataset.section ?? '';
      },
    });
  });
}

/* ---------- Topbar adaptativo: tinta invertida sobre secciones claras ---------- */
function initTopbarInk() {
  const topbar = document.querySelector<HTMLElement>('.v2-topbar');
  if (!topbar) return;

  // Fondo del topbar al scrollear (evita colisión con contenido denso)
  const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  let activeLight = 0; // contador: soporta secciones claras contiguas
  document.querySelectorAll<HTMLElement>('.v2-light').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 40px',  // cuando la sección alcanza la altura del topbar
      end: 'bottom 40px',
      onToggle: (self) => {
        activeLight += self.isActive ? 1 : -1;
        topbar.classList.toggle('on-light', activeLight > 0);
      },
    });
  });
}

/* ---------- Menú overlay ---------- */
function initMenu() {
  const btn = document.getElementById('v2-menu-btn');
  const menu = document.getElementById('v2-menu');
  const close = document.getElementById('v2-menu-close');
  if (!btn || !menu) return;

  const setOpen = (open: boolean) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) (menu.querySelector('a') as HTMLElement)?.focus();
  };

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  close?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  );
}

/* ---------- Líneas que se dibujan al entrar al viewport ---------- */
function initDrawlines() {
  if (reduced) return;
  document.querySelectorAll<HTMLElement>('.v2-drawline').forEach((line) => {
    gsap.to(line, {
      scaleX: 1,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: line, start: 'top 88%' },
    });
  });
}

initLenis();
initPreloader();
initCursor();
initMagnetic();
initSpineIndex();
initTopbarInk();
initMenu();
initDrawlines();
