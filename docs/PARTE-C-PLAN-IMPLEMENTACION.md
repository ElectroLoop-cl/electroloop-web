# PARTE C — Plan detallado de implementación v1.1

**Fase:** Etapas 1-4 (10 días)  
**Branch:** `rewrite/v1.1-honest-claims`  
**Deploys:** Continuos a producción cada 2-3 días

---

## 📍 ETAPA 1 — DÍA 1 (Patch rápido de claims)

**Objetivo:** Cerrar riesgo legal de inmediato. Sin rediseño, solo eliminar lo más peligroso.

**Archivos a modificar:**
- `src/layouts/Layout.astro` — metadata, schema.org
- `src/components/Hero.astro` — H1, claims exclusividad
- `src/i18n/es.json` — traducciones
- `src/i18n/en.json` — traducciones en

### 1.1 Layout.astro — Schema.org fix (CRÍTICO)

**Línea 14-15 (title/description default):**
```
❌ "Gestor RAEE Chile Autorizado · Certificado SMA"
✅ "Gestión RAEE integral con partners certificados · Electroloop"
```

**Línea 38 (keywords):**
```
❌ "gestor autorizado, certificado SMA"
✅ "gestión RAEE, partners certificados, pre-operativo"
```

**Línea 90, 136 (Address):**
```
❌ "Huechuraba, Santiago, Chile"
✅ "La Serena, Coquimbo, Chile"
```

**Línea 109-117 (hasCredential schema):**
```
❌ "Autorización de Operación - SMA"
✅ Quitar o cambiar a "pending" / "en proceso"
```

**Línea 146-152 (openingHoursSpecification):**
```
❌ Mon-Fri 8-18 (empresa pre-operativa)
✅ Quitar o cambiar a "por confirmar"
```

**Línea 170, 203 (Service schema):**
```
❌ "custodia de cadena certificada"
✅ "custodia de cadena documentada (operativo julio 2026)"
```

**Línea 223, 247, 255 (FAQ schema):**
```
❌ "ElectroLoop estoy autorizado para..."
✅ "ElectroLoop estará autorizado para..."
```

### 1.2 Hero.astro — Eliminar exclusividad

**Línea 85 (H1):**
```
❌ "El único gestor en Chile que te muestra cada paso..."
✅ Cambiar a algo neutral (sin "único")
   Opción A: "Gestión integral RAEE con partners certificados"
   Opción B: "Tu partner RAEE en la macrozona norte"
```

**Línea 90 (Copy/claims):**
```
❌ "El único especialista exclusivo en RAEE"
✅ Cambiar a "100% especialista en RAEE"
```

**Línea 120 (CTAs):**
```
❌ "Agenda tu retiro ahora"
✅ "[Solicitar información]" o "[Pre-registro]"
```

### 1.3 i18n/es.json — Cambios de traducciones

**Línea ~10 (quote):**
```
❌ "Cotizar" o claims exclusivos
✅ "[Solicitar diagnóstico]" o "[Más información]"
```

**Línea ~15-25 (Hero copy):**
```
Reemplazar con copy neutral (sin "único", sin "certificado")
```

### 1.4 i18n/en.json

Mirror de es.json

### 1.5 QA Patch Day 1

- [ ] Buscar en TODO el código: "único", "certificado por SEREMI", "flota propia", "24 horas", "5 días"
- [ ] Ninguno debe quedar
- [ ] Probar hero en mobile + desktop
- [ ] Verificar que Google Search Console no marca nuevos errores
- [ ] Deploy a main

**Commit:**
```
git commit -m "fix: patch claims rápido (Etapa 1)

- Eliminar claims de exclusividad y certificaciones
- Actualizar schema.org (dirección, autoridades, horarios)
- Cambiar CTAs de 'agenda retiro' a opciones genéricas
- Cerrar riesgo legal de inmediato"
```

**Deploy:** Same day a producción

---

## 📍 ETAPA 2 — DÍAS 2-4 (Reescritura copy completa)

**Objetivo:** Reescribir todas las secciones con nuevo copy honesto.

### 2.1 Sección HERO (renovada) — Día 2

**Archivo:** `src/components/Hero.astro`

**Cambios:**
- H1: "La gestión RAEE que la macrozona norte va a necesitar"
- Subline: Nuevo según 02-copy-completo-sitio.md
- Agregar **bandera de fase:** "Inicio operativo Q3 2026 · Pre-registro de clientes ancla abierto"
- CTAs: "[Pre-registrarme como cliente ancla]" "[Ver cómo funciona]"
- NOTA: Logo SVG en hero se animará en Etapa 3 (ahora solo cambiar copy)

