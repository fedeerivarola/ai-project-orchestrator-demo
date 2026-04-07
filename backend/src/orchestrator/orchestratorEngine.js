const { ROLE_LABELS } = require("../domain/roles");
const { applyEventRules } = require("./eventProcessors");

function buildRoleImpactSummary(roleContexts) {
  return Object.values(roleContexts).map((roleData) => ({
    role: roleData.role,
    roleLabel: ROLE_LABELS[roleData.role],
    impact: roleData.impact,
    blockers: roleData.blockers.slice(0, 2),
  }));
}

function buildArtifacts(state, event) {
  const eventName = event.title;
  return [
    {
      id: `artifact-${Date.now()}-api`,
      type: "spec",
      ownerRole: "backend",
      title: `Delta spec por evento: ${eventName}`,
      description: "Documento de cambios para evitar drift entre frontend y backend.",
    },
    {
      id: `artifact-${Date.now()}-ux`,
      type: "ux",
      ownerRole: "design",
      title: `Checklist UX actualizado`,
      description: "Ajustes de experiencia segun impacto transversal del evento.",
    },
    {
      id: `artifact-${Date.now()}-plan`,
      type: "planning",
      ownerRole: "pm",
      title: "Mini-plan de ejecucion de impacto",
      description: "Secuencia de tareas y dependencias para absorber el cambio.",
    },
  ];
}

function getAffectedRolesByEvent(event) {
  switch (event.type) {
    case "priority_change":
      return ["po", "pm", "frontend"];
    case "design_rule_change":
      return ["design", "frontend", "backend"];
    case "deadline_change":
      return ["pm", "po", "backend", "frontend"];
    case "api_contract_change":
      return ["backend", "frontend", "design", "pm"];
    case "frontend_blocker":
      return ["frontend", "pm", "backend", "po"];
    case "business_goal_addition":
      return ["po", "design", "backend", "frontend"];
    default:
      return ["pm"];
  }
}

function buildNotifications(event, decision, trace, affectedRoles, lang = "es") {
  const roleLabels = affectedRoles
    .map((role) => ROLE_LABELS[role])
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  const notificationsByLang = {
    es: {
      eventTitle: "Cambio aplicado",
      impactTitle: "Impacto en equipo",
      impactMessage: `${roleLabels} quedaron alineados en el nuevo plan de entrega.`,
      traceTitle: "Entrega ajustada",
      traceSuffix: "Plan de ejecucion actualizado.",
      decisionTitle: "Decision registrada",
      successTitle: "Plan listo para ejecutar",
      successMessage: "Las prioridades quedaron actualizadas con responsables por rol.",
    },
    en: {
      eventTitle: "Change applied",
      impactTitle: "Team impact",
      impactMessage: `${roleLabels} aligned to the updated delivery plan.`,
      traceTitle: "Delivery adjusted",
      traceSuffix: "Execution plan updated.",
      decisionTitle: "Decision logged",
      successTitle: "Plan ready to execute",
      successMessage: "Priorities are now clear with owners per role.",
    },
  };
  const copy = notificationsByLang[lang] || notificationsByLang.es;

  return [
    {
      id: `notif-${Date.now()}-event`,
      type: "info",
      title: copy.eventTitle,
      message: event.payload.message,
    },
    {
      id: `notif-${Date.now()}-impact`,
      type: "impact",
      title: copy.impactTitle,
      message: copy.impactMessage,
    },
    {
      id: `notif-${Date.now()}-trace`,
      type: "warning",
      title: copy.traceTitle,
      message: `${trace.crossImpactSummary.slice(0, 90)} ${copy.traceSuffix}`,
    },
    {
      id: `notif-${Date.now()}-decision`,
      type: "decision",
      title: copy.decisionTitle,
      message: decision.summary,
    },
    {
      id: `notif-${Date.now()}-success`,
      type: "success",
      title: copy.successTitle,
      message: copy.successMessage,
    },
  ];
}

