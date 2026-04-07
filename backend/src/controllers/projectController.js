const { ProjectStateService } = require("../services/projectStateService");

const projectStateService = new ProjectStateService();

function getProjectState(req, res) {
  res.json(projectStateService.getState());
}

function listTimeline(req, res) {
  res.json(projectStateService.listEvents());
}

function triggerEvent(req, res) {
  const { eventTemplateId, lang = "es" } = req.body;
  const result = projectStateService.triggerEvent(eventTemplateId, lang);
  if (!result) {
    return res.status(404).json({ error: "Evento no encontrado en el catalogo" });
  }
  return res.json(result);
}

function resetDemo(req, res) {
  projectStateService.reset();
  res.json({
    ok: true,
    state: projectStateService.getState(),
  });
}

module.exports = {
  getProjectState,
  listTimeline,
  triggerEvent,
  resetDemo,
};
