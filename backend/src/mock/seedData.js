const { ROLES } = require("../domain/roles");

const EVENT_CATALOG = [
  {
    id: "po-priority-onboarding",
    title: "PO cambia prioridad: onboarding prioridad 1",
    type: "priority_change",
    sourceRole: ROLES.PO,
    payload: {
      message: "Onboarding ahora es prioridad 1",
      target: "onboarding",
      priority: "P1",
    },
  },
  {
    id: "design-stepper-rule",
    title: "Disenador cambia regla de formularios",
    type: "design_rule_change",
    sourceRole: ROLES.DESIGN,
    payload: {
      message: "Todos los formularios deben usar stepper + validacion inline",
      rule: "stepper_inline_validation",
    },
  },
  {
    id: "pm-move-deadline",
    title: "PM mueve deadline del MVP",
    type: "deadline_change",
    sourceRole: ROLES.PM,
    payload: {
      message: "MVP debe entregarse 1 semana antes",
      offsetDays: -7,
      targetMilestone: "MVP",
    },
  },
  {
    id: "backend-contract-change",
    title: "Backend cambia contrato de registro",
    type: "api_contract_change",
    sourceRole: ROLES.BACKEND,
    payload: {
      message: "El endpoint de registro ahora requiere nuevo campo",
      endpoint: "POST /api/onboarding/register",
      newField: "businessCategory",
    },
  },
  {
    id: "frontend-blocked-onboarding",
    title: "Frontend reporta bloqueo por contrato",
    type: "frontend_blocker",
    sourceRole: ROLES.FRONTEND,
    payload: {
      message: "Falta contrato definitivo para onboarding",
      dependency: "API contract onboarding",
    },
  },
  {
    id: "po-add-goal-activation",
    title: "PO agrega objetivo de negocio",
    type: "business_goal_addition",
    sourceRole: ROLES.PO,
    payload: {
      message: "Reducir friccion de alta y aumentar activacion",
      goal: "Reducir friccion de alta y aumentar activacion",
    },
  },
];

function createInitialProjectState() {
  return {
    project: {
      name: "AI Project Orchestrator Demo",
      codename: "Project Atlas",
      objective: "Lanzar un MVP de onboarding para comercios",
      mode: "demo",
      status: "Onboarding en curso",
    },
    globalContext: {
      businessGoals: [
        "Aumentar activacion temprana en onboarding",
        "Reducir abandono en primer flujo",
      ],
      designRules: ["Componentes base consistentes", "Accesibilidad AA minima"],
      architecture: [
        "Frontend React con wizard incompleto",
        "Backend Express con entidades base parciales",
        "Analytics postergado para post-MVP",
      ],
      deadlines: [
        { label: "MVP", date: "2026-05-19", priority: "alta" },
        { label: "Beta privada", date: "2026-05-05", priority: "media" },
      ],
      risks: [
        "Contrato de onboarding sin version final",
        "Scope creep por requerimientos comerciales nuevos",
      ],
    },
    roleContexts: {
      [ROLES.DESIGN]: {
        role: ROLES.DESIGN,
        impact: "Sistema visual estable, onboarding requiere refinamiento",
        tasks: [
          "Revisar flujo de wizard de alta",
          "Alinear componentes con reglas base",
        ],
        blockers: [],
        dependencies: ["PO para prioridades de activacion"],
        artifacts: ["Design checklist v1"],
      },
      [ROLES.BACKEND]: {
        role: ROLES.BACKEND,
        impact: "API de onboarding parcial",
        tasks: ["Definir entidad MerchantDraft", "Validar contrato inicial de registro"],
        blockers: [],
        dependencies: ["PO para campos obligatorios de negocio"],
        artifacts: ["OpenAPI draft onboarding v0.3"],
      },
      [ROLES.FRONTEND]: {
        role: ROLES.FRONTEND,
        impact: "Wizard funcional al 60%",
        tasks: ["Completar paso de datos de comercio", "Conectar validaciones cliente-servidor"],
        blockers: ["Espera confirmacion final de contrato"],
        dependencies: ["Backend para endpoint estable"],
        artifacts: ["Mapa de pantallas onboarding"],
      },
      [ROLES.PM]: {
        role: ROLES.PM,
        impact: "Cronograma ajustado y sensible a cambios",
        tasks: ["Actualizar seguimiento semanal", "Mitigar riesgo de dependencia API"],
        blockers: [],
        dependencies: ["Backend + Frontend para estimaciones cerradas"],
        artifacts: ["Plan MVP semana actual"],
      },
      [ROLES.PO]: {
        role: ROLES.PO,
        impact: "Foco en activacion del onboarding",
        tasks: ["Refinar prioridades del backlog", "Validar alcance del MVP"],
        blockers: [],
        dependencies: ["PM para capacidad del sprint"],
        artifacts: ["Prioridad roadmap Q2"],
      },
    },
    timeline: [],
    decisions: [
      {
        id: "seed-decision-1",
        timestamp: "2026-04-07T10:00:00.000Z",
        title: "Apostar por MVP de onboarding",
        summary: "Se define onboarding como nucleo del MVP y analytics queda en fase posterior.",
      },
    ],
    traces: [],
    eventCatalog: EVENT_CATALOG,
  };
}

module.exports = {
  EVENT_CATALOG,
  createInitialProjectState,
};
