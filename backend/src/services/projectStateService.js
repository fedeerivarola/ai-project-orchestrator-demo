const { createInitialProjectState } = require("../mock/seedData");
const { OrchestratorService } = require("./orchestratorService");

class ProjectStateService {
  constructor() {
    this.orchestrator = new OrchestratorService("demo");
    this.reset();
  }

  reset() {
    this.state = createInitialProjectState();
  }

  getState() {
    return this.state;
  }

  listEvents() {
    return this.state.timeline;
  }

  triggerEvent(eventTemplateId, lang = "es") {
    const template = this.state.eventCatalog.find((item) => item.id === eventTemplateId);
    if (!template) {
      return null;
    }

    const event = {
      ...template,
      instanceId: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    this.state.timeline.unshift(event);
    this.state.timeline = this.state.timeline.slice(0, 40);

    const result = this.orchestrator.handleEvent(this.state, event, lang);
    this.state.decisions.unshift(result.decision);
    this.state.decisions = this.state.decisions.slice(0, 20);
    this.state.traces.unshift(result.trace);
    this.state.traces = this.state.traces.slice(0, 20);

    return {
      event,
      decision: result.decision,
      trace: result.trace,
      artifacts: result.artifacts,
      notifications: result.notifications,
      affectedRoles: result.affectedRoles,
      state: this.state,
    };
  }
}

module.exports = {
  ProjectStateService,
};
