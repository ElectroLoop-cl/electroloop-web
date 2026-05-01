# Checklist de implementación — Electroloop sitio v1.1

**Estrategia:** lanzamiento en dos fases.

**Fase 1 — Sitio honesto:** ~10 horas en 1-2 días.
**Fase 2 — Calculadora REP:** ~3-4 semanas con dedicación constante.

---

# FASE 1 — Sitio honesto (lanzamiento inmediato)

**Objetivo:** arreglar los claims problemáticos del sitio cuanto antes para reducir riesgo legal y empezar a captar leads de calidad.

## 1.1 Validación con cofounder (2 horas)

- [ ] Leer 01-resumen-ejecutivo.md con cofounder
- [ ] Discutir y decidir las 7 decisiones pendientes:
  - [ ] ¿Mencionamos partners certificados por nombre? (recomendado: 1-2 si están dispuestos)
  - [ ] Lista honesta de autorizaciones (obtenidas / en trámite / planificadas)
  - [ ] Definición de cliente ancla (cupos, beneficios, compromiso del cliente)
  - [ ] Qué proceso internalizamos primero post-arranque
  - [ ] ¿Activamos el servicio de Gestión REP como ancla comercial inmediato? (recomendado: sí)
  - [ ] Calculadora REP — coordinación legal con abogado (asignar responsable)
  - [ ] Calculadora REP — qué hacer con leads "no afectos" (recomendado: nutrir vía newsletter)
- [ ] Completar las plantillas de tablas en 03-seccion-estado-electroloop.md
- [ ] Aprobar reescritura para implementación

## 1.2 Setup git y branch (15 min)

- [ ] Sincronizar main: `git checkout main && git pull origin main`
- [ ] Crear branch: `git checkout -b rewrite/v1.1-honest-claims`
- [ ] Crear carpeta de docs: `mkdir -p docs/v1.1-rewrite`
- [ ] Copiar los 8 archivos `.md` a `docs/v1.1-rewrite/`
- [ ] Commit inicial: `git add docs/ && git commit -m "docs: planificación reescritura v1.1"`
- [ ] Push: `git push -u origin rewrite/v1.1-honest-claims`

## 1.3 Reescritura del copy del sitio (4-6 horas con Claude Code)

### 1.3.1 Hero (30 min)

- [ ] Decidir entre versión recomendada o alternativa comercial
- [ ] Reemplazar H1, subline y CTAs
- [ ] Agregar bandera de fase de inicio operativo

### 1.3.2 Sección "Por qué Electroloop" (45 min)

- [ ] Reemplazar las 4 tarjetas con copy nuevo
- [ ] Verificar que ningún claim de exclusividad quede en pie

### 1.3.3 Sección "Estado de Electroloop" — NUEVA (1.5 horas)

- [ ] Crear sección visual nueva entre "Por qué Electroloop" y proceso/servicios
- [ ] Implementar los 6 bloques con datos reales completados
- [ ] Aplicar timeline visual para el plan de internalización
- [ ] Tabla de autorizaciones con datos honestos

### 1.3.4 Sección Proceso (6 pasos) (45 min)

- [ ] Reemplazar texto de los 6 pasos
- [ ] Ajustar tags por paso
- [ ] Quitar SLAs específicos no garantizables

### 1.3.5 Sección Servicios (45 min)

- [ ] Reemplazar copy de los 3 servicios
- [ ] Marcar "Disponible desde ya" en Servicio 03 (Gestión REP)
- [ ] Cambiar CTAs según tipo de servicio

### 1.3.6 Sección Cómo Funciona (15 min)

- [ ] Ajustes menores a los 5 pasos

### 1.3.7 Sección Contacto (45 min)

- [ ] Agregar campo "Tipo de organización" al formulario
- [ ] Agregar opciones segmentadas en "Tipo de consulta"
- [ ] Configurar HubSpot con propiedades personalizadas para tipo de organización
- [ ] Configurar auto-respuestas por tipo de lead (5 versiones — ver 04-ctas-por-audiencia.md)

### 1.3.8 Footer (30 min)

- [ ] Actualizar tagline
- [ ] Agregar línea legal completa (RUT, dirección, normativa)
- [ ] Agregar enlace a Política de privacidad / Política de datos personales (Ley 21.719)
- [ ] Verificar que enlaces a recursos siguen funcionando

### 1.3.9 Banners y CTAs intermedios (30 min)

- [ ] Reemplazar "Agenda tu retiro" por "Pre-registro como cliente ancla"
- [ ] Verificar que ningún CTA prometa SLA específico
- [ ] Agregar CTA suave de newsletter en footer

## 1.4 Actualización de Claudio (1-2 horas)

- [ ] Abrir `system-prompt.md` de Claudio en Drive
- [ ] Anexar el bloque completo de 05-ajustes-claudio-system-prompt.md
- [ ] Eliminar o actualizar secciones obsoletas que contradigan los nuevos claims
- [ ] **NO** activar la regla 7 (calculadora REP) todavía. Se activa en Fase 2.
- [ ] Probar Claudio con los 8 stress tests sugeridos
- [ ] Iterar el system-prompt si alguna respuesta no es satisfactoria
- [ ] Validar que Claudio responde coherente con el sitio