**Tiempo:** 30 min  
**Commit:** "feat(hero): nuevo posicionamiento (Etapa 2.1)"

### 2.2 Sección POR QUÉ ELECTROLOOP (4 tarjetas) — Día 2

**Archivo:** `src/components/ValueProps.astro`

**Tarjeta 1 → "100% enfocados en RAEE"**
```
Tag: "Solo especialistas"
H3: "100% enfocados en RAEE"
Copy: "No somos una división de otra empresa..."
```

**Tarjeta 2 → "Red de partners certificados"**
```
Tag: "Modelo integrador"
H3: "Red de partners certificados"
Copy: "Trabajamos con gestores certificados..."
```

**Tarjeta 3 → "Socio REP, no solo proveedor"**
```
Tag: "Cumplimiento de extremo a extremo"
H3: "Socio REP, no solo proveedor"
Copy: "Gestionamos tu obligación REP..."
```

**Tarjeta 4 → "Trazabilidad documentada"**
```
Tag: "Auditable en todo momento"
H3: "Trazabilidad documentada"
Copy: "Cada RAEE recibido se ingresa..." (SIN "tiempo real")
```

**Tiempo:** 45 min  
**Commit:** "feat(valueprops): 4 tarjetas con nuevo copy (Etapa 2.2)"

### 2.3 🆕 NUEVA SECCIÓN: STATUS (Electroloop) — Día 3

**Crear:** `src/components/Status.astro` (~250 líneas)

**Estructura:**
```
H2: "Estado de Electroloop"
Subline: "Construimos en abierto. Aquí está el estado actual y el roadmap."

Bloque 1: "Inicio operativo Q3 2026"
Bloque 2: "Lo que hacemos en planta propia" (5 items)
Bloque 3: "Lo que coordinamos con nuestra red" (3 items)
Bloque 4: "Cómo crecemos" (Timeline 2026-2028)
Bloque 5: "Cumplimiento regulatorio" (Tabla: obtenidas/en trámite/planificadas)
Bloque 6: "Dónde operamos" (III y IV Región + expansión)
```

**Integración en index.astro:**
- Insertar `<Status />` entre `<ValueProps />` y `<Services />`

**Tiempo:** 1.5-2 horas  
**Commit:** "feat(status): nueva sección Estado de Electroloop (Etapa 2.3)"

### 2.4 Sección PROCESO (6 pasos) — Día 3

**Archivo:** `src/components/ChainOfCustody.astro` (o Process.astro)

**Reescribir los 6 pasos según 02-copy-completo-sitio.md:**
- Paso 01: Retiro (sin "24 horas")
- Paso 02: Recepción y pesaje
- Paso 03: Destrucción de datos (VÍA PARTNER)
- Paso 04: Desmantelamiento (actualizar autoridades)
- Paso 05: Valorización
- Paso 06: Certificado

**CTA final:**
```
❌ "Agenda tu primera recolección y recibe tu certificado dentro de 5 días"
✅ "[Pre-registrarme]"
```

**Tiempo:** 1-1.5 horas  
**Commit:** "refactor(process): reescribir sin SLAs (Etapa 2.4)"

### 2.5 Sección SERVICIOS (3 servicios) — Día 3-4

**Archivo:** `src/components/Services.astro`

**Servicio 1: Recolección + coordinación de destrucción**
```
H3: "Recolección, logística y coordinación de destrucción de datos"
Copy: Según 02-copy-completo-sitio.md
Features: "Acta inmediata · Cert. por dispositivo · Coordinación integral"
CTA: "[Pre-registro de cliente ancla]"
```

**Servicio 2: Tratamiento y valorización**
```
H3: "Tratamiento, clasificación y valorización"
Copy: Según spec
CTA: "[Más información]"
```

**Servicio 3: Gestión REP (🆕 Badge "Disponible desde ya")**
```
🆕 Badge: "Disponible desde ya"
H3: "Gestión REP y reportería"
Copy: "Administramos tu obligación REP de extremo a extremo..."
CTA: "[Solicitar diagnóstico REP gratuito]"
```

**Tiempo:** 45 min  
**Commit:** "feat(services): reescribir + badge Disponible desde ya (Etapa 2.5)"

### 2.6 Sección CONTACTO (Formulario) — Día 4

**Archivo:** `src/components/Contact.astro`

**CAMBIO CRÍTICO:** Simplificar a categorías KISS

**Nuevo campo: "Tipo de organización"**
```html
<select>
  <option>Productor (importador/fabricante)</option>
  <option>Generador final (minería, salud, municipal, retail, data center, etc.)</option>
  <option>Otro / No estoy seguro</option>
</select>
```

