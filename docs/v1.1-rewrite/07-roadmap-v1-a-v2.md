# Roadmap del sitio Electroloop — v1.1 → v2 → v3 (SOTY 2027)

**Principio rector:** la base v1.1 está construida para **evolucionar sin reescribir**. Cada versión agrega capacidades, no las reemplaza.

---

## v1.1 — Mayo-Junio 2026 (esta reescritura, dos fases)

### Fase 1 — Sitio honesto (1-2 días)

**Estado:** sitio honesto pre-operativo, listo para captación de leads.

**Cambios:**
- Auditoría completa de claims problemáticos
- Reescritura de copy con modelo integrador
- Sección nueva "Estado de Electroloop" con roadmap honesto
- CTAs reformulados por audiencia
- Bandera de inicio operativo julio 2026
- Activación del servicio de Gestión REP como ancla pre-operativo

**Stack técnico:** Next.js + Tailwind + sistema visual cobre/negro + Claudio integrado.

### Fase 2 — Calculadora REP multi-rol (3-4 semanas, 2-3 semanas después de Fase 1)

**Estado:** diferencial comercial fuerte lanzado como upgrade visible.

**Cambios:**
- Página `/calculadora-rep` con wizard de 4 flujos (productor, SIG, generador, no seguro)
- Base de datos curada de productos prioritarios, plazos, metas (validada legalmente)
- Lógica de scoring de leads (caliente/tibio/frío)
- Generación de PDF + envío por email del reporte
- Integración con HubSpot (propiedades personalizadas)
- Tracking de funnel con PostHog
- Activación de Regla 7 en Claudio para derivar a la calculadora
- Comunicación pública del lanzamiento (LinkedIn, email, prensa especializada)

**Stack técnico v1.1 Fase 2:** Next.js (App Router) + estado del wizard (useState/useReducer) + Zod para validaciones + react-pdf + Resend/SendGrid + lógica de negocio en TypeScript.

### Objetivos v1.1 globales

- Captar pre-registros de clientes ancla calificados
- Captar leads SIG para reuniones técnicas
- Activar servicio de Gestión REP como ingreso pre-operativo
- Construir base de credibilidad regulatoria
- Posicionarse como autoridad técnica del ecosistema REP-RAEE
- Capturar emails para newsletter de progreso

### Métricas de éxito v1.1 (3 meses combinados)

**Fase 1:**
- 20-30 pre-registros de clientes ancla calificados
- 3-5 reuniones técnicas con SIG
- 5-10 contratos de Gestión REP cerrados
- 200+ suscriptores newsletter
- Conversión visitante → lead > 3%

**Fase 2 (mes 1 post-lanzamiento):**
- 200+ wizards iniciados
- 50%+ tasa de finalización
- 30+ leads calificados (caliente + tibio)
- 3+ menciones en prensa especializada
- 1+ SIG en conversación técnica avanzada

---

## v2 — Julio-Agosto 2026 (cuando arranque la planta)

**Trigger:** primer día operativo de la planta La Serena.

**Objetivos:**
- Convertir leads pre-registrados en clientes activos
- Mostrar capacidad operacional real
- Diferenciar comercialmente con datos verificables
- Construir casos de éxito documentados

### Adiciones a la sección Estado de Electroloop

- [ ] Cambiar "Inicio operativo: julio 2026" por "Operando desde julio 2026"
- [ ] Agregar contadores reales: días operando, kg procesados, clientes activos
- [ ] Mover autorizaciones obtenidas a primera posición
- [ ] Mostrar primera generación de clientes ancla activos (logos con consentimiento)

### Nueva sección — Operaciones

- [ ] Página `/operaciones` con datos operacionales actuales
- [ ] Métricas mensuales: toneladas procesadas, % recuperación por categoría, partners activos
- [ ] Galería visual de la planta (fotos reales, no Unsplash)
- [ ] Esto reemplaza las imágenes genéricas de Unsplash en sección Servicios

### Nueva sección — Casos

- [ ] Página `/casos` con 2-3 casos documentados de clientes
- [ ] Formato: contexto del cliente / desafío REP / solución Electroloop / resultados medibles
- [ ] Casos de mineras y municipalidades como ancla

### Mejoras a la calculadora REP

- [ ] Actualizar base de datos con datos operacionales (capacidad de planta, partners activos)
- [ ] Mejorar output con casos reales de clientes que pasaron por situaciones similares
- [ ] Agregar opción de "agendar visita a planta" como CTA en outputs relevantes

### Servicios actualizados

- [ ] Servicio 01 cambia de "coordinación de destrucción de datos" a propuesta híbrida según se internalicen capacidades
- [ ] Agregar capacidades de planta operativa real

### Claudio v2

- [ ] Actualizar system-prompt con datos operacionales reales
- [ ] Agregar capacidad de consultar métricas en vivo (vía API a sistema interno de planta)
- [ ] Habilitar agendamiento de retiro (ahora real)

### Stack técnico nuevo en v2

- Mantener Next.js + Tailwind base
- Agregar API REST simple para datos de planta (puede ser Supabase o similar)
- Agregar componentes de visualización de datos (Recharts o similar)
- NO agregar Three.js / WebGL todavía — eso va en v3

**Tiempo estimado de implementación v2:** 3-4 semanas tras inicio operativo.

---

