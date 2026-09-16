import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleAi, aiEnabled } from "../shared/ai-core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8787;

app.get("/api/health", async (_req, res) => {
  const out = await handleAi("health", {});
  res.status(out.status).json(out.json);
});

app.all("/api/ai/:route", async (req, res) => {
  const out = await handleAi(req.params.route, req.body || {});
  res.status(out.status).json(out.json);
});

app.listen(PORT, () => {
  console.log(`[ai-server] listening on http://localhost:${PORT} (aiEnabled=${aiEnabled()})`);
});
