import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { buildingContext } from "./buildingMap.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const PORT = process.env.PORT || 8787;
const HAS_KEY = Boolean(OPENAI_API_KEY);

if (!HAS_KEY) {
  console.warn("[ai] OPENAI_API_KEY not set — running in fallback/offline mode. AI endpoints will return canned demo responses.");
}

async function callOpenAI({ system, user, json = false }) {
  if (!HAS_KEY) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.35,
        max_tokens: 220,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        ...(json ? { response_format: { type: "json_object" } } : {}),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[ai] OpenAI error", res.status, text.slice(0, 300));
      return null;
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    return content ?? null;
  } catch (err) {
    console.error("[ai] OpenAI request failed", err.message);
    return null;
  }
}

function safeJsonParse(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    const match = str.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiEnabled: HAS_KEY, model: OPENAI_MODEL });
});

/**
 * Natural-language scene builder.
 * Input: { prompt, devices: [{id, name, kind, room}] }
 * Output: { name, actions: [{deviceId, action, power, value}], reasoning, source }
 * The LLM is constrained to only reference the device ids we hand it — the
 * result is re-validated against that list server-side before being sent
 * back, so a hallucinated device can never reach the automation engine.
 */
app.post("/api/ai/scene", async (req, res) => {
  const { prompt, devices = [] } = req.body || {};
  const deviceList = devices.map((d) => `${d.id} :: ${d.name} (${d.kind}, ${d.room})`).join("\n");

  const system = `You are the scene-generation engine for a John Keells Smart Living apartment. You translate a resident's natural-language request into a strict JSON automation scene. You may ONLY reference device ids from the provided list — never invent a device. Respond with JSON only, no prose, matching this shape exactly:
{"name": string, "actions": [{"deviceId": string, "action": string, "power": boolean, "value": number|null}], "reasoning": string}
"action" is a short human-readable label like "Dim to 20%" or "Lock". Keep reasoning to 1-2 sentences explaining how you interpreted the request.`;

  const user = `Resident request: "${prompt}"\n\nAvailable devices:\n${deviceList}`;

  const raw = await callOpenAI({ system, user, json: true });
  const parsed = safeJsonParse(raw);

  if (parsed && Array.isArray(parsed.actions)) {
    const validIds = new Set(devices.map((d) => d.id));
    const validated = parsed.actions.filter((a) => validIds.has(a.deviceId));
    return res.json({
      name: parsed.name || "AI Scene",
      actions: validated,
      reasoning: parsed.reasoning || "Generated from your request.",
      source: "ai",
    });
  }

  // Deterministic fallback so the demo never breaks if the API is unreachable.
  const fallback = fallbackScene(prompt, devices);
  res.json({ ...fallback, source: "fallback" });
});

function fallbackScene(prompt, devices) {
  const p = prompt.toLowerCase();
  const has = (...words) => words.some((w) => new RegExp(`\\b${w}\\b`).test(p));
  const byKind = (kind) => devices.filter((d) => d.kind === kind);
  const actions = [];

  if (has("movie", "film", "cinema")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Dim to 20%", power: true, value: 20 }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Close", power: false }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 23°C", power: true, value: 23 }));
    return { name: "Movie Night", reasoning: "Low-light environment with a comfortable temperature and closed curtains for movie watching.", actions };
  }
  if (has("sleep", "night", "bed", "bedtime")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Off", power: false }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Close", power: false }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 24°C", power: true, value: 24 }));
    byKind("door").forEach((d) => actions.push({ deviceId: d.id, action: "Lock", power: true }));
    return { name: "Sleep Mode", reasoning: "Lights off, doors locked, and a cooler comfortable temperature for sleeping.", actions };
  }
  if (has("morning", "wake")) {
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Open", power: true }));
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "On at 70%", power: true, value: 70 }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 25°C", power: true, value: 25 }));
    return { name: "Good Morning", reasoning: "Gentle light and open curtains to start the day, temperature eased up slightly.", actions };
  }
  if (has("leaving", "leave", "away", "out")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Off", power: false }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Off", power: false }));
    byKind("door").forEach((d) => actions.push({ deviceId: d.id, action: "Lock", power: true }));
    return { name: "Leaving Home", reasoning: "Everything powers down and the door locks behind you to save energy while you're out.", actions };
  }
  if (has("guest", "guests", "party", "dinner", "host", "hosting", "visitor", "visitors")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "On at 65%", power: true, value: 65 }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Open", power: true }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 23°C", power: true, value: 23 }));
    byKind("door").forEach((d) => actions.push({ deviceId: d.id, action: "Unlock", power: false }));
    return { name: "Guests Arriving", reasoning: "Warm, welcoming lighting and a comfortable temperature ready before guests arrive.", actions };
  }
  // generic comfortable default
  byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "On at 60%", power: true, value: 60 }));
  byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 24°C", power: true, value: 24 }));
  return { name: "Custom Scene", reasoning: "A balanced, comfortable default based on your request.", actions };
}

/**
 * Building assistant — grounded with the property's floor directory and
 * amenity directions so answers about "where's the gym" etc. are accurate
 * rather than hallucinated.
 */
app.post("/api/ai/assistant", async (req, res) => {
  const { message, role = "resident" } = req.body || {};

  const system = `You are Aria, the AI concierge for ${"John Keells Smart Living"}. You help a ${role} with smart-home control questions, wayfinding around the building, amenities, bookings, and general building info. Use ONLY the building facts below — if asked about a location, give the floor and directions from the resident's apartment. Be warm, concise (2-4 sentences), and use plain text (no markdown headers). If asked to control a device, explain you can create a Scene for that in the Scene Builder rather than acting directly.\n\nBUILDING FACTS:\n${buildingContext()}`;

  const raw = await callOpenAI({ system, user: message, json: false });
  if (raw) return res.json({ reply: raw.trim(), source: "ai" });

  res.json({ reply: fallbackAssistant(message), source: "fallback" });
});