**Expandir: "Tipo de consulta"**
```html
<select>
  <option>Pre-registro como cliente ancla</option>
  <option>Diagnóstico REP gratuito</option>
  <option>Información general</option>
  <option>Otro</option>
</select>
```

**Backend:** Netlify Form → Email a Cris (sin HubSpot)

**Tiempo:** 1 hora  
**Commit:** "refactor(contact): formulario KISS simplificado (Etapa 2.6)"

### 2.7 FOOTER — Día 4

**Archivo:** `src/components/Footer.astro`

**Cambios:**
- Tagline: "Gestión RAEE integral con red de partners certificados. Recursos infinitos. Economía circular para Chile."
- Dirección: "La Serena, Región de Coquimbo, Chile"
- Línea legal: "Operaciones desde Q3 2026 · Cumplimiento Ley REP (20.920) y normativa aplicable"
- Agregar links: Política privacidad | Términos | Política datos (Ley 21.719)

**Tiempo:** 30 min  
**Commit:** "refactor(footer): actualizar dirección y legal (Etapa 2.7)"

### 2.8 i18n (es.json, en.json) — Día 4

**Cambios transversales:**
- Hero copy (10 líneas)
- ValueProps (20 líneas)
- Status section (30 líneas)
- Proceso/Servicios/Contacto (40 líneas)
- Footer (10 líneas)
- ~110 líneas totales

**Tiempo:** 30 min  
**Commit:** "i18n: actualizar traducciones para v1.1 (Etapa 2)"

### 2.9 QA Etapa 2

- [ ] Revisar sitio sección por sección en mobile + desktop
- [ ] Verificar que ningún claim falso quedó en alguna esquina
- [ ] Status component: tabla de autorizaciones visible
- [ ] Formulario: nuevo campo y opciones funcionando
- [ ] Footer: dirección y legal correcta
- [ ] Lighthouse score (debe estar ~75-80 antes de Etapa 3)

**Deploy:** Al completar Etapa 2.7-2.8 (días 2-4)

**Mega-commit:** O múltiples commits pequeños (recomendado):
```
git commit -m "feat: Etapa 2 - Reescritura copy completa

- Hero: nuevo posicionamiento
- ValueProps: 4 tarjetas actualizadas
- Status: nueva sección Estado de Electroloop
- Proceso: 6 pasos sin SLAs
- Servicios: reescrito + badge Disponible desde ya
- Contacto: formulario KISS
- Footer: dirección y legal
- i18n: traducciones actualizadas"
```

---

## 📍 ETAPA 3 — DÍAS 5-6 (Estética premium + animaciones)

**Objetivo:** Lighthouse 95+, animaciones sutiles, sistema tipográfico editorial.

### 3.1 Sistema tipográfico (variable fonts)

**Archivos:** `src/layouts/Layout.astro`, Tailwind config

- Importar variable font (Inter, Plex Mono, etc.)
- Ajustar jerarquía: h1 → 3.5xl/bold, h2 → 2xl/bold, h3 → xl/semibold
- Line-height: 1.5 para body, 1.2 para headings

**Tiempo:** 1 hora

### 3.2 Animaciones scroll-triggered (Status)

**Archivo:** `src/components/Status.astro`

- Timeline de internalización: aparece progresivamente conforme scrolleas
- Transiciones suaves 200-300ms
- NO WebGL, solo CSS animations

**Tiempo:** 1 hora

### 3.3 Animación SVG del logo (Hero)

**Archivo:** `src/components/Hero.astro`

- Logo monograma en loop infinito (rotación sutil)
- Refuerza idea de circularidad
- Animación muy discreta (sutileza = premium)

**Tiempo:** 30 min

### 3.4 Reemplazar imágenes Unsplash

**Archivos:** Components que usen `<img>`

- Reemplazar ilustraciones genéricas por SVG conceptuales
- Cobre, negro, líneas minimalistas
- Inspiración: Linear, Stripe, Vercel

**Tiempo:** 1-2 horas

### 3.5 Performance (Lighthouse 95+)

- Optimizar imágenes (WebP, lazy loading)
- Code splitting si aplica
- LCP < 2s
- Verificar en Lighthouse

**Tiempo:** 1-2 horas

### 3.6 QA Etapa 3

- [ ] Lighthouse: 95+ en todas las métricas
- [ ] Mobile: se ve bien, animaciones no stutteran
- [ ] Desktop: jerarquía tipográfica clara
- [ ] Status: timeline aparece elegantemente al scrollear
- [ ] Logo: anima sutilmente (no distrae)

**Deploy:** Al completar (días 5-6)