## v3 — Q4 2026 / Q1 2027 (preparación SOTY 2027)

**Trigger:** 4-6 meses operando con base estable de clientes y datos consistentes.

**Objetivos:**
- Posicionar Electroloop como referente premium del sector
- Aplicar a Awwwards / CSSDA con sitio premiable
- Diferenciar internacionalmente para inversores
- Capturar prensa especializada

### El "Ciclo en vivo" — diferencial SOTY

Aquí finalmente aplica la idea original de visualización 3D del flujo material en tiempo real:

- [ ] Visualización 3D del flujo material en tiempo real (Three.js + React Three Fiber)
- [ ] Conexión a API de planta con datos reales
- [ ] Animación de partículas representando flujos de masa por categoría
- [ ] Capa de profundidad: macro → proceso → material → sistema (Chile)
- [ ] Fallback completo sin WebGL para accesibilidad AAA

### Copiloto IA contextual

- [ ] Claudio embebido como copiloto navegacional avanzado
- [ ] Reorganización de contenido según rol detectado
- [ ] Rutas personalizadas según comportamiento del usuario
- [ ] Modo conversacional persistente
- [ ] Integración con calculadora REP para personalización dinámica

### Mapa de Chile con flujos REP

- [ ] Visualización data-driven del estado nacional REP-RAEE
- [ ] Toneladas generadas vs gestionadas por región
- [ ] Posicionamiento de Electroloop en el mapa de capacidad
- [ ] Datos públicos del MMA + datos propios

### Tipografía cinética

- [ ] Variable fonts con animación responsive a scroll y datos
- [ ] Uso editorial-cinematográfico tipo Climate TRACE

### Internacionalización completa

- [ ] EN totalmente implementado (estructura ya estará lista de v1.1)
- [ ] Posibilidad de PT-BR si hay expansión a Brasil planificada

### Stack técnico nuevo en v3

- Three.js + React Three Fiber + Drei
- GSAP avanzado + ScrollTrigger
- Lenis smooth scroll
- WebGL shaders custom
- Anthropic SDK para copiloto agéntico
- Edge functions para personalización runtime

**Tiempo estimado de implementación v3:** 8-12 semanas con dev senior + dirección creativa.

**Aplicación a SOTY:** Awwwards, CSSDA, Webby — abrir sumisiones cuando v3 esté en producción y haya 30+ días de tracking de UX.

---

## Lo que se mantiene a través de las 3 versiones

- Logo, paleta cobre/negro
- Estructura modular del sitio
- Claudio como copiloto
- Concepto narrativo "loop visible"
- Tono honesto y técnico
- Bilingüe ES/EN

## Lo que cambia entre versiones

| Aspecto | v1.1 Fase 1 | v1.1 Fase 2 | v2 | v3 |
|---|---|---|---|---|
| Estado de la empresa | Pre-operativo | Pre-operativo | Operando | Operando consolidado |
| Datos en el sitio | Estáticos | Estáticos + reportes generados | Mensuales actualizados | Tiempo real |
| Visualización | Diagramas SVG | + Wizard interactivo | + Charts | + 3D WebGL |
| IA | Claudio chat reactivo | Claudio + derivación a calculadora | Claudio + métricas planta | Copiloto agéntico contextual |
| Casos de éxito | No aplica | No aplica | 2-3 documentados | Galería completa |
| Calculadora REP | Pendiente | Disponible | Mejorada con datos reales | Personalizada con IA |
| Foco principal | Captación honesta | Captación + autoridad técnica | Conversión + autoridad operativa | Premium + internacionalización |
| Awwwards | No aplica | No aplica | Preparación | Aplicación |

---

## Riesgos y mitigaciones por versión

### v1.1 Fase 1
- **Riesgo:** sitio honesto pre-operativo no convierte tan bien como prometería un sitio aspiracional.
- **Mitigación:** la honestidad estratégica + pre-registro con beneficios reales convierte mejor en B2B regulado que claims grandilocuentes.

### v1.1 Fase 2
- **Riesgo:** calculadora con base de datos imprecisa genera mal asesoramiento y daña reputación.
- **Mitigación:** validación legal obligatoria con abogado REP antes de publicar. Disclaimer legal visible en cada output. Stress tests con 15 escenarios.

### v2
- **Riesgo:** datos operacionales reales son menos impresionantes de lo esperado en primeros meses.
- **Mitigación:** comunicar tendencias de crecimiento mes-a-mes, no solo valores absolutos. Mostrar trayectoria.

### v3
- **Riesgo:** WebGL pesado y arquitectura compleja afecta performance y accesibilidad.
- **Mitigación:** fallback sin WebGL obligatorio desde diseño, performance budget estricto (LCP < 2.5s, 60fps), accessibility audits semanales.

---

## Checkpoint de revisión del roadmap

Cada 3 meses, revisar:

- [ ] ¿Las métricas de cada versión se cumplieron?
- [ ] ¿El feedback de clientes y SIG sugiere ajustes?
- [ ] ¿El cronograma operativo de la planta sigue calzando con el roadmap del sitio?
- [ ] ¿Los partners certificados siguen alineados o hay que revisar acuerdos?
- [ ] ¿El equipo tiene capacidad para construir la siguiente versión o hay que sumar dev/agencia?
- [ ] ¿La calculadora REP necesita actualización por cambios regulatorios?
