# Calculadora REP multi-rol — Especificación completa

**Estado:** v1.1 fase 2 (lanzamiento como upgrade visible 2-3 semanas después del sitio honesto)
**Posición en roadmap:** se mueve de v2 a v1.1 fase 2 por decisión de cofounder.

---

## 1. Propósito y posicionamiento

La calculadora es **el diferencial v1.1 más fuerte** y captura leads cualificados al mismo tiempo que educa al mercado sobre el ecosistema REP-RAEE.

**Lo que es:**
- Un wizard interactivo que, según las respuestas del usuario, identifica su rol en el ecosistema REP, le explica sus obligaciones, y le propone una salida concreta.

**Lo que NO es:**
- No es asesoría legal vinculante. Lleva disclaimer legal en cada output.
- No es una herramienta de cotización (eso es flujo separado vía formulario comercial).
- No es un quiz superficial. Es un calculador funcional con base de datos curada y validación legal.

**Por qué es diferenciador:**
- Ningún competidor en Chile ofrece una calculadora REP multi-rol bien hecha hoy.
- Para SIG y mineras, demuestra autoridad técnica y conocimiento regulatorio profundo.
- Para productores y generadores chicos, simplifica algo que es complejo y poco entendido.
- Para Electroloop, captura leads de altísima calidad (ya saben qué necesitan al terminar).

---

## 2. Arquitectura del wizard

### Pantalla 0 — Entrada

**H1:** ¿Cuál es tu situación REP?

**Subline:**
Responde 5-8 preguntas y obtén un reporte personalizado con tus obligaciones bajo la Ley REP de Chile, plazos aplicables y pasos concretos para cumplir. Tarda menos de 3 minutos.

**Disclaimer visible:**
Esta calculadora es referencial. La información proporcionada no constituye asesoría legal. Para casos específicos, consulta con un abogado especializado en derecho ambiental REP.

**CTA:** [Comenzar]

### Pantalla 1 — Identificación de rol

**Pregunta:** ¿Cuál es tu rol en el ecosistema REP-RAEE?

**Opciones (radio):**
- Soy un productor de productos prioritarios: importo o fabrico aparatos eléctricos/electrónicos para vender en Chile
- Soy un Sistema de Gestión REP (SIG) o estoy formando uno
- Soy un generador final: mi empresa o institución produce RAEE en sus operaciones
- No estoy seguro / quiero entender mi situación

Cada opción abre un sub-flujo distinto.

---

## 3. Flujo A — Productor de productos prioritarios

### Pregunta A1 — Categoría

¿Qué tipo de productos prioritarios introduces al mercado nacional? (selección múltiple)

- Aparatos eléctricos y electrónicos (RAEE)
- Pilas y baterías
- Envases y embalajes
- Neumáticos
- Aceites lubricantes
- Textiles
- Otra / no estoy seguro

**Lógica:** la calculadora se enfoca en RAEE+Pilas (decreto recién con toma de razón) pero menciona los otros para completitud.

### Pregunta A2 — Volumen

¿Cuál es tu volumen aproximado anual de productos prioritarios introducidos al mercado?

**Para RAEE:**
- Menos de 1 tonelada/año
- 1-10 toneladas/año
- 10-100 toneladas/año
- 100-1.000 toneladas/año
- Más de 1.000 toneladas/año
- No lo sé

**Para Pilas:** rangos similares ajustados (kg en lugar de toneladas en bandas bajas).

### Pregunta A3 — Estado actual de cumplimiento

¿Cómo gestionas hoy tus obligaciones REP?

- Estoy afiliado a un Sistema de Gestión (SIG)
- Gestiono individualmente
- No estoy seguro
- Aún no estoy gestionando (en proceso)

### Pregunta A4 — Inscripción RETC

¿Tu empresa está inscrita en el RETC (Registro de Emisiones y Transferencias de Contaminantes) del Ministerio del Medio Ambiente?

- Sí, estamos inscritos
- No, aún no
- No sé qué es el RETC

### Pregunta A5 — Ubicación operativa

