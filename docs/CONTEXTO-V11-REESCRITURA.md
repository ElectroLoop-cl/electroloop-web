# CLAUDE.md — Contexto permanente del proyecto Electroloop

**Última actualización:** 2026-05-05  
**Sesión iniciada:** 2026-05-03  
**Objetivo:** Reescritura sitio v1.1 (riesgo legal → credibilidad por transparencia)

---

## 🎯 Misión

Reposicionar electroloop.cl de "gestor RAEE operativo y certificado" (falso) a "gestor RAEE integrador con partners certificados + plan de internalización progresiva" (honesto).

Esto reduce riesgo legal inmediato y vende igual de bien en B2B regulado.

---

## 📊 Decisiones estratégicas finales (Cris + Nico, 2026-05-05)

### Clientes ancla
- **Cupos:** 10
- **Beneficios:** tarifa preferencial primer año, prioridad logística garantizada, período mínimo de contrato
- **Audiencia inicial:** Productores, generadores (minería, salud, municipal, retail), NO SIG directo

### Plan de internalización
- **2026 H2:** Arranque operativo La Serena (III + IV Región)
- **2027 H1:** Expansión de capacidad propia
- **2027 H2-2028:** Internalización de destrucción de datos + expansión macrozona norte

### Integraciones
- **❌ NO HubSpot** en v1.1 (caro, no necesario ahora)
- **✅ Email simple** (Netlify Forms → email a Cris)
- **✅ PostHog** para funnel tracking (opcional)

### Cobertura geográfica inicial
- III Región (Atacama)
- IV Región (Coquimbo)
- Expansión planificada a macrozona norte 2027+

### Formulario de contacto
- **Categorías KISS** (2-3 principales + "Otro")
  - Productor | Generador | Otro
- **NO incluir:** SIG (hablarán directo con Cris)

---

## 🔄 Plan de 4 etapas (10 días hábiles, deploys continuos)

### Etapa 1 — Día 1 (Patch rápido)
- Eliminar ~80 claims falsos
- Deploy a producción same day
- Riesgo legal cerrado

### Etapa 2 — Días 2-4 (Reescritura copy)
- Hero, ValueProps, Status (NUEVA), Servicios, Contacto, Footer
- Deploy al completar

### Etapa 3 — Días 5-6 (Estética premium)
- Sistema tipográfico, animaciones, Lighthouse 95+
- Deploy al completar

### Etapa 4 — Días 7-10 (Calculadora REP)
- 4 flujos, validación legal, PDF + email
- Deploy al completar

---

## 📁 Stack técnico

- **Framework:** Astro 4
- **Styling:** Tailwind CSS 3
- **i18n:** Custom (es.json, en.json)
- **Forms:** Netlify Forms → nodemailer
- **Analytics:** PostHog
- **Hosting:** Netlify

---

## 🤖 Ruflo V3 — Multi-Agent Coordination (ACTIVO EN TODOS LOS CHATS)

**Ruflo está inicializado en este proyecto.** Puedes usarlo desde cualquier chat de Code.

### ✨ Capacidades

**98 Agentes especializados:**
- **Core:** Researcher, Architect, Coder, Tester, Reviewer
- **Especializados:** Security, Performance, DevOps, API Design, Database
- **Patrones:** AutoML, FastAPI, React, Vue, TypeScript, Python

**Sistema de aprendizaje (V3):**
- **ReasoningBank:** Almacena patrones de código exitosos (HNSW-indexado)
- **EWC++:** Elastic Weight Consolidation previene olvido catastrófico
- **Flash Attention:** 2.49x-7.47x speedup en contextos grandes
- **SONA:** Adaptación neural <0.05ms

### 🚀 Comandos básicos (ejecutar en cualquier chat)

```bash
# Iniciar agente específico
npx ruflo agent spawn researcher --task "Analizar estructura"

# Buscar patrones previos (HNSW-indexado)
npx ruflo memory search --query "implementar formulario" --limit 5

# Ver estado del swarm
npx ruflo swarm status

# Almacenar patrón exitoso
npx ruflo memory store -k "electroloop-form-pattern" --value "..."

# Ver estadísticas de aprendizaje
npx ruflo memory stats
```

### 🎯 Hooks automáticos

Ruflo ejecuta automáticamente:

| Hook | Trigger | Función |
|------|---------|----------|
| `pre-task` | Antes de implementar | Busca patrones similares previos |
| `post-task` | Después de terminar | Almacena patrón + calidad |
| `worker:consolidate` | Cada 30 min | EWC++ previene olvido |
| `worker:optimize` | Diariamente | Optimiza HNSW index |

### 📚 Proyectos con Ruflo

- **Este proyecto (Electroloop v1.1):** C:\Users\carif\web
- **Exportación NFU:** C:\Users\carif\OneDrive\Documentos\Claude\Projects\Exportación NFU

Cada proyecto tiene su propia instancia de Ruflo + memoria independiente.

### 💾 Memoria compartida por proyecto

Cada proyecto almacena:
- Patrones de código (estructura, best practices)
- Errores evitados (failure learning)
- Vectores semánticos (búsqueda rápida)
- Métricas de calidad (test coverage, linting)

La búsqueda HNSW es **150x-12,500x más rápida** que búsqueda lineal.

### 🔧 Configuración avanzada

Ver `.claude/settings.json` para:
- Hooks personalizados
- Agentes habilitados/deshabilitados
- Parámetros de memoria
- Topología del swarm

---

## 🔗 Flujo de trabajo

- **Branch:** rewrite/v1.1-honest-claims
- **Commits:** Etapa por etapa
- **Preview:** Netlify auto-genera
- **Production:** Merge a main post-QA
- **No push directo a main**

---

## ⏰ Timeline

- **Lunes 2026-05-06:** Etapa 1 (Patch rápido)
- **Semana 1:** Etapas 2-3
- **Semana 2:** Etapa 4 + lanzamiento

---

**Este archivo es la fuente de verdad del proyecto.**