**Commit:**
```
git commit -m "feat(design): Etapa 3 - Estética premium

- Sistema tipográfico variable fonts
- Animaciones scroll-triggered en Status
- SVG logo loop infinito en Hero
- Ilustraciones SVG conceptuales
- Performance: Lighthouse 95+"
```

---

## 📍 ETAPA 4 — DÍAS 7-10 (Calculadora REP)

**(Especificación detallada en 08-calculadora-rep-spec.md)**

### 4.1 Validación legal (Días 7-8, paralelo)

- [ ] Agendar reunión con abogado REP (1-2 horas)
- [ ] Compilar base de datos: productos prioritarios, plazos RAEE+P, metas
- [ ] Pasar checklist al abogado
- [ ] Recibir validación + ajustes

**Tiempo:** 5-7 días (mayoría es espera)

### 4.2 Setup técnico (Día 7)

**Crear estructura:**
```
/app/calculadora-rep/
  page.tsx
  layout.tsx
  components/
    WizardContainer.tsx
    QuestionRadio.tsx
    QuestionMultiSelect.tsx
    ResultCard.tsx
    DisclaimerBox.tsx
    DownloadActions.tsx
    LeadCaptureForm.tsx
  data/
    productos-prioritarios.json
    plazos-raee.json
    metas-raee.json
  flows/
    flow-productor.ts
    flow-generador.ts
  types/
    calculadora.ts
```

**Rutas API:**
```
/api/calculadora-rep/generate-pdf/
/api/calculadora-rep/send-email/
```

**Tiempo:** 1 día

### 4.3 Frontend Wizard (Días 8-9)

**4 flujos:**

1. **Productor** (importa/fabrica productos prioritarios)
   - Preguntas: productos, volúmenes, plazos
   - Output: obligaciones, metas aplicables, cómo Electroloop ayuda

2. **SIG** (Sistema de Gestión REP)
   - Preguntas: tamaño, cobertura, sectores atendidos
   - Output: ficha técnica de Electroloop como valorizador

3. **Generador final** (minería, hospital, municipio, retail, data center, etc.)
   - Preguntas: sector, volumen estimado
   - Ramificación por vertical (diferente output por sector)
   - Output: si son consumidores industriales, qué obligaciones tienen

4. **No estoy seguro** (flujo educativo)
   - Quiz para identificar rol
   - Deriva al flujo correcto

**Outputs comunes:**
- Disclaimer legal (herramienta referencial, no vinculante)
- PDF descargable
- Opción de envío por email (email simple, sin HubSpot)

**Tiempo:** 5-7 días

### 4.4 Integraciones (Días 9-10)

- [ ] PDF generation (react-pdf)
- [ ] Email transaccional (Resend, SendGrid, o simple Netlify)
- [ ] PostHog: eventos de funnel
- [ ] Lead capture: email simple a Cris

**Tiempo:** 2-3 días

### 4.5 Stress tests (Día 10)

15 escenarios según spec:
- [ ] Calculadora identifica rol correctamente
- [ ] Output es preciso
- [ ] CTA propuesto es correcto
- [ ] PDF se genera
- [ ] Email llega

**Tiempo:** 1-2 días

### 4.6 Claudio (Chatbot) — Día 10

- [ ] Activar Regla 7 en system-prompt
- [ ] Derivar a calculadora cuando aplique
- [ ] Probar con preguntas reales

**Tiempo:** 30 min

### 4.7 QA Etapa 4

- [ ] Mobile + desktop en todos los flujos
- [ ] Accesibilidad (focus, contrast, labels)
- [ ] Performance: no lag en wizard
- [ ] PDF: descarga correcta
- [ ] Email: llega bien
- [ ] Disclaimer: visible en todos los outputs

**Deploy:** Al completar (días 7-10)

**Commit:**
```
git commit -m "feat(calculator): Etapa 4 - Calculadora REP multi-rol

- 4 flujos: Productor | SIG | Generador | No estoy seguro
- Validación legal completada
- PDF descargable
- Email transaccional
- PostHog tracking
- 15 stress tests"
```

---

## 🎯 CHECKLIST FINAL

- [ ] Todas las etapas 1-4 en producción
- [ ] Riesgo legal cerrado (Etapa 1)
- [ ] Copy honesto alineado (Etapa 2)
- [ ] Estética premium (Etapa 3)
- [ ] Calculadora operativa (Etapa 4)
- [ ] Claudio actualizado (Etapa 4)
- [ ] Google Search Console sin errores
- [ ] Lighthouse 95+
- [ ] Mobile responsive en todas las secciones
- [ ] Formulario contacto funcionando
- [ ] Calculadora con 15 scenarios validados

---

**Este plan es la hoja de ruta para implementación. Actualizar con cada commit.**
