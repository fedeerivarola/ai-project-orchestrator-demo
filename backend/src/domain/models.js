/**
 * Modelos base para la demo:
 * - ProjectContext
 * - RoleContext
 * - Event
 * - Decision
 * - Artifact
 * - Task
 *
 * Se mantienen como estructura JSON simple para velocidad de demo.
 */

function createTask(title, priority = "media") {
  return { title, priority };
}

function createArtifact(title, type, ownerRole) {
  return { title, type, ownerRole };
}

module.exports = {
  createTask,
  createArtifact,
};
