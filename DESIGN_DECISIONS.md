# ELECTROLOOP — DIRECCIÓN DE DISEÑO (FASE 1)

**Fecha:** 2026-05-14  
**Estado:** ETAPA 1 — Dirección de Diseño (PROPUESTA)  
**Responsable:** Senior Product Designer (Haiku 4.5)

---

## 🎯 CONCEPTO RECTOR

**"Industrial preciso con calidez editorial"**

Electroloop es **especialista exclusivo** en RAEE. No gestor genérico. Eso se refleja en:
- **Precisión:** Sistema limpio, sin ruido visual, donde cada elemento tiene razón de ser (industrial, técnico).
- **Calidez:** Tipografía con cuerpo, espacios respirados, movimiento orgánico — no frío/corporativo.
- **Escala editorial:** Momentos de tensión visual (grandes escalas tipográficas, asimetría intencional) intercalados con respiro.

**Referentes mentales:** Locomotive.ca (editorial + técnica), Rauno.me (tipografía como arquitectura), Instrument.com (sin decoración innecesaria).

---

## 📝 SISTEMA TIPOGRÁFICO

### Display: **Poppins → Swapped to [TBD]**

**Decisión:** Reemplazar Poppins por una fuente con más **personalidad técnica + calidez**.

**Opciones a validar:**
1. **Grotesk (Display) + Inter (Body)** — Limpio, moderno, industrial. Menos "Figma default".
2. **Clash Grotesk + Inter** — Mayor contraste, calidez en cursivas, moderno.
3. **Eurostile Extended + Inter** — Retro-industrial, muy diferenciador (riesgo: demasiado particular).

**Recomendación inicial:** Grotesk para máxima claridad + distancia de "plantilla SaaS".

### Body: **Inter** ✅
Mantener. Legible, profesional, sin opinión fuerte. Correcto para body.

### Mono: **Jetbrains Mono** (si se necesita)
Para código/datos/REPCalculator. No obligatorio hoy, pero reservado.

---

## 🎨 SISTEMA DE COLOR SEMÁNTICO

**Paleta base (mantener según restricción):**
- `deep-blue (#0B1B32)` — Dominante
- `copper (#B97333)` — Acento
- `steel (#8E9297)` — Secundario/muted
- `ceramic (#F4F4F4)` — Light surfaces

### Roles semánticos (NEW — documentar en Tailwind):

```css
/* Primary surfaces */
--color-bg-primary: #0B1B32 (deep-blue)      /* Hero, footer, dark sections */
--color-bg-secondary: #F4F4F4 (ceramic)      /* Light sections, cards on light */
--color-bg-tertiary: #060D1A (footer-dark)   /* Footer only */

/* Text hierarchy */
--color-text-primary: #FFFFFF (white on dark) | #0B1B32 (deep-blue on light)
--color-text-secondary: rgba(255, 255, 255, 0.8) on dark | #8E9297 on light
--color-text-muted: #8E9297 (steel)

/* Interactive */
--color-accent-primary: #B97333 (copper)
--color-accent-secondary: #D4894A (copper-light) /* hover states */

/* Proportions (60/30/10 rule) */
-- 60%: deep-blue (dominante)
-- 30%: ceramic + white space (respiro)
-- 10%: copper (acentos, CTAs, gestos interactivos)
```

### Cambios específicos:

1. **ValueProps.astro:** Migrar de `slate-900/amber-500` → `deep-blue/ceramic` + copper accents.
2. **Eliminar gradientes decorativos:** Ningún `via-slate-800`, ningún `from-amber-500/20`. Solo gradientes con propósito (ej: gradient copper para textos especiales).
3. **Documentar en `tailwind.config.cjs`:** Agregar CSS variables con roles semánticos.

---

## 📐 ESPACIADO Y ESCALA

### Base: **8px system**

```
xs:  0.25rem (4px)   — Gaps, micro-spacing
sm:  0.5rem  (8px)   — Component internal spacing
md:  1rem    (16px)  — Card padding, list gaps
lg:  1.5rem  (24px)  — Section internal
xl:  2rem    (32px)  — Major section padding
2xl: 3rem    (48px)  — Hero, featured sections
3xl: 4rem    (64px)  — Full-width respiro
```

### Aplicación (NEW):

1. **Section padding:** `py-2xl` (4rem) en desktop, `py-lg` (1.5rem) en mobile.
2. **Card padding:** `p-md` (1rem) interior, `gap-md` (1rem) en grids.
3. **Whitespace narrativo:** Entre secciones, insertar `py-3xl` (6rem) ocasionalmente para respiro editorial.
4. **Documentar en Tailwind:** Agregar escala completa a `tailwind.config.cjs` con nombres semánticos.

**Veredicto:** Eliminar `py-24`, `py-32` sueltos. Sistema fijo y documentado.

---

