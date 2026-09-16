# John Keells Smart Living OS

A working prototype of a role-based smart-living platform for **John Keells Properties** — built for a design/hackathon competition. Four experiences (Resident, Building Operator, Developer, Visitor) share one React + TypeScript codebase, with a real AI service layer, a simulated device fleet, and role-based access control.

> This is a concept prototype for a design competition — not an official John Keells product.

## What's real vs. simulated

- **Real**: the React/TS app, routing, role-based access control, the AI service layer (calls OpenAI via a local proxy server), the natural-language scene builder, predictive-maintenance and energy-insight AI calls, the building-wayfinding assistant.
- **Simulated**: the device fleet and telemetry (in-memory store, no physical hardware/MQTT broker), portfolio KPIs on the Developer dashboard (clearly labelled illustrative), payments/booking flows.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (light/dark theme via CSS variables — indigo/purple + white/gray in light mode, light-purple + near-black + dark blue in dark mode)
- Zustand for app state (acts as the "device simulator" backing store)
- React Router for role-based routing
- Framer Motion, Recharts, lucide-react, qrcode.react
- A small Express server (`/server`) that proxies OpenAI calls — **the API key never reaches the browser**

## Setup

```bash
npm install
```

Add your OpenAI key to `server/.env` (copy `.env.example`):

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
PORT=8787
```

If no key is present, every AI endpoint falls back to deterministic canned responses so the app (and any live demo) never breaks.

## Run

```bash
npm run dev
```

This starts the Vite dev server (http://localhost:5173) and the AI proxy server (http://localhost:8787) together. Vite proxies `/api/*` to the server.

## Structure

```
src/
  components/    ui primitives, layout shell, AI widgets, device/scene/visitor cards
  pages/         resident/, operator/, developer/, visitor/ route screens
  store/         zustand store — devices, scenes, automations, visitors, notifications...
  data/          seed data + the building/amenity map used to ground the AI assistant
  hooks/         useAI (calls the proxy), theme sync, simulated telemetry ticks
server/          Express AI proxy — scene generation, energy insight, predictive
                 maintenance, automation suggestion, building assistant
```

## Demo flow

1. Land on `/` → pick a role (Resident / Operator / Developer), or view a sample Visitor Pass.
2. **Resident**: dashboard → accept the AI's "Evening Arrival" automation suggestion → Scenes → "Create with AI" → describe a scene in plain English → Visitors → approve a request → QR pass.
3. **Operator**: Device Fleet → click a device → "Run AI Health Prediction" → Alerts → AI-triaged anomaly.
4. **Developer**: Portfolio → Analytics → Properties → Configuration (roles & permissions).
5. Open the floating assistant (bottom-right) and ask "Where's the gym?" — it's grounded in the property's real floor directory.
