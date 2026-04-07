const express = require("express");
const cors = require("cors");
const projectRoutes = require("./routes/projectRoutes");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true, service: "ai-project-orchestrator-backend" });
  });

  app.use("/api", projectRoutes);

  return app;
}

module.exports = { createApp };