¿Dónde están concentrados tus volúmenes operativos?

- Macrozona Norte (Arica a Coquimbo)
- Macrozona Centro (Valparaíso a Maule)
- Macrozona Sur (Ñuble a Magallanes)
- Distribuidos en todo Chile
- Importación centralizada en Santiago/Valparaíso

### Output Flujo A — Productor

**Estructura del reporte:**

```
┌─────────────────────────────────────┐
│ TU SITUACIÓN REP                    │
├─────────────────────────────────────┤
│ Rol: Productor de [categorías]      │
│ Volumen estimado: [rango]           │
│ Macrozona: [zona]                   │
└─────────────────────────────────────┘

OBLIGACIONES APLICABLES

1. Inscripción en RETC
   Estado: [obligado / cumplido]
   Plazo: [vigente desde X / vence Y]
   Sanción por incumplimiento: [referencia]

2. Declaración anual de productos prioritarios
   Plazo: 30 de junio de cada año (cierre 2025 fue 15 sep)
   Plataforma: RETC del MMA
   Estado: [aplica / no aplica]

3. Cumplimiento de metas de recolección y valorización
   Decreto aplicable: DS RAEE+Pilas (toma de razón abril 2026)
   Inicio de exigibilidad: marzo 2028 estimado (24 meses)
   Metas progresivas: [tabla resumida según categoría]

4. Sistema de gestión
   Opciones: afiliarse a SIG / gestión individual
   Tu situación actual: [respuesta usuario]
   Recomendación: [análisis personalizado]

PRÓXIMOS PASOS RECOMENDADOS

[Lista de 3-5 acciones concretas según respuestas]

CÓMO ELECTROLOOP TE AYUDA

[Bloque adaptado según rol y volumen:
- Si volumen alto → "Conversemos sobre afiliación o servicio integral"
- Si en proceso → "Servicio Gestión REP disponible desde ya"
- Si gestión individual → "Coordinamos con tu sistema o evalúa SIG"]

DESCARGAR REPORTE [PDF] [Email]

CTA primario: [Conversemos sobre tu cumplimiento REP]
CTA secundario: [Recibir actualizaciones REP por email]
```

---

## 4. Flujo B — Sistema de Gestión REP (SIG)

### Pregunta B1 — Estado del SIG

¿En qué etapa está tu Sistema de Gestión?

- En operación con plan aprobado
- En conformación, esperando aprobación MMA
- En diseño, preparando documentación
- Explorando viabilidad de conformar uno

### Pregunta B2 — Categorías cubiertas

¿Qué categorías de productos prioritarios cubre o cubrirá?

- RAEE (aparatos eléctricos y electrónicos)
- Pilas y baterías
- Envases y embalajes
- Neumáticos
- Aceites lubricantes
- Textiles

### Pregunta B3 — Productores afiliados

¿Aproximadamente cuántos productores afiliados (o esperan tener)?

- Menos de 10
- 10-50
- 50-200
- Más de 200
- Aún no definido

### Pregunta B4 — Cobertura geográfica

¿Qué cobertura geográfica necesitas para tu red de gestores y valorizadores?

- Nacional (todo Chile)
- Macrozona Norte (Arica a Coquimbo)
- Macrozona Centro (Valparaíso a Maule)
- Macrozona Sur (Ñuble a Magallanes)
- Multiple zonas específicas

### Pregunta B5 — Necesidad de capacidad

¿Qué necesitas evaluar para tu plan de gestión?

- Capacidad de valorización por categoría
- Cobertura logística
- Trazabilidad y reportería
- Costos referenciales
- Todo lo anterior

### Output Flujo B — SIG

**Estructura:**

