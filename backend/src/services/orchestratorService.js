const { processEvent } = require("../orchestrator/orchestratorEngine");

class OrchestratorService {
  constructor(mode = "demo") {
    this.mode = mode;
  }

  /**
   * Punto unico para cambiar de modo "demo" a proveedor IA real.
   * Aqui luego se puede conectar OpenAI, Ollama u otro motor.
   */
  handleEvent(state, event, lang = "es") {
    if (this.mode === "demo") {
      return processEvent(state, event, lang);
    }

    // AI-ready mode (interfaz preparada):
    // return this.handleEventWithLLM(state, event)
    return processEvent(state, event, lang);
  }
}

module.exports = {
  OrchestratorService,
};
