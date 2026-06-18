/**
 * ELECTROLOOP v2 — Hero WebGL.
 * ~8.000 partículas de cobre instanciadas que ciclan entre dos estados:
 * nube caótica (residuo) → toroide ordenado (el loop, recurso).
 * Carga diferida post-reveal. Fallback: el hero funciona sin canvas.
 */
import * as THREE from 'three';
import gsap from 'gsap';

const VERT = /* glsl */ `
  attribute vec3 aChaos;
  attribute vec3 aOrder;
  attribute float aSeed;
  attribute float aSize;
  uniform float uProgress;
  uniform float uTime;
  uniform float uPR;
  varying float vSeed;
  varying float vMix;

  void main() {
    // Stagger por partícula: las de seed bajo se ordenan primero
    float lp = clamp(uProgress * 1.45 - aSeed * 0.45, 0.0, 1.0);
    lp = lp * lp * (3.0 - 2.0 * lp);
    vec3 pos = mix(aChaos, aOrder, lp);

    // Deriva orgánica leve, siempre activa
    pos.x += sin(uTime * 0.55 + aSeed * 6.2831) * 0.035;
    pos.y += cos(uTime * 0.48 + aSeed * 9.4247) * 0.035;
    pos.z += sin(uTime * 0.62 + aSeed * 4.71) * 0.03;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPR * (3.4 / -mv.z);
    vSeed = aSeed;
    vMix = lp;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying float vSeed;
  varying float vMix;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.1, d);

    // Paleta: steel apagado (caos) → cobre vivo (orden)
    vec3 copper = vec3(0.722, 0.451, 0.200);   // #B87333
    vec3 copperL = vec3(0.816, 0.541, 0.282);  // #D08A48
    vec3 steel = vec3(0.557, 0.573, 0.592);    // #8E9297

    vec3 metal = mix(copper, copperL, vSeed);
    vec3 col = mix(steel * 0.55, metal, 0.3 + 0.7 * vMix);

    gl_FragColor = vec4(col, alpha * (0.4 + 0.6 * vMix));
  }
`;

export interface HeroScene {
  destroy: () => void;
}

export function initHeroParticles(canvas: HTMLCanvasElement): HeroScene | null {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
  } catch {
    return null; // sin WebGL: el hero vive sin escena
  }

  const container = canvas.parentElement ?? document.body;
  const pr = Math.min(window.devicePixelRatio, 1.75);
  renderer.setPixelRatio(pr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 30);
  camera.position.z = 5.2;

  // Densidad según capacidad del dispositivo
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const COUNT = isMobile || cores < 4 ? 3200 : 8000;

  const chaos = new Float32Array(COUNT * 3);
  const order = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  const sizes = new Float32Array(COUNT);

  const R = 1.55; // radio mayor del toroide
  const r = 0.52; // radio menor

  for (let i = 0; i < COUNT; i++) {
    // Caos: esfera difusa de "residuos"
    const dir = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    const rad = Math.cbrt(Math.random()) * 3.1;
    chaos[i * 3] = dir.x * rad;
    chaos[i * 3 + 1] = dir.y * rad;
    chaos[i * 3 + 2] = dir.z * rad;

    // Orden: toroide — el loop de la marca
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const rr = r * (0.75 + Math.random() * 0.5);
    order[i * 3] = (R + rr * Math.cos(v)) * Math.cos(u);
    order[i * 3 + 1] = (R + rr * Math.cos(v)) * Math.sin(u);
    order[i * 3 + 2] = rr * Math.sin(v);

    seeds[i] = Math.random();
    sizes[i] = 1.6 + Math.random() * 2.6;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(chaos, 3)); // requerido por three
  geo.setAttribute('aChaos', new THREE.BufferAttribute(chaos, 3));
  geo.setAttribute('aOrder', new THREE.BufferAttribute(order, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uProgress: { value: reduced ? 1 : 0 },
      uTime: { value: 0 },
      uPR: { value: pr },
    },
  });

  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  group.rotation.set(-0.55, 0, 0.18); // toroide inclinado, gesto editorial
  scene.add(group);

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Parallax sutil al mouse
  const mouse = { x: 0, y: 0 };
  function onMouse(e: MouseEvent) {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  if (!reduced) window.addEventListener('mousemove', onMouse, { passive: true });

  // Ciclo residuo → recurso → residuo (12 s aprox)
  let cycle: gsap.core.Timeline | null = null;
  if (!reduced) {
    cycle = gsap.timeline({ repeat: -1, repeatDelay: 0 });
    cycle
      .to(mat.uniforms.uProgress, { value: 1, duration: 4.2, ease: 'power2.inOut' })
      .to({}, { duration: 3.2 }) // sostiene el loop ordenado
      .to(mat.uniforms.uProgress, { value: 0, duration: 3.6, ease: 'power2.inOut' })
      .to({}, { duration: 1.4 });
  }

  // Render loop — pausado fuera de viewport y con pestaña oculta
  let visible = true;
  let running = true;
  const t0 = performance.now();

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(container);

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;

    mat.uniforms.uTime.value = (performance.now() - t0) / 1000;
    group.rotation.z += 0.0006;
    group.rotation.x += (mouse.y * 0.12 - 0.55 - group.rotation.x) * 0.04;
    group.rotation.y += (mouse.x * 0.18 - group.rotation.y) * 0.04;
    renderer.render(scene, camera);
  }

  if (reduced) {
    // Un solo frame estático: el loop ya ordenado
    mat.uniforms.uTime.value = 1;
    renderer.render(scene, camera);
  } else {
    frame();
  }

  return {
    destroy() {
      running = false;
      cycle?.kill();
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