```
┌─────────────────────────────────────┐
│ FICHA TÉCNICA — ELECTROLOOP COMO    │
│ VALORIZADOR PARA TU SIG              │
├─────────────────────────────────────┤
│ SIG: [tipo según respuesta]          │
│ Categorías cubiertas: [lista]        │
│ Cobertura solicitada: [zonas]        │
└─────────────────────────────────────┘

CAPACIDADES DE ELECTROLOOP RELEVANTES PARA TU SIG

Estado operativo: Inicio operativo julio 2026
Modelo: Gestor RAEE integrador con red de partners certificados
Plan de internalización: 2026-2028

Capacidades propias confirmadas:
- Recolección y logística certificada
- Recepción, pesaje y trazabilidad documentada
- Clasificación y pre-tratamiento
- Coordinación con red de partners certificados
- Reportería compatible con requerimientos MMA

Cobertura geográfica:
- Inicial: IV Región (Coquimbo)
- Expansión planificada 2027: III y V Región
- Macrozona norte completa: 2027-2028

Categorías procesables:
- RAEE: [detallar capacidades]
- Pilas: [detallar capacidades]
- [Otras según partners]

CÓMO PODEMOS COLABORAR

[Bloque adaptado según etapa del SIG:
- Si en operación → "Conversemos contratos de valorización"
- Si en conformación → "Pre-acuerdo de capacidad para tu plan"
- Si en diseño → "Soporte técnico para diseño de operación"
- Si explorando → "Análisis de viabilidad conjunto"]

PRÓXIMO PASO RECOMENDADO

CTA primario: [Agendar reunión técnica con Electroloop]
CTA secundario: [Descargar ficha técnica completa PDF]
```

---

## 5. Flujo C — Generador final

### Pregunta C1 — Tipo de organización

¿Qué tipo de organización representas?

- Minería / faena minera
- Salud (hospital, clínica, laboratorio, ISAPRE)
- Sector público / Municipalidad
- Retail / cadena de tiendas
- Oficinas corporativas
- Data center
- Universidad / institución educativa
- Industria / manufactura
- Otro

### Pregunta C2 — Tamaño aproximado

¿Cuántos empleados/usuarios tiene tu organización?

- Menos de 50
- 50-200
- 200-1.000
- 1.000-5.000
- Más de 5.000
- No aplica (institución pública/educativa)

### Pregunta C3 — Tipos de RAEE generados

¿Qué tipos de RAEE genera tu operación? (selección múltiple)

- Computadores y equipos de oficina (laptops, monitores, impresoras)
- Servidores y equipos de red
- Equipos de telecomunicaciones (teléfonos, radios)
- Equipos médicos (solo salud)
- Equipos industriales electrónicos (solo minería/manufactura)
- Electrodomésticos
- Pilas y baterías
- Otros equipos electrónicos

### Pregunta C4 — Volumen estimado

¿Cuánto RAEE estimas generar al año?

- Menos de 100 kg
- 100 kg - 1 tonelada
- 1-10 toneladas
- 10-50 toneladas
- Más de 50 toneladas
- No tengo idea / no medimos hoy

### Pregunta C5 — Datos sensibles

¿Tus equipos electrónicos contienen datos sensibles (información confidencial, datos personales, propiedad intelectual)?

- Sí, todos los equipos
- Sí, una parte
- No
- No estoy seguro

### Pregunta C6 — Ubicación operativa

¿Dónde están concentrados tus volúmenes de RAEE?

- Macrozona Norte (Arica a Coquimbo)
- Región Metropolitana
- Macrozona Centro (Valparaíso a Maule)
- Macrozona Sur (Ñuble a Magallanes)
- Múltiples regiones
- Faena específica (especificar)

### Pregunta C7 — Estado actual de gestión

¿Cómo gestionas hoy tus RAEE?

- Tenemos contrato con un gestor formal
- Lo entregamos a un reciclador o chatarrero local
- Se acumulan o desechamos junto a otros residuos
- No tenemos proceso definido

### Output Flujo C — Generador

**Estructura:**