function buildProductDecision(event, lang = "es") {
  const decisionMap = {
    es: {
      priority_change: {
        title: "Onboarding pasa a ser el eje del MVP",
        summary: "Plan de entrega ajustado para priorizar resultados de activacion.",
      },
      design_rule_change: {
        title: "Una regla UX unifica todos los formularios de onboarding",
        summary: "Diseno y frontend se alinean para un flujo mas rapido y con menos friccion.",
      },
      deadline_change: {
        title: "Se acorta la ventana de entrega para proteger el impulso del MVP",
        summary: "Alcance y ejecucion se rebalancean para llegar a la nueva fecha objetivo.",
      },
      api_contract_change: {
        title: "Frontend y backend quedan alineados en la finalizacion de onboarding",
        summary: "El cambio de contrato se tradujo en actualizaciones claras para la entrega.",
      },
      frontend_blocker: {
        title: "Dependencia critica escalada para proteger la confianza del release",
        summary: "El equipo prioriza desbloquear onboarding y restaurar el flujo de entrega.",
      },
      business_goal_addition: {
        title: "La activacion pasa a ser objetivo central de la estrategia MVP",
        summary: "Las prioridades ahora reflejan impacto en conversion, no solo volumen de features.",
      },
      default: {
        title: "Prioridades de ejecucion actualizadas por el orquestador",
        summary: "Se refresco el plan cross-team para mantener alineada la entrega.",
      },
    },
    en: {
      priority_change: {
        title: "Onboarding becomes the primary delivery track for the MVP",
        summary: "Delivery plan adjusted to prioritize activation outcomes.",
      },
      design_rule_change: {
        title: "A single UX rule now guides all onboarding forms",
        summary: "Frontend and design align on a faster, lower-friction completion flow.",
      },
      deadline_change: {
        title: "Delivery window tightened to protect MVP launch momentum",
        summary: "Scope and execution were rebalanced to hit the new target date.",
      },
      api_contract_change: {
        title: "Frontend and backend efforts are now aligned around onboarding completion",
        summary: "Contract changes were translated into clear updates for product delivery.",
      },
      frontend_blocker: {
        title: "Critical dependency escalated to protect release confidence",
        summary: "Team focus shifted to unblock onboarding and restore delivery flow.",
      },
      business_goal_addition: {
        title: "Activation became a primary outcome in the MVP strategy",
        summary: "Priorities now reflect conversion impact, not only feature throughput.",
      },
      default: {
        title: "Execution priorities updated by the orchestrator",
        summary: "Cross-team plan refreshed to keep product delivery aligned.",
      },
    },
  };
  const selected = decisionMap[lang] || decisionMap.es;
  return selected[event.type] || selected.default;
}

function processEvent(state, event, lang = "es") {
  const updates = applyEventRules(state, event);
  const timestamp = new Date().toISOString();
  const affectedRoles = getAffectedRolesByEvent(event);

  const productDecision = buildProductDecision(event, lang);
  const decision = {
    id: `decision-${Date.now()}`,
    timestamp,
    title: productDecision.title,
    summary: productDecision.summary,
  };

  const artifacts = buildArtifacts(state, event);
  artifacts.forEach((artifact) => {
    const targetRole = state.roleContexts[artifact.ownerRole];
    if (targetRole) {
      targetRole.artifacts.unshift(artifact.title);
      targetRole.artifacts = targetRole.artifacts.slice(0, 6);
    }
  });

  const trace = {
    id: `trace-${Date.now()}`,
    eventId: event.instanceId,
    timestamp,
    crossImpactSummary: updates.join(" "),
    impacts: buildRoleImpactSummary(state.roleContexts),
  };

  const notifications = buildNotifications(event, decision, trace, affectedRoles, lang);

  return {
    decision,
    trace,
    artifacts,
    notifications,
    affectedRoles,
  };
}

module.exports = {
  processEvent,
};