## 🎬 LENGUAJE DE MOTION

### Curvas (easing):

1. **Entrada (0.4–0.8s):** `cubic-bezier(0.16, 1, 0.3, 1)` — Suave, no elástico.
2. **Hover (0.2–0.3s):** `cubic-bezier(0.34, 1.56, 0.64, 1)` — Ligeramente juguetón (mantener de ETAPA 3).
3. **Salida (0.3s):** `ease-out` simple.

**NO usar:** Easing genérico `ease-in-out`. Siempre curvas documentadas.

### Duraciones:

- **Scroll-triggered:** 0.6–0.8s (no apresurado).
- **Hover/focus:** 0.2–0.3s.
- **Transiciones de página:** 0.4s.
- **Narrativas largas:** 1.0–1.5s (ej: timeline, hero reveals).

### Coreografía (NEW):

1. **Scroll animations:** Stagger de 100–150ms entre cards/elementos en grids.
2. **Hero:** Fade-up (0.6s) con stagger: título (0s) → claim (0.1s) → subtitle (0.2s) → CTA (0.3s).
3. **Cards:** Fade-up al entrar en viewport (Intersection Observer). Sin re-animate.
4. **Timeline/Process:** Línea animada left-to-right (0.8s) con dots que "pop" secuencialmente.

**Guía:** Cada animación debe tener **propósito narrativo**. Si quitarla no cambia la lectura, no debería estar.

---

## 🎨 MICRO-INTERACCIONES

### Botones (CTA):
- Estado normal: Copper background, white text.
- Hover: Glow suave (box-shadow copper, 0.3s).
- Active/Pressed: Escala mínima (0.98x), shadow reducida.
- Focus: Outline copper (2px), offset 2px.

### Links:
- Underline grow-from-left on hover (0.3s).
- Color copper, sin subrayado por defecto.

### Cards:
- Hover: Elevation leve (`translateY(-4px)`, 0.3s), border copper.
- Sin blur/glassmorphism innecesario.

### Campos de formulario:
- Focus: Border copper, glow suave (box-shadow rgba(copper, 0.15)).
- Placeholder: Steel color, 70% opacity.

---

## 🔍 ACCESIBILIDAD + PERFORMANCE

✅ **Mantener:**
- `prefers-reduced-motion` respetado (transiciones 0.01ms).
- Contraste WCAG AA mínimo (copper sobre dark blue = 5.8:1 ✓).
- Semantic HTML (headings, roles, aria-labels).

⚠️ **Revisar:**
- Motion library (Motion 10+) vs. CSS puro: usar Motion solo para scroll-triggered complejas.
- Bundle size: Motion + GSAP + Lenis = ~30KB. Justificable si animaciones tienen propósito.

---

## 📊 RESUMEN DE CAMBIOS

| Dimensión | Actual | Propuesto | Impacto |
|---|---|---|---|
| **Display font** | Poppins (genérico) | Grotesk (industrial+calidez) | Alto — refleja especialización |
| **Color system** | Ad-hoc (slate/amber mixto) | Semántico (deep-blue/copper/ceramic roles) | Crítico — coherencia |
| **Spacing** | Sin escala fija | 8px system documentado | Medio — consistencia |
| **Motion** | Decorativo (sin coreografía) | Narrativo con stagger + propósito | Medio-alto — believability |
| **Glassmorphism** | Excesivo (hero + cards) | Eliminado (excepto navbar si necesario) | Medio — claridad |

---

## 🎬 REFERENCIAS VISUALES MENTALES

### 1. **Locomotive.ca**
- Editorial + técnica: Tipografía grande, asimetría intencional, respiro blanco.
- Motion: Transiciones suaves, sin exuberancia, narrativa clara.
- Color: Neutral + accent específico (acá: copper).

### 2. **Rauno.me**
- Tipografía como protagonista (grandes escalas, contraste).
- Espaciado generoso (respiro editorial).
- Motion: Cada transición tiene razón (no decorativo).

### 3. **Instrument.com**
- Industrial pero cálido: Fuentes con cuerpo, grises cuidados, blancos generosos.
- Sin decoración innecesaria (sin gradientes, sin glows, sin particles).
- Jerarquía visual clara.

---

## ✅ PRÓXIMOS PASOS (FASE 2)

1. **Validar tipografía:** ¿Grotesk sí/no? (si no, elegir alternativa).
2. **Crear Tailwind config extendido:** CSS variables semánticas, escala de espaciado.
3. **Migrar componentes sección por sección:**
   - Hero → ValueProps → Services → Process → Contact.
4. **Testing visual:** Desktop + mobile + dark mode (si aplica).
5. **Performance check:** Lighthouse 95+, sin jank en scroll.

---

**Estado:** ⏳ Esperando aprobación de concepto + tipografía antes de pasar a FASE 2.

**Aprobado por:** ___ (fecha/firma)