```
┌─────────────────────────────────────┐
│ TU SITUACIÓN REP COMO GENERADOR     │
├─────────────────────────────────────┤
│ Tipo: [organización]                 │
│ Volumen estimado: [rango]            │
│ Datos sensibles: [sí/no/parcial]     │
│ Ubicación: [zona]                    │
└─────────────────────────────────────┘

¿ERES CONSUMIDOR INDUSTRIAL REP?

[Análisis personalizado según tipo + volumen:
- Mineras y faenas: probablemente sí, obligación de gestionar
- Hospitales: sí en muchos casos, especialmente con equipos médicos
- Municipios: rol particular como gestores territoriales
- Retail/oficinas chicas: probablemente no, pero buenas prácticas aplican
- Data centers: sí si superan umbrales]

OBLIGACIONES APLICABLES

[Lista personalizada con plazos y responsabilidades]

RIESGOS DE NO GESTIONAR ADECUADAMENTE

[Bloque honesto: sanciones SMA, riesgo de Ley 21.719 si hay datos
sensibles mal gestionados, exposición ESG, riesgo reputacional]

POR QUÉ ELECTROLOOP

[Bloque adaptado según vertical y volumen:
- Mineras → enfoque trazabilidad ESG + datos sensibles + cobertura norte
- Salud → enfoque destrucción de datos vía partner certificado
  + RESPEL si aplica
- Municipal → enfoque alianza institucional + plan REP comunal
- Retail → enfoque simplicidad + factura clara
- Oficinas/data center → enfoque destrucción datos + recurrencia
- Universidades → enfoque servicio integral + reporte sostenibilidad]

PRÓXIMO PASO RECOMENDADO

CTA primario: [Pre-registro como cliente ancla]
CTA secundario: [Diagnóstico REP gratuito]
```

---

## 6. Flujo D — "No estoy seguro"

Es el flujo educativo. Captura leads que no sabían que tenían obligaciones REP.

### Pregunta D1 — Punto de partida

¿Qué te trae a esta calculadora?

- Mi empresa importa o fabrica productos
- Mi organización genera basura electrónica
- Trabajo en una organización pública/sin fines de lucro y queremos cumplir
- Solo tengo curiosidad sobre la Ley REP

**Lógica:** según respuesta, deriva al flujo correspondiente con copy más pedagógico de entrada.

### Pregunta D2 — Conocimiento previo

¿Qué sabes de la Ley REP de Chile?

- La conozco bien
- He oído de ella pero no la he estudiado
- Es la primera vez que escucho
- Sé que existe pero no si me afecta

### Output Flujo D — Educativo + identificador

**Estructura:**

```
GUÍA EXPRÉS — LEY REP EN CHILE

[Explicación pedagógica de 200-300 palabras sobre qué es la Ley REP,
qué son productos prioritarios, qué roles existen]

¿CUÁL ES TU SITUACIÓN PROBABLE?

[Análisis basado en respuestas anteriores que deriva al flujo
correspondiente]

[CTA "Continuar con mi diagnóstico personalizado" → al flujo correcto]

RECURSOS PARA APRENDER MÁS

- Guía Ley REP Chile [link a página recursos]
- Glosario REP-RAEE [link]
- Plazos clave 2026-2028 [link]

CTA suave: [Suscribirme a actualizaciones REP]
```

---

## 7. Base de datos curada que la calculadora necesita

Estos datos hay que tenerlos cargados (probablemente como archivos JSON o tabla en base de datos) antes de implementar:

### 7.1 Productos prioritarios

```json
{
  "productos_prioritarios": [
    {
      "id": "raee",
      "nombre": "Aparatos eléctricos y electrónicos",
      "decreto": "DS RAEE+Pilas",
      "estado_decreto": "toma_razon_abril_2026",
      "exigibilidad_metas": "marzo_2028_estimado",
      "subcategorias": [
        "grandes_electrodomesticos",
        "pequenos_electrodomesticos",
        "equipos_informatica_telecomunicaciones",
        "aparatos_consumo",
        "aparatos_alumbrado",
        "herramientas_electricas",
        "juguetes_equipos_deportivos",
        "dispositivos_medicos",
        "instrumentos_vigilancia_control",
        "expendedores_automaticos",
        "paneles_fotovoltaicos"
      ]
    },
    {
      "id": "pilas",
      "nombre": "Pilas y baterías",
      "decreto": "DS RAEE+Pilas",
      "estado_decreto": "toma_razon_abril_2026"
    },
    {
      "id": "envases",
      "nombre": "Envases y embalajes",
      "decreto": "DS Envases",
      "estado_decreto": "vigente_con_metas"
    },
    {
      "id": "neumaticos",
      "nombre": "Neumáticos",
      "decreto": "DS Neumáticos",
      "estado_decreto": "vigente_con_metas"
    },
    {
      "id": "aceites",
      "nombre": "Aceites lubricantes",
      "decreto": "DS ALU",
      "estado_decreto": "publicado_2024_metas_24_meses"
    },
    {
      "id": "textiles",
      "nombre": "Textiles",
      "decreto": "Decreto en tramitación",
      "estado_decreto": "pendiente"
    }
  ]
}
```

