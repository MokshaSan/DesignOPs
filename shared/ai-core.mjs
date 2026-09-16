import { buildingContext } from "./building.mjs";
import { beaconDirectory, directionsForQuery } from "./beacons.mjs";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export function aiEnabled() {
  return Boolean(process.env.OPENAI_API_KEY);
}

async function callOpenAI({ system, user, json = false, max_tokens = 320 }) {
  const key = process.env.OPENAI_API_KEY || "";
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.35,
        max_tokens,
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
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[ai] OpenAI request failed", err?.message || err);
    return null;
  }
}

function safeJsonParse(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    const match = str.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function fallbackScene(prompt, devices) {
  const p = (prompt || "").toLowerCase();
  const has = (...words) => words.some((w) => new RegExp(`\\b${w}\\b`).test(p));
  const byKind = (kind) => devices.filter((d) => d.kind === kind);
  const actions = [];
  if (has("movie", "film", "cinema")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Dim to 20%", power: true, value: 20 }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Close", power: false }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 23°C", power: true, value: 23 }));
    return { name: "Movie Night", reasoning: "Low light and a comfortable temperature for watching.", actions };
  }
  if (has("sleep", "night", "bed", "bedtime")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Off", power: false }));
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Close", power: false }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 24°C", power: true, value: 24 }));
    byKind("door").forEach((d) => actions.push({ deviceId: d.id, action: "Lock", power: true }));
    return { name: "Sleep Mode", reasoning: "Lights off, door locked, cooler sleep temperature.", actions };
  }
  if (has("morning", "wake")) {
    byKind("curtain").forEach((d) => actions.push({ deviceId: d.id, action: "Open", power: true }));
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "On at 70%", power: true, value: 70 }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 25°C", power: true, value: 25 }));
    return { name: "Good Morning", reasoning: "Open curtains and gentle light to start the day.", actions };
  }
  if (has("leaving", "leave", "away", "out")) {
    byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "Off", power: false }));
    byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Off", power: false }));
    byKind("door").forEach((d) => actions.push({ deviceId: d.id, action: "Lock", power: true }));
    return { name: "Leaving Home", reasoning: "Power down and lock while you are out.", actions };
  }
  byKind("light").forEach((d) => actions.push({ deviceId: d.id, action: "On at 60%", power: true, value: 60 }));
  byKind("ac").forEach((d) => actions.push({ deviceId: d.id, action: "Set to 24°C", power: true, value: 24 }));
  return { name: "Custom Scene", reasoning: "A comfortable default based on your request.", actions };
}

function originForRole(role, unit) {
  if (role === "visitor") return "lobby";
  const u = String(unit || "").toUpperCase();
  if (u.includes("W002") || u.includes("002")) return "w002";
  if (u.includes("W003") || u.includes("003")) return "w003";
  if (u.includes("W001") || u.includes("001")) return "w001";
  return "w001";
}

function fallbackAssistant(message, role, unit) {
  const routed = directionsForQuery(message, originForRole(role, unit));
  if (routed) return routed.text;
  return "I can walk you through The Meridian using indoor Beacons — try “where’s the gym?”, “how do I get to W002?”, or “visitor parking”.";
}

