const express = require("express");
const {
  getProjectState,
  listTimeline,
  triggerEvent,
  resetDemo,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/project-state", getProjectState);
router.get("/events", listTimeline);
router.post("/events/trigger", triggerEvent);
router.post("/reset", resetDemo);

module.exports = router;
