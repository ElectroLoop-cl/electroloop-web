# Electroloop — Reescritura del sitio v1.1

**Fecha:** Abril 2026
**Versión:** 1.1 (auditoría de claims + reposicionamiento honesto pre-operativo + calculadora REP multi-rol)
**Estado:** Listo para implementación

---

## Contexto

Electroloop está en fase pre-operativa. Inicio de operaciones: julio-agosto 2026.

El sitio actual (electroloop.cl) afirma servicios y certificaciones que aún no están listos. Esta reescritura ajusta el posicionamiento al estado real de la empresa **sin perder fuerza comercial** — al contrario, la fortalece comunicando con honestidad estratégica el modelo integrador con partners certificados y el plan de internalización progresiva 2026-2028.

Adicionalmente, v1.1 incluye el **diferencial de captación más fuerte del proyecto**: una calculadora REP multi-rol que identifica el rol del usuario en el ecosistema, le explica sus obligaciones y captura leads de altísima calidad.

## Estrategia de lanzamiento por fases

**Fase 1 (1-2 días):** sitio honesto en producción. Reduce riesgo legal de inmediato y captura leads simples.

**Fase 2 (2-3 semanas después):** lanzamiento de la calculadora REP como upgrade visible. Genera segundo momento de comunicación pública.

Esta secuencia se decidió deliberadamente para tener dos hitos comunicables al mercado en lugar de uno.

## Lo que cambia

- **Eliminados** claims de exclusividad ("el único"), certificaciones SEREMI no obtenidas, SLAs específicos pre-operación, y promesas de inmediatez.
- **Reformulados** claims de servicio para reflejar el modelo integrador con partners certificados.
- **Agregada** sección "Estado de Electroloop" con roadmap honesto.
- **Agregada** bandera visible de inicio operativo (julio 2026).
- **Reformulados** CTAs de "agendar retiro" a "pre-registro de clientes ancla" / "agendar reunión técnica".
- **Agregada** la calculadora REP multi-rol (fase 2).

## Lo que se mantiene

- Logo, paleta cobre/negro, sistema visual general.
- Estructura del sitio (hero → por qué → proceso → servicios → contacto).
- Concepto narrativo "loop visible" / circularidad.
- Claudio como copiloto (con system-prompt actualizado).
- Esencia comercial y diferencial.

## Estructura de archivos

```
00-README.md                        ← Este documento
01-resumen-ejecutivo.md             ← Para presentar al cofounder
02-copy-completo-sitio.md           ← Copy final listo para implementar
03-seccion-estado-electroloop.md    ← Sección nueva (oro estratégico)
04-ctas-por-audiencia.md            ← Reformulación de CTAs
05-ajustes-claudio-system-prompt.md ← Bloque para agregar a Claudio
06-checklist-implementacion.md      ← Pasos concretos (fase 1 + fase 2)
07-roadmap-v1-a-v2.md               ← Plan de evolución cuando opere la planta
08-calculadora-rep-spec.md          ← Especificación completa de la calculadora REP
```

## Tiempo estimado de implementación

**Fase 1 — Sitio honesto:**
- Reescritura de copy del sitio actual: 4-6 horas
- Sección nueva "Estado de Electroloop": 1-2 horas
- Actualización Claudio: 1-2 horas
- QA + revisión cofounder: 1-2 horas
- **Subtotal Fase 1: ~10 horas en 1-2 días**

**Fase 2 — Calculadora REP:**
- Curaduría base de datos + validación legal: 5-6 días
- Frontend wizard (4 flujos): 5 días
- Integraciones HubSpot/PostHog + PDF/email: 5 días
- QA con 15 stress tests: 2-3 días
- **Subtotal Fase 2: ~3-4 semanas con Claude Code + tú**

**Total: ~4 semanas distribuidas en dos lanzamientos públicos.**

## Próximos pasos sugeridos

### Para lanzar Fase 1 (sitio honesto)

1. Revisar 01-resumen-ejecutivo.md con cofounder
2. Validar lista real de partners certificados ya identificados
3. Definir lista honesta de autorizaciones (obtenidas / en trámite / planificadas) para sección "Estado"
4. Implementar copy nuevo en el sitio
5. Actualizar Claudio
6. Lanzar a producción

### Para preparar Fase 2 (calculadora REP) en paralelo

1. Agendar 1-2 horas con abogado REP para validación legal
2. Curar base de datos de productos prioritarios, metas y plazos
3. Crear propiedades personalizadas en HubSpot
4. Implementar wizard según 08-calculadora-rep-spec.md
5. Stress tests con 15 escenarios definidos
6. Lanzar como segundo hito público