## 1.5 Aspectos legales y técnicos (1 hora)

- [ ] Crear o actualizar Política de privacidad
- [ ] Crear Política de datos personales (anticipar Ley 21.719 vigente diciembre 2026)
- [ ] Crear Términos de servicio
- [ ] Verificar que el formulario de contacto tenga consentimiento explícito de tratamiento de datos
- [ ] Configurar PostHog con eventos clave (ver lista en 04-ctas-por-audiencia.md)

## 1.6 Búsquedas obligatorias en código antes de publicar Fase 1

Hacer search-and-replace o verificar que NO existan estas frases en el sitio (ya sea como texto visible o como metadata SEO):

```
"el único especialista"
"el único en Chile"
"certificado por SEREMI"
"destrucción de datos certificada" (como capacidad propia, sin mencionar partner)
"5 días hábiles"
"24 horas" (como SLA)
"tiempo real"
"flota propia certificada"
"agenda tu primera recolección"
"agenda tu retiro"
```

Si alguna aparece, reemplazar por la versión honesta correspondiente.

## 1.7 QA y publicación Fase 1 (1 hora)

- [ ] Revisar sitio en mobile (especialmente sección Estado y formulario)
- [ ] Verificar que no quede ningún claim eliminado en alguna esquina del sitio
- [ ] Ejecutar la búsqueda de la sección 1.6 con Claude Code en TODO el código
- [ ] Probar formulario end-to-end (envío + auto-respuesta + entrada a HubSpot)
- [ ] Probar Claudio en modo cliente real con 3-5 preguntas
- [ ] Revisar que metadata SEO sigue alineada con nuevos claims
- [ ] Revisar preview deploy de Netlify del branch `rewrite/v1.1-honest-claims`
- [ ] Aprobar con cofounder
- [ ] Merge a main: `git checkout main && git merge rewrite/v1.1-honest-claims && git push origin main`
- [ ] Verificar que Netlify desplegó correctamente a producción
- [ ] Anunciar internamente

## 1.8 Validación post-publicación Fase 1

**Día 1 después de publicar:**
- [ ] Verificar que Google Search Console no marca errores
- [ ] Revisar que el sitemap esté actualizado
- [ ] Probar formulario desde IP externa (no oficina)
- [ ] Verificar tracking PostHog funcionando

**Semana 1:**
- [ ] Revisar leads que llegan — ¿se segmentan correctamente por tipo de organización?
- [ ] Revisar conversaciones de Claudio — ¿está respondiendo coherente?
- [ ] Iterar copy si hay confusión recurrente en algún punto

---

# FASE 2 — Calculadora REP (lanzamiento upgrade visible 2-3 semanas después)

**Objetivo:** lanzar el diferencial comercial más fuerte de v1.1 con su propio momento de comunicación pública.

**Pre-requisito:** Fase 1 en producción y estable.

## 2.1 Validación legal previa (5-7 días, mayoría tiempo de espera)

- [ ] Coordinar reunión con abogado REP (1-2 horas + tarifa profesional)
- [ ] Compilar borrador de base de datos según 08-calculadora-rep-spec.md
- [ ] Pasar al abogado el checklist de validación (sección 13 del archivo de spec)
- [ ] Recibir validación firmada o email de respaldo
- [ ] Ajustar base de datos según observaciones del abogado
- [ ] Re-validar si hay cambios sustanciales

## 2.2 Curaduría de base de datos (3-5 días en paralelo a 2.1)

- [ ] Compilar JSON de productos prioritarios según 08-calculadora-rep-spec.md sección 7.1
- [ ] Compilar JSON de plazos del decreto RAEE+P (sección 7.2)
- [ ] Compilar JSON de metas de recolección y valorización (sección 7.3) — verificar con texto del DS publicado
- [ ] Compilar JSON de definiciones legales (sección 7.4)
- [ ] Definir disclaimer legal final con apoyo del abogado (sección 8 del spec)

## 2.3 Setup técnico del proyecto (1 día)

- [ ] Crear branch nuevo: `git checkout -b feat/calculadora-rep`
- [ ] Crear estructura de carpetas para la calculadora:
  ```
  /app/calculadora-rep/
    page.tsx (página principal)
    layout.tsx (layout específico si aplica)
    components/
      WizardContainer.tsx
      QuestionRadio.tsx
      QuestionMultiSelect.tsx
      ResultCard.tsx
      ObligationItem.tsx
      DisclaimerBox.tsx
      DownloadActions.tsx
      LeadCaptureForm.tsx
    data/
      productos-prioritarios.json
      plazos-raee.json
      metas-raee.json
      definiciones-legales.json
    flows/
      flow-productor.ts
      flow-sig.ts
      flow-generador.ts
      flow-no-seguro.ts
    types/
      calculadora.ts
  ```
- [ ] Crear API route para generación de PDF: `/app/api/calculadora-rep/generate-pdf/route.ts`
- [ ] Crear API route para envío de email: `/app/api/calculadora-rep/send-email/route.ts`
- [ ] Crear propiedades personalizadas en HubSpot (sección 9.2 del spec)