### 7.2 Plazos clave del decreto RAEE+P

```json
{
  "plazos_raee": {
    "toma_razon_contraloria": "abril_2026",
    "publicacion_diario_oficial": "abril_2026_estimado",
    "exigibilidad_metas": "marzo_2028_estimado",
    "plazo_obligacion_etiquetado": "3_anos_desde_publicacion",
    "plazo_inscripcion_retc_anual": "30_junio_cada_ano",
    "plazo_declaracion_productos": "30_junio_cada_ano"
  }
}
```

### 7.3 Metas de recolección y valorización

```json
{
  "metas_raee": {
    "ano_1": { "recoleccion": "X%", "valorizacion": "Y%" },
    "ano_2": { "recoleccion": "X%", "valorizacion": "Y%" },
    "ano_3": { "recoleccion": "X%", "valorizacion": "Y%" }
  }
}
```

> **CRÍTICO:** estos números deben venir del decreto oficial. Hay que extraerlos del DS publicado y validarlos con el abogado REP. **No inventar.**

### 7.4 Definiciones legales

```json
{
  "definiciones": {
    "productor": "Quien enajena por primera vez un producto prioritario en el mercado nacional, lo importa para uso profesional propio, o lo adquiere de un tercero que no es el primer distribuidor.",
    "consumidor_industrial": "Empresa que genera residuos de productos prioritarios en sus procesos productivos (ej. mineras, constructoras). Tiene obligación de valorizar sus residuos por cuenta propia o entregarlos a un sistema de gestión.",
    "sistema_gestion": "Institución sin fines de lucro que es el mecanismo instrumental para que los productores, individual o colectivamente, den cumplimiento a las obligaciones establecidas por la REP.",
    "gestor": "Persona natural o jurídica que realiza cualquiera de las operaciones de manejo de residuos.",
    "valorizador": "Subtipo de gestor que recupera materiales para reincorporar al ciclo productivo."
  }
}
```

---

## 8. Disclaimer legal obligatorio

**Este disclaimer aparece:**
- Al inicio del wizard (visible)
- En cada pantalla de output
- En cada PDF descargado
- En cada email enviado con el reporte

**Texto:**

```
Esta calculadora es una herramienta de orientación general basada en
la información proporcionada por el usuario y normativa REP vigente
a la fecha de consulta. La información entregada no constituye
asesoría legal vinculante ni reemplaza una evaluación profesional
personalizada. Para determinar tus obligaciones específicas y plan
de cumplimiento, consulta con un abogado especializado en derecho
ambiental REP o con el Ministerio del Medio Ambiente.

Electroloop no se hace responsable por decisiones tomadas
exclusivamente con base en los resultados de esta calculadora.

Última actualización de la base regulatoria: [fecha de revisión legal]
```

---

## 9. Lógica de scoring y captura de leads

Cada sesión completada genera un lead con scoring automático para que el equipo comercial priorice.

### 9.1 Categorías de lead

**Lead caliente (contactar dentro de 24h):**
- SIG en operación o conformación con cobertura macrozona norte
- Generador minero con volumen >10 toneladas/año
- Hospital con datos sensibles y volumen >1 tonelada/año
- Productor con volumen >100 toneladas/año
- Cliente con urgencia explícita declarada

