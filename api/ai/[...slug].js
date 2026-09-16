import { handleAi } from "../../shared/ai-core.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  const parts = [].concat(req.query.slug || []);
  const route = parts.join("/") || (req.method === "GET" ? "health" : "");
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const out = await handleAi(route, body || {});
  res.status(out.status).json(out.json);
}
