# CTAs reformulados por audiencia

**Principio:** los CTAs hablan distinto a cada audiencia. La calculadora REP (cuando se construya) será el ancla universal de captación, pero hasta entonces, segmentamos.

---

## CTAs por audiencia

### Para Sistemas de Gestión REP (SIG)

**CTA primario:**
[Agendar reunión técnica]

**CTA secundario:**
[Descargar ficha técnica de capacidades]

**Contexto de uso:**
- Hero (versión SIG cuando bifurquemos audiencias en v2)
- Sección "Por qué Electroloop" — tarjeta de "Modelo integrador"
- Footer
- En respuestas de Claudio cuando detecte rol SIG

**Lo que recibe el lead:** ficha técnica PDF con capacidades de planta, ubicación, partners, autorizaciones, cobertura, cronograma operativo.

---

### Para generadores grandes (mineras, hospitales, retail, oficinas, data centers, universidades)

**CTA primario:**
[Pre-registro como cliente ancla]

**CTA secundario:**
[Solicitar diagnóstico REP gratuito]

**Contexto de uso:**
- Hero principal (default)
- Banner intermedio
- Cierre de sección Servicios
- Sección Estado de Electroloop
- Footer

**Lo que recibe el lead:**
- Pre-registro: confirmación de cupo + ficha de beneficios cliente ancla + agendamiento de reunión comercial
- Diagnóstico REP: cuestionario inicial (5 minutos) + reporte personalizado con sus obligaciones REP estimadas + propuesta de servicio

---

### Para productores de productos prioritarios (importadores / fabricantes)

**CTA primario (Fase 1):**
[Conversemos sobre tu cumplimiento REP]

**CTA primario (Fase 2 — cuando lance calculadora):**
[Calcular mi situación REP]

**CTA secundario:**
[Conversemos sobre tu cumplimiento REP]

**Contexto de uso:**
- Sección "Servicios" — Servicio 03 (Gestión REP)
- Sección "Estado de Electroloop" — bloque "Servicios disponibles desde ya"
- Páginas de recursos (guías de Ley REP)
- Hero secundario en página `/calculadora-rep` (Fase 2)

---

### CTA suave universal — captura de email

**CTA:**
[Suscribirme a actualizaciones]

**Contexto:**
- Footer
- Final de páginas de recursos (blog, guías)
- Banner discreto en home (después de la sección Estado)

**Texto que acompaña:**
"Recibe actualizaciones del cronograma operativo, cambios regulatorios REP relevantes y disponibilidad de cupos de cliente ancla. Sin spam, sin compromiso."

**Por qué importa este CTA:**
En B2B regulado pre-operativo, muchos visitantes calificados no están listos para comprometerse pero quieren seguir el progreso. Capturar su email es lead-gen de alto valor que la competencia ignora.

---

### CTA principal Fase 2 — Calculadora REP (lanzamiento upgrade visible)

Este CTA reemplaza al de "Suscribirme a actualizaciones" en posiciones primarias cuando lance la calculadora (2-3 semanas después del lanzamiento del sitio honesto).

**CTA principal:**
[Calcular mi situación REP en 3 minutos]

**Contexto de uso:**
- Hero del home (puede agregarse como tercer CTA o reemplazar uno secundario)
- Banner intermedio destacado
- Cierre de sección "Estado de Electroloop"
- Sidebar persistente o sticky en mobile (opcional)
- Página dedicada `/calculadora-rep` con landing propia

**Texto de soporte:**
"Identifica tu rol en el ecosistema REP-RAEE, conoce tus obligaciones legales y obtén un reporte personalizado. La primera calculadora REP multi-rol de Chile, validada por equipo legal especializado."

**Por qué este CTA es el más fuerte de v1.1 una vez lanzado:**
- Promesa concreta y de bajo compromiso (3 minutos, gratis, personalizado)
- Captura leads de altísima calidad (ya saben qué necesitan al terminar)
- Diferencia de competidores (ningún otro gestor en Chile lo ofrece)
- Educa al mercado y construye autoridad de marca
- Funciona para las 3 audiencias clave (SIG, productores, generadores)

---

## CTAs que se eliminan del sitio actual

| CTA actual | Por qué se elimina | Reemplazo |
|---|---|---|
| "Agenda tu retiro ahora" | Promete servicio que aún no se puede cumplir | "Pre-registro como cliente ancla" |
| "Cotizar" (genérico) | Demasiado genérico, sin segmentación | CTAs por tipo de organización en formulario |
| "Agenda tu primera recolección y recibe tu certificado dentro de 5 días hábiles" | SLA específico no garantizable pre-operación | "Pre-registro · Inicio operativo julio 2026" |

---

## Estructura del flujo de captación

```
Visitante en home
    ↓
¿Identifica su tipo de organización? (Hero CTAs + sección "Para quién")
    ↓
Click en CTA correspondiente
    ↓
Formulario contextual (campos pre-poblados según CTA)
    ↓
Lead entra a HubSpot con propiedad personalizada de tipo de organización
    ↓
Auto-respuesta personalizada por audiencia
    ↓
Seguimiento del equipo según prioridad
```

### Auto-respuestas por tipo de lead

**Lead SIG:**
"Gracias por tu interés. Te contactaremos en menos de 24 horas hábiles para coordinar reunión técnica. Adjuntamos ficha técnica preliminar de Electroloop. — Equipo Electroloop"

**Lead generador (cliente ancla):**
"Recibimos tu pre-registro. Te contactaremos en menos de 48 horas con confirmación de cupo y propuesta de beneficios. Cupos limitados, evaluamos en orden de llegada y fit técnico. — Equipo Electroloop"

**Lead generador (diagnóstico REP):**
"Gracias por solicitar tu diagnóstico REP gratuito. En las próximas 48 horas hábiles recibirás un cuestionario breve (5 minutos) y luego tu reporte personalizado. — Equipo Electroloop"

**Lead productor REP:**
"Gracias por contactarnos. La gestión REP es uno de nuestros servicios disponibles desde ya. Te contactaremos en menos de 24 horas hábiles para entender tu situación y proponerte el flujo más eficiente. — Equipo Electroloop"

**Lead newsletter:**
"Confirma tu suscripción haciendo click en el correo que te enviamos. Recibirás actualizaciones mensuales sobre Electroloop y novedades del ecosistema REP-RAEE en Chile."

---

## Métricas de captación a trackear (PostHog + HubSpot)

**Eventos clave:**
- `cta_pre_registro_cliente_ancla_click`
- `cta_diagnostico_rep_click`
- `cta_reunion_tecnica_sig_click`
- `cta_gestion_rep_click`
- `cta_newsletter_click`
- `form_submit` (con propiedad: tipo_organizacion, tipo_consulta)
- `seccion_estado_visita` (scroll-based event)

**Funnels a monitorear:**
1. Home → CTA → Form submit por tipo de organización
2. Sección Estado de Electroloop → CTA pre-registro
3. Servicio Gestión REP → CTA diagnóstico
4. Tasa de captura de newsletter por fuente de tráfico

**Métricas semanales:**
- Total de leads por tipo de organización
- Conversión visitante → lead por sección
- Quality score de leads (basado en empresa, vertical, volumen estimado)
