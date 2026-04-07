const { ROLES } = require("../domain/roles");

function pushUnique(list, value) {
  if (!list.includes(value)) {
    list.unshift(value);
  }
}

function prependWithLimit(list, value, limit = 6) {
  list.unshift(value);
  if (list.length > limit) {
    list.length = limit;
  }
}

function applyEventRules(state, event) {
  const updates = [];
  const { roleContexts, globalContext } = state;
  const { payload } = event;

  switch (event.type) {
    case "priority_change": {
      prependWithLimit(
        roleContexts[ROLES.PO].tasks,
        `Reordenar backlog: ${payload.message}`
      );
      prependWithLimit(
        roleContexts[ROLES.PM].tasks,
        "Reestimar plan semanal por nueva prioridad P1"
      );
      prependWithLimit(
        roleContexts[ROLES.FRONTEND].tasks,
        "Concentrar sprint en wizard de onboarding"
      );
      roleContexts[ROLES.PO].impact = "Prioridad maxima en onboarding";
      roleContexts[ROLES.PM].impact = "Cronograma reordenado por prioridad de negocio";
      updates.push("Se desplaza trabajo no critico para priorizar onboarding.");
      break;
    }
    case "design_rule_change": {
      pushUnique(globalContext.designRules, payload.message);
      prependWithLimit(
        roleContexts[ROLES.DESIGN].tasks,
        "Publicar guideline de stepper + validacion inline"
      );
      prependWithLimit(
        roleContexts[ROLES.FRONTEND].tasks,
        "Actualizar formularios a patron stepper con feedback inline"
      );
      prependWithLimit(
        roleContexts[ROLES.BACKEND].tasks,
        "Alinear mensajes de error para validaciones inline"
      );
      roleContexts[ROLES.DESIGN].impact = "Regla visual transversal incorporada";
      updates.push("La experiencia de formularios se estandariza para todo el producto.");
      break;
    }
    case "deadline_change": {
      const mvp = globalContext.deadlines.find((d) => d.label === "MVP");
      if (mvp) {
        const date = new Date(mvp.date);
        date.setDate(date.getDate() + payload.offsetDays);
        mvp.date = date.toISOString().slice(0, 10);
      }
      prependWithLimit(roleContexts[ROLES.PM].tasks, "Ejecutar plan de compresion del alcance");
      prependWithLimit(roleContexts[ROLES.PO].tasks, "Recortar features no criticas del MVP");
      prependWithLimit(roleContexts[ROLES.BACKEND].tasks, "Bloquear alcance tecnico para fecha adelantada");
      prependWithLimit(roleContexts[ROLES.FRONTEND].tasks, "Priorizar happy path y reducir deuda visible");
      pushUnique(globalContext.risks, "Deadline comprimido aumenta riesgo de retrabajo");
      updates.push("Se adelanta la entrega y se activa una estrategia de scope controlado.");
      break;
    }
    case "api_contract_change": {
      prependWithLimit(
        roleContexts[ROLES.BACKEND].tasks,
        `Versionar contrato ${payload.endpoint} con campo ${payload.newField}`
      );
      prependWithLimit(
        roleContexts[ROLES.FRONTEND].tasks,
        `Agregar campo ${payload.newField} en formulario de registro`
      );
      prependWithLimit(
        roleContexts[ROLES.DESIGN].tasks,
        `Definir UX para nuevo campo ${payload.newField}`
      );
      prependWithLimit(
        roleContexts[ROLES.PM].tasks,
        "Monitorear impacto de cambio de contrato en el sprint"
      );
      roleContexts[ROLES.BACKEND].impact = "Contrato API evolucionado para onboarding";
      pushUnique(globalContext.risks, "Cambios de contrato pueden bloquear integracion frontend");
      updates.push("El cambio de contrato afecta diseno de formulario, backend y planificacion.");
      break;
    }
    case "frontend_blocker": {
      pushUnique(roleContexts[ROLES.FRONTEND].blockers, payload.message);
      prependWithLimit(roleContexts[ROLES.PM].tasks, "Escalar bloqueo de frontend y definir owner");
      prependWithLimit(roleContexts[ROLES.BACKEND].tasks, "Cerrar contrato onboarding y publicar version");
      prependWithLimit(roleContexts[ROLES.PO].tasks, "Priorizar desbloqueo de onboarding sobre features nuevas");
      roleContexts[ROLES.FRONTEND].impact = "Entrega frontend en riesgo por dependencia API";
      updates.push("Bloqueo operativo detectado con dependencia cruzada Backend-Frontend.");
      break;
    }
    case "business_goal_addition": {
      pushUnique(globalContext.businessGoals, payload.goal);
      prependWithLimit(
        roleContexts[ROLES.PO].tasks,
        "Traducir nuevo objetivo en KPIs y criterios de aceptacion"
      );
      prependWithLimit(
        roleContexts[ROLES.DESIGN].tasks,
        "Reducir friccion visual en pasos de alta"
      );
      prependWithLimit(
        roleContexts[ROLES.BACKEND].tasks,
        "Exponer eventos de activacion para medir conversion"
      );
      prependWithLimit(
        roleContexts[ROLES.FRONTEND].tasks,
        "Instrumentar tracking de abandono en wizard"
      );
      updates.push("Nuevo objetivo de negocio baja al backlog tecnico y de experiencia.");
      break;
    }
    default:
      updates.push("Evento sin regla especifica, se mantiene estado.");
  }

  return updates;
}

module.exports = {
  applyEventRules,
};