export async function handleAi(route, body = {}) {
  if (route === "health") {
    return { status: 200, json: { ok: true, aiEnabled: aiEnabled(), model: OPENAI_MODEL } };
  }

  if (route === "scene") {
    const { prompt, devices = [] } = body;
    const deviceList = devices.map((d) => `${d.id} :: ${d.name} (${d.kind}, ${d.room})`).join("\n");
    const system = `You translate a resident's request into a JSON scene. ONLY use device ids from the list. JSON: {"name": string, "actions": [{"deviceId": string, "action": string, "power": boolean, "value": number|null}], "reasoning": string}`;
    const raw = await callOpenAI({ system, user: `Request: "${prompt}"\nDevices:\n${deviceList}`, json: true });
    const parsed = safeJsonParse(raw);
    if (parsed && Array.isArray(parsed.actions)) {
      const validIds = new Set(devices.map((d) => d.id));
      return {
        status: 200,
        json: {
          name: parsed.name || "AI Scene",
          actions: parsed.actions.filter((a) => validIds.has(a.deviceId)),
          reasoning: parsed.reasoning || "Generated from your request.",
          source: "ai",
        },
      };
    }
    return { status: 200, json: { ...fallbackScene(prompt, devices), source: "fallback" } };
  }

  if (route === "assistant") {
    const { message, role = "resident", unit, floorPlan } = body;
    const origin = originForRole(role, unit);
    const routed = directionsForQuery(message, origin);
    const livePlan = Array.isArray(floorPlan?.amenities)
      ? floorPlan.amenities.map((a) => `- ${a.name} — ${a.levelCode || a.level}. Hours: ${a.hours || "see lobby"}.`).join("\n")
      : "";
    const facts = livePlan
      ? `Property: The Meridian, Tower A.\nUnit: ${unit || "W001"}.\nAmenities:\n${livePlan}`
      : buildingContext();
    const system = `You are Nestura, the building AI for Nestura Smart Living. You help a ${role}. Indoor wayfinding uses Beacon nodes (BLE markers in corridors). Always give numbered Beacon steps when asked where something is. Current origin Beacon: ${origin}. Unit codes are W001, W002, W003 — never invent other apartment names if the user uses those codes.
If the Beacon router already produced a route, rewrite it warmly but keep every step.
Use ONLY the facts below plus the Beacon directory.

BEACON DIRECTORY:
${beaconDirectory()}

${routed ? `PRECOMPUTED ROUTE:\n${routed.text}` : ""}

BUILDING FACTS:
${facts}`;
    const raw = await callOpenAI({ system, user: message, json: false, max_tokens: 400 });
    if (raw) return { status: 200, json: { reply: raw.trim(), source: "ai", route: routed?.steps || null } };
    return { status: 200, json: { reply: fallbackAssistant(message, role, unit), source: "fallback", route: routed?.steps || null } };
  }

  if (route === "energy-insight") {
    const { today = [], week = [] } = body;
    const totalToday = today.reduce((s, p) => s + p.kwh, 0).toFixed(1);
    const totalWeek = week.reduce((s, p) => s + p.kwh, 0).toFixed(1);
    const system = `Energy insights for a smart apartment. JSON: {"insight": string, "recommendation": string, "contributorPct": number}. Each string under 30 words.`;
    const user = `Today hourly: ${JSON.stringify(today)} total ${totalToday} kWh. Week: ${JSON.stringify(week)} total ${totalWeek} kWh.`;
    const raw = await callOpenAI({ system, user, json: true });
    const parsed = safeJsonParse(raw);
    if (parsed) return { status: 200, json: { ...parsed, source: "ai" } };
    return {
      status: 200,
      json: {
        insight: "Evening AC is the largest share of today's use, especially 6–10 PM.",
        recommendation: "Raise the living-room setpoint 1°C when the unit is empty.",
        contributorPct: 48,
        source: "fallback",
      },
    };
  }

  if (route === "maintenance-insight") {
    const { device } = body;
    const system = `Predictive maintenance. JSON: {"risk": "low"|"medium"|"high"|"critical", "reasoning": string, "recommendation": string}.`;
    const raw = await callOpenAI({ system, user: `Telemetry: ${JSON.stringify(device)}`, json: true });
    const parsed = safeJsonParse(raw);
    if (parsed) return { status: 200, json: { ...parsed, source: "ai" } };
    const battery = device?.battery ?? 100;
    const errors = device?.errorCount ?? 0;
    const risk = battery < 20 || errors > 3 ? "high" : errors > 1 ? "medium" : "low";
    return {
      status: 200,
      json: {
        risk,
        reasoning: `Battery ${battery}% with ${errors} recent errors.`,
        recommendation: "Schedule a technician within 7 days.",
        source: "fallback",
      },
    };
  }

  if (route === "automation-suggest") {
    const { activityLog = [] } = body;
    const system = `Suggest ONE automation. JSON: {"name": string, "trigger": string, "reasoning": string, "confidence": number}.`;
    const user = `Unit ${body.unit || "home"}. Context: ${body.context || "routines"}. Activity: ${JSON.stringify(activityLog.slice(0, 20))}`;
    const raw = await callOpenAI({ system, user, json: true });
    const parsed = safeJsonParse(raw);
    if (parsed) return { status: 200, json: { ...parsed, source: "ai" } };
    return {
      status: 200,
      json: {
        name: "Evening Arrival",
        trigger: "Resident arrives home 18:00–19:00",
        reasoning: "Lights and AC come on within minutes of arrival on weekdays.",
        confidence: 91,
        source: "fallback",
      },
    };
  }

  if (route === "suggest") {
    const { role = "resident", activityLog = [], devices = [], visitors = [], alerts = [] } = body;
    const system = `You are Nestura. ONE timely suggestion for a ${role}. JSON: {"suggestion": string}. Under 45 words. Use the live data.`;
    const user = `Activity: ${JSON.stringify(activityLog.slice(0, 8))}\nDevices: ${JSON.stringify(devices.slice(0, 8))}\nVisitors: ${JSON.stringify(visitors.slice(0, 6))}\nAlerts: ${JSON.stringify(alerts.slice(0, 4))}`;
    const raw = await callOpenAI({ system, user, json: true });
    const parsed = safeJsonParse(raw);
    if (parsed?.suggestion) return { status: 200, json: { suggestion: parsed.suggestion, source: "ai" } };
    if (alerts[0]) {
      return { status: 200, json: { suggestion: `Open ${alerts[0].severity} alert: ${alerts[0].title}. Verify, then acknowledge.`, source: "fallback" } };
    }
    const pending = visitors.find((v) => v.status === "pending");
    if (pending) {
      return { status: 200, json: { suggestion: `${pending.name} is waiting on access for ${pending.unitId}. Grant a timed window if you expect them.`, source: "fallback" } };
    }
    return {
      status: 200,
      json: {
        suggestion: activityLog[0]?.text
          ? `Latest activity: ${activityLog[0].text}. I can turn repeating steps into an automation.`
          : "Ask Nestura for Beacon directions, or draft a scene from the corner assistant.",
        source: "fallback",
      },
    };
  }

  if (route === "analytics") {
    const { energyWeek = [], devices = [], visitors = [], alerts = [] } = body;
    const system = `You are Nestura portfolio analytics. JSON: {"headline": string, "bullets": string[], "risk": string}. Max 4 bullets. Be specific to the numbers.`;
    const user = `Weekly kWh: ${JSON.stringify(energyWeek)}\nDevice statuses: ${JSON.stringify(devices.slice(0, 20))}\nVisitors: ${JSON.stringify(visitors.slice(0, 10))}\nAlerts: ${JSON.stringify(alerts.slice(0, 8))}`;
    const raw = await callOpenAI({ system, user, json: true, max_tokens: 280 });
    const parsed = safeJsonParse(raw);
    if (parsed?.headline) return { status: 200, json: { ...parsed, source: "ai" } };
    const warn = devices.filter((d) => d.status === "warning" || d.status === "offline").length;
    return {
      status: 200,
      json: {
        headline: `${warn} devices need a check; visitor traffic is the other live signal this week.`,
        bullets: [
          "Focus technician time on warning sensors before they go offline.",
          "Pending visitor grants slow the lobby — keep windows short and Beacon-guided.",
          "Evening kWh is the savings lever if AC setpoints rise 1°C.",
        ],
        risk: warn > 3 ? "elevated" : "steady",
        source: "fallback",
      },
    };
  }

  return { status: 404, json: { error: `Unknown AI route: ${route}` } };
}