**Lead tibio (contactar dentro de 5 días):**
- Generador con volumen 1-10 toneladas
- SIG en etapas iniciales
- Productor con volumen 10-100 toneladas
- Generador en macrozona expansión planificada (III, V Región)

**Lead frío (nutrir vía email):**
- Volumen <1 tonelada
- "Solo curiosidad" en flujo D
- Ubicación fuera de zona de cobertura planificada
- No-afecto a REP claramente

### 9.2 Propiedades para HubSpot

Crear estas propiedades personalizadas en HubSpot antes de implementar:

```
- electroloop_calc_rol: enum (productor, sig, generador, no_seguro)
- electroloop_calc_volumen: enum (rangos definidos)
- electroloop_calc_categoria: enum o multi-select
- electroloop_calc_macrozona: enum
- electroloop_calc_datos_sensibles: boolean
- electroloop_calc_estado_cumplimiento: enum
- electroloop_calc_fecha_completado: datetime
- electroloop_calc_score: enum (caliente, tibio, frio)
- electroloop_calc_recomendacion_servicio: text
- electroloop_calc_pdf_url: url (link al reporte generado)
```

---

## 10. Eventos PostHog para tracking

### 10.1 Eventos del funnel

```
calculadora_inicio
calculadora_paso_1_completado (rol identificado)
calculadora_abandonado (con paso donde abandonó)
calculadora_flujo_a_completado (productor)
calculadora_flujo_b_completado (sig)
calculadora_flujo_c_completado (generador)
calculadora_flujo_d_completado (educativo)
calculadora_pdf_descargado
calculadora_pdf_email_enviado
calculadora_cta_principal_clicked (cuál CTA según flujo)
calculadora_cta_secundario_clicked
calculadora_form_submit (lead capturado)
```

### 10.2 Métricas a monitorear

- Tasa de inicio (% visitantes que clickean "Comenzar")
- Tasa de finalización (% que termina el wizard)
- Distribución de roles identificados
- Distribución de scoring de leads
- Conversión a CTA (% que da próximo paso)
- Tiempo promedio de completado
- Pasos donde más se abandona (oportunidades de mejora)

---

## 11. Componentes UI necesarios

Para que Claude Code implemente:

```
- WizardContainer (controla estado global del wizard)
- ProgressBar (indicador de avance)
- StepCard (contenedor de cada pantalla)
- QuestionRadio (pregunta con radio buttons)
- QuestionMultiSelect (pregunta con multi-select)
- QuestionText (pregunta abierta corta)
- ResultCard (output principal según flujo)
- ObligationItem (item de obligación con plazo y estado)
- CTABlock (bloque de CTAs según flujo)
- DisclaimerBox (disclaimer legal recurrente)
- DownloadActions (PDF + email)
- RestartButton (reiniciar wizard)
- LeadCaptureForm (formulario final con datos opcionales)
```

**Stack técnico:**
- Estado del wizard: useState/useReducer (suficiente para v1.1) o Zustand si se complica
- Validaciones: Zod
- Generación de PDF: react-pdf o similar
- Email del reporte: integración con servicio transaccional (SendGrid, Resend) vía API route Next.js

---

## 12. Stress tests para validar antes de publicar

Probar el wizard con estos 15 escenarios y verificar que el output sea coherente y útil:

1. **Importadora de smartphones, 50 toneladas/año, no inscrita en RETC, en RM**
2. **Fabricante de equipos médicos, 10 toneladas/año, afiliado a SIG ya, en V Región**
3. **TRAEE en operación, RAEE+Pilas, 100+ productores, cobertura nacional**
4. **SIG en formación de aceites, en diseño, cobertura macrozona norte**
5. **Minera en faena Antofagasta, 200 empleados, 5 toneladas RAEE/año, mucho dato sensible, gestiona con chatarrero**
6. **Hospital regional Coquimbo, 500 empleados, 2 toneladas/año, datos sensibles, sin proceso definido**
7. **Municipalidad de La Serena, RAEE de oficinas + punto limpio comunal**
8. **Retail con 50 sucursales en Chile centro-norte, 8 toneladas RAEE/año**
9. **Universidad regional, 5.000 estudiantes, 1 tonelada/año**
10. **Data center pequeño en Santiago, 100 servidores/año al recambio**
11. **Oficina de 30 personas, computadores y celulares, no saben volumen**
12. **Persona natural curiosa por la Ley REP**
13. **Profesional jurídico explorando para asesorar a cliente**
14. **Productor con volumen >1000 toneladas (caso límite)**
15. **Empresa que importa pero solo para uso interno, no comercializa**

