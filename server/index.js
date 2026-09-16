import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleAi, aiEnabled } from "../shared/ai-core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
for (const file of [path.join(__dirname, ".env"), path.join(root, ".env"), path.join(root, ".env.local")]) {
  dotenv.config({ path: file, override: true });
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8787;

async function send(route, req, res) {
  const out = await handleAi(route, req.body || {});
  res.status(out.status).json(out.json);
}

app.get("/api/health", (_req, res) => send("health", _req, res));
app.post("/api/health", (_req, res) => send("health", _req, res));
app.all("/api/ai/:route", async (req, res) => {
  await send(req.params.route, req, res);
});

app.listen(PORT, () => {
  console.log(`[ai-server] listening on http://localhost:${PORT} (aiEnabled=${aiEnabled()} model=${process.env.OPENAI_MODEL || "gpt-4o-mini"})`);
});