function fallbackAssistant(message) {
  const q = (message || "").toLowerCase();
  const facts = [
    { keys: ["gym", "fitness", "workout"], reply: "The Fitness Center & Gym is on Level 1. From your apartment, take the Tower A lift down to Level 1 — it's the first door on your right, next to the Yoga Studio. Open 5:00 AM – 11:00 PM." },
    { keys: ["pool", "swim"], reply: "The Infinity Pool & Sundeck is on the Rooftop (Level 21). Take the Tower A lift up to the roof — it's straight ahead as you exit the lift lobby. Open 6:00 AM – 10:00 PM." },
    { keys: ["parking", "car"], reply: "Resident parking is on Basement Level 1 (B1). Take the Tower A lift and select B1." },
    { keys: ["concierge", "lobby", "reception"], reply: "The Main Lobby & Concierge desk is on the Ground Floor, directly ahead of the main entrance. It's staffed 24/7." },
    { keys: ["mail", "parcel", "package"], reply: "The Mailroom & Parcel Room is on the Ground Floor, to the right of the main lobby, beside the Security Office." },
    { keys: ["coworking", "work", "study"], reply: "The Co-working Lounge is on Level 1, opposite the Kids' Play Zone. Open 6:00 AM – 12:00 AM." },
    { keys: ["guest", "visitor room"], reply: "Guest Suites are on Level 2, next to the Business Center & Meeting Rooms — booking through the front desk is required." },
  ];
  const hit = facts.find((f) => f.keys.some((k) => q.includes(k)));
  if (hit) return hit.reply;
  return "I can help with directions around The Meridian, your smart-home scenes, or visitor access — try asking me where something is, like \"where's the gym?\"";
}

/**
 * Energy insight — identifies the biggest contributor and a saving tip.
 */
app.post("/api/ai/energy-insight", async (req, res) => {
  const { today = [], week = [] } = req.body || {};
  const totalToday = today.reduce((s, p) => s + p.kwh, 0).toFixed(1);
  const totalWeek = week.reduce((s, p) => s + p.kwh, 0).toFixed(1);

  const system = `You are an energy-insights assistant for a smart apartment. Given hourly and weekly kWh data, identify the likely biggest contributor to consumption and give one concrete, specific saving recommendation. Respond with JSON only: {"insight": string, "recommendation": string, "contributorPct": number}. Keep each string under 30 words.`;
  const user = `Today's hourly kWh: ${JSON.stringify(today)}\nTotal today: ${totalToday} kWh\nWeekly kWh by day: ${JSON.stringify(week)}\nTotal week: ${totalWeek} kWh`;

  const raw = await callOpenAI({ system, user, json: true });
  const parsed = safeJsonParse(raw);
  if (parsed) return res.json({ ...parsed, source: "ai" });

  res.json({
    insight: "Your AC accounts for an estimated 48% of today's consumption, concentrated in the 6–10 PM evening window.",
    recommendation: "Raising the living room AC setpoint by 1°C during low-occupancy periods could reduce daily usage by roughly 8-10%.",
    contributorPct: 48,
    source: "fallback",
  });
});

/**
 * Predictive maintenance insight for a single device's telemetry.
 */
app.post("/api/ai/maintenance-insight", async (req, res) => {
  const { device } = req.body || {};

  const system = `You are a predictive-maintenance assistant for smart-building IoT devices. Given a device's telemetry, assess failure risk. Respond with JSON only: {"risk": "low"|"medium"|"high"|"critical", "reasoning": string, "recommendation": string}. Keep reasoning and recommendation each under 25 words.`;
  const user = `Device telemetry: ${JSON.stringify(device)}`;

  const raw = await callOpenAI({ system, user, json: true });
  const parsed = safeJsonParse(raw);
  if (parsed) return res.json({ ...parsed, source: "ai" });

  const battery = device?.battery ?? 100;
  const errors = device?.errorCount ?? 0;
  const risk = battery < 20 || errors > 3 ? "high" : errors > 1 ? "medium" : "low";
  res.json({
    risk,
    reasoning: `Battery at ${battery}% with ${errors} recent errors and rising response latency.`,
    recommendation: "Schedule a technician visit within 7 days to inspect or replace the unit.",
    source: "fallback",
  });
});

/**
 * Automation pattern suggestion from a simple activity log.
 */
app.post("/api/ai/automation-suggest", async (req, res) => {
  const { activityLog = [] } = req.body || {};

  const system = `You detect recurring resident behavior patterns from an activity log and suggest ONE automation. Respond with JSON only: {"name": string, "trigger": string, "reasoning": string, "confidence": number}. confidence is 0-100.`;
  const user = `Activity log (most recent first): ${JSON.stringify(activityLog.slice(0, 20))}`;

  const raw = await callOpenAI({ system, user, json: true });
  const parsed = safeJsonParse(raw);
  if (parsed) return res.json({ ...parsed, source: "ai" });

  res.json({
    name: "Evening Arrival",
    trigger: "Resident arrives home between 18:00–19:00",
    reasoning: "You've manually turned on the living room lights and AC within minutes of arriving home on 4 of the last 5 weekdays.",
    confidence: 91,
    source: "fallback",
  });
});

app.listen(PORT, () => {
  console.log(`[ai-server] listening on http://localhost:${PORT} (aiEnabled=${HAS_KEY})`);
});