Cada test debe verificar:
- ¿La calculadora identifica correctamente el rol?
- ¿El output es preciso para ese caso?
- ¿El CTA propuesto es el correcto?
- ¿El lead se categoriza bien (caliente/tibio/frío)?
- ¿El disclaimer aparece visible?

---

## 13. Checklist de validación legal con el abogado REP

Pasar al abogado este checklist específico antes de publicar:

```
[ ] Definiciones legales utilizadas son precisas según Ley 20.920
[ ] Categorías de productos prioritarios reflejan decretos vigentes
[ ] Plazos del decreto RAEE+P son correctos según texto publicado
[ ] Metas de recolección/valorización por año son las del decreto
[ ] Identificación de "consumidor industrial" es jurídicamente correcta
[ ] Output para mineras refleja correctamente sus obligaciones REP
[ ] Output para hospitales considera RESPEL si aplica
[ ] Output para municipios refleja su rol particular
[ ] Disclaimer legal es suficiente para deslindar responsabilidad
[ ] No hay claims que puedan interpretarse como asesoría legal
[ ] Sanciones mencionadas reflejan realmente las facultades de SMA
[ ] Información sobre Ley 21.719 (datos personales) es correcta
[ ] El "no afecto a REP" se determina con criterios legales sólidos
```

**Honorarios estimados:** 1-2 horas de revisión, según tarifa del abogado.

**Output esperado:** documento de validación firmado o email confirmando revisión, que se archiva como respaldo.

---

## 14. Cronograma estimado de implementación (con Claude Code + tú)

**Semana 1 — Backend y datos**
- Día 1-2: curaduría de base de datos (productos prioritarios, plazos, metas, definiciones)
- Día 3: validación con abogado REP
- Día 4-5: ajustes según validación legal

**Semana 2 — Frontend wizard**
- Día 1-2: estructura del wizard (componentes base, navegación, estado)
- Día 3: implementación flujos A y B (productor + SIG)
- Día 4: implementación flujos C y D (generador + educativo)
- Día 5: refinamiento UI/UX, animaciones, responsive

**Semana 3 — Integraciones y QA**
- Día 1-2: integración HubSpot (propiedades + lead capture)
- Día 3: integración PostHog (eventos + funnel)
- Día 4: generación de PDF + envío por email
- Día 5: stress tests con los 15 escenarios

**Semana 4 — Lanzamiento (opcional, depende de QA)**
- Ajustes finales según testing
- Validación de cofounder
- Merge a main + comunicación pública del lanzamiento

**Total: 3-4 semanas con dedicación de varias horas al día.**

---

## 15. Comunicación pública del lanzamiento

Cuando se lance la calculadora (2-3 semanas después del sitio honesto):

**Mensaje:**
"Electroloop libera la primera calculadora REP multi-rol de Chile. Identifica tu rol en el ecosistema, conoce tus obligaciones y obtén un reporte personalizado en menos de 3 minutos. Validada por equipo legal especializado en derecho ambiental REP."

**Canales:**
- LinkedIn corporativo (cofounders + página empresa)
- Newsletter a base de leads pre-registrados
- Outreach directo a SIG identificados (TRAEE y otros)
- Mención a contactos en MMA y prensa especializada (País Circular, El Desconcierto)

**Métricas de éxito al mes 1 post-lanzamiento:**
- 200+ wizards iniciados
- 50%+ tasa de finalización
- 30+ leads calificados (caliente + tibio)
- 3+ menciones en prensa especializada
- 1+ SIG en conversación técnica