## 2.4 Implementación frontend wizard (5-7 días)

### Día 1-2: Estructura base
- [ ] Implementar WizardContainer con manejo de estado (useState/useReducer)
- [ ] Implementar ProgressBar
- [ ] Implementar StepCard genérico
- [ ] Implementar componentes de preguntas (Radio, MultiSelect)
- [ ] Implementar navegación entre pasos (next/prev/restart)

### Día 3: Flujo A (Productor) y Flujo B (SIG)
- [ ] Implementar lógica del flujo A según spec sección 3
- [ ] Implementar output del flujo A
- [ ] Implementar lógica del flujo B según spec sección 4
- [ ] Implementar output del flujo B (ficha técnica)

### Día 4: Flujo C (Generador) y Flujo D (No estoy seguro)
- [ ] Implementar lógica del flujo C según spec sección 5 (con ramificación por vertical)
- [ ] Implementar output del flujo C (con personalización por vertical)
- [ ] Implementar lógica del flujo D según spec sección 6
- [ ] Implementar output del flujo D (educativo + identificador)

### Día 5: UI/UX y responsive
- [ ] Aplicar sistema visual cobre/negro coherente con resto del sitio
- [ ] Animaciones de transición entre pasos (sutiles)
- [ ] Estados de loading
- [ ] Responsive mobile-first
- [ ] Disclaimer visible en cada output

## 2.5 Integraciones (3-4 días)

### HubSpot
- [ ] Conectar formulario final con API HubSpot
- [ ] Mapear todas las propiedades personalizadas
- [ ] Implementar lógica de scoring (caliente/tibio/frío) según spec sección 9.1
- [ ] Probar lead capture end-to-end

### PostHog
- [ ] Implementar todos los eventos de la spec sección 10.1
- [ ] Configurar funnel en PostHog dashboard
- [ ] Verificar tracking de pasos donde se abandona

### Generación de PDF
- [ ] Implementar generación de PDF con react-pdf o similar
- [ ] Diseñar template del PDF coherente con el sitio
- [ ] Probar descarga directa

### Envío por email
- [ ] Configurar servicio transaccional (SendGrid, Resend, o similar)
- [ ] Crear template de email con el reporte
- [ ] Probar envío end-to-end

## 2.6 Stress tests con 15 escenarios (2-3 días)

Probar el wizard con los 15 escenarios definidos en spec sección 12. Para cada uno:

- [ ] ¿La calculadora identifica correctamente el rol?
- [ ] ¿El output es preciso para ese caso?
- [ ] ¿El CTA propuesto es el correcto?
- [ ] ¿El lead se categoriza bien (caliente/tibio/frío)?
- [ ] ¿El disclaimer aparece visible?
- [ ] ¿El PDF se genera correctamente?
- [ ] ¿El email llega bien?
- [ ] ¿El lead entra correctamente a HubSpot?

Si algún test falla, iterar y volver a probar.

## 2.7 Activación de Claudio para calculadora (30 min)

- [ ] Activar Regla 7 en system-prompt de Claudio (estaba pendiente desde Fase 1)
- [ ] Probar Claudio con preguntas que deberían derivar a la calculadora
- [ ] Verificar que el link a /calculadora-rep funciona

## 2.8 QA final y publicación Fase 2

- [ ] Revisión visual completa en preview de Netlify
- [ ] Pruebas en mobile (iOS y Android)
- [ ] Pruebas en desktop (Chrome, Firefox, Safari)
- [ ] Auditoría de accesibilidad básica (focus, contrast, labels)
- [ ] Performance check (Lighthouse score > 90)
- [ ] Aprobación del cofounder
- [ ] Merge a main: `git checkout main && git merge feat/calculadora-rep && git push origin main`
- [ ] Verificar que Netlify desplegó correctamente

## 2.9 Comunicación pública del lanzamiento Fase 2

Según spec sección 15:

- [ ] Post de LinkedIn corporativo (cofounders + página empresa)
- [ ] Email a base de leads pre-registrados anunciando la calculadora
- [ ] Outreach directo a SIG identificados (TRAEE y otros)
- [ ] Mención a contactos en MMA y prensa especializada (País Circular, El Desconcierto)
- [ ] Actualizar copy del sitio para destacar la calculadora como CTA principal

## 2.10 Validación post-publicación Fase 2

**Semana 1:**
- [ ] Métricas: wizards iniciados, tasa de finalización, distribución por flujo
- [ ] Calidad de leads capturados (review manual de los primeros 20-30)
- [ ] Bugs reportados, iterar inmediatamente

**Mes 1:**
- [ ] Análisis de funnel: ¿dónde se abandona más?
- [ ] Análisis cualitativo de outputs: ¿son útiles para el usuario final?
- [ ] Feedback de leads cualificados sobre la experiencia
- [ ] Ajustes de copy o lógica si hay confusión recurrente
- [ ] Métricas de conversión: ¿cuántos leads de calculadora se convierten en oportunidades reales?
