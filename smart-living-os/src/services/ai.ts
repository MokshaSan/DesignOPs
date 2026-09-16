import OpenAI from 'openai';
import type { AIMessage, AISceneResult, Device } from '../types';
import { BUILDING_MAP } from '../data/mockData';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
});

// ─── System context for the building assistant ─
const BUILDING_CONTEXT = `
You are the JK Smart Living AI Assistant for ${BUILDING_MAP.name}, located at ${BUILDING_MAP.address}, Colombo, Sri Lanka.
This is a premium residential building by John Keells Properties with ${BUILDING_MAP.floors} floors.

AMENITIES AND DIRECTIONS:
${BUILDING_MAP.amenities.map(a => `- Floor ${a.floor}: ${a.name} — ${a.description}. HOW TO GET THERE: ${a.direction}`).join('\n')}

BUILDING SERVICES HOURS: Gym: 5AM–10PM | Pool: 6AM–9PM | Business Centre: 24/7 | Spa: 9AM–8PM
EMERGENCY: Security Desk (Lobby) — available 24/7. Emergency: 119 | Medical: 1990

You help residents with:
1. Building navigation and amenities
2. Smart home control (scenes, devices, automations)
3. Energy insights and suggestions
4. Visitor management
5. Maintenance requests
6. Building services and bookings

Always be friendly, concise, and helpful. Address the resident by name when known.
If you cannot control a device directly, guide the user to the relevant section of the app.
Respond in the same language the user writes in.
`;

// ─── Scene AI ─────────────────────────────────
export async function generateSceneFromPrompt(
  prompt: string,
  availableDevices: Device[],
  userName: string
): Promise<AISceneResult> {
  const deviceList = availableDevices.map(d =>
    `ID: ${d.id}, Name: ${d.name}, Type: ${d.type}, Room: ${d.room}`
  ).join('\n');

  const systemPrompt = `You are an AI scene designer for a smart home system. Given a user's description, generate a smart home scene configuration.

Available devices:
${deviceList}

Respond ONLY with valid JSON in this exact format:
{
  "name": "Scene Name",
  "icon": "emoji",
  "reasoning": "Brief explanation of why these settings create the desired atmosphere",
  "confidence": 0.95,
  "actions": [
    {
      "deviceId": "d1",
      "deviceType": "light",
      "deviceName": "Living Room Light",
      "room": "Living Room",
      "action": { "on": true, "brightness": 30 }
    }
  ]
}

For lights: include "on" (boolean) and optionally "brightness" (0-100)
For AC: include "on" (boolean) and "temperature" (number in Celsius, 16-30)
For curtains: include "position" ("open", "closed", or "partial")
For locks: include "locked" (boolean)`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${userName} wants: "${prompt}"` },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');
    return JSON.parse(content) as AISceneResult;
  } catch (err) {
    // Fallback: return a generic comfortable scene
    console.error('AI scene generation failed:', err);
    return {
      name: 'Custom Scene',
      icon: '🏠',
      reasoning: `Based on your request "${prompt}", I've set a comfortable default configuration. You can edit the settings below.`,
      confidence: 0.7,
      actions: availableDevices
        .filter(d => d.type === 'light' || d.type === 'ac')
        .slice(0, 3)
        .map(d => ({
          deviceId: d.id,
          deviceType: d.type,
          deviceName: d.name,
          room: d.room,
          action: d.type === 'light'
            ? { on: true, brightness: 70 }
            : { on: true, temperature: 24 },
        })),
    };
  }
}

// ─── Energy AI ────────────────────────────────
export async function getEnergyInsight(
  todayKwh: number,
  weeklyKwh: number,
  breakdown: { device: string; percentage: number }[],
  userName: string
): Promise<string> {
  const prompt = `Resident ${userName}'s energy today: ${todayKwh} kWh (weekly avg: ${(weeklyKwh / 7).toFixed(1)} kWh/day).
Top consumers: ${breakdown.map(b => `${b.device} (${b.percentage}%)`).join(', ')}.
Give 2–3 specific, actionable energy-saving tips in 3 sentences max. Be conversational, not robotic.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.6,
    });
    return response.choices[0]?.message?.content || getEnergyFallback(breakdown);
  } catch {
    return getEnergyFallback(breakdown);
  }
}

function getEnergyFallback(breakdown: { device: string; percentage: number }[]) {
  const top = breakdown[0];
  return `Your ${top.device} is the main energy driver at ${top.percentage}% of today's usage. Consider raising the AC setpoint by 1°C and setting an Energy Saver automation when you're away — this could reduce your monthly bill by up to 15%.`;
}

// ─── Maintenance AI ───────────────────────────
export async function getMaintenancePrediction(
  deviceName: string,
  health: number,
  battery: number | undefined,
  anomalyCount: number,
  daysSinceService: number
): Promise<string> {
  const prompt = `Smart home device "${deviceName}" health: ${health}%, battery: ${battery ?? 'N/A'}%, anomaly count (7d): ${anomalyCount}, days since last service: ${daysSinceService}. 
Predict maintenance urgency and give a 2-sentence recommendation.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.5,
    });
    return response.choices[0]?.message?.content || getMaintenanceFallback(health);
  } catch {
    return getMaintenanceFallback(health);
  }
}

function getMaintenanceFallback(health: number) {
  if (health < 30) return 'Immediate maintenance required. Device health is critically low and failure is imminent.';
  if (health < 60) return 'Maintenance recommended within 7 days. Declining health metrics indicate early failure risk.';
  return 'Device is performing normally. Schedule routine maintenance within the next month.';
}

// ─── Building Assistant Chat ───────────────────
export async function chatWithAssistant(
  messages: AIMessage[],
  userName: string,
  unitId: string
): Promise<string> {
  const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: BUILDING_CONTEXT + `\nYou are speaking with ${userName} in unit ${unitId}.` },
    ...messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      max_tokens: 300,
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content || 'I apologize, I couldn\'t process that request. Please try again.';
  } catch (err) {
    console.error('Chat assistant error:', err);
    return getFallbackResponse(messages[messages.length - 1]?.content || '');
  }
}

function getFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('gym')) return 'The Gym & Fitness Center is on Level 2. Take the elevator to Level 2 and turn right. It\'s open 5AM–10PM daily.';
  if (lower.includes('pool')) return 'The Swimming Pool is on Level 2. Take the elevator to Level 2 and turn left toward the poolside. Open 6AM–9PM.';
  if (lower.includes('park') || lower.includes('car')) return 'Car parking is in Basement 1 & 2 with EV charging. Take the ramp on the right wing of the ground floor.';
  if (lower.includes('gym')) return 'The Gym is on Level 2, open 5AM to 10PM daily.';
  if (lower.includes('wifi')) return 'High-speed WiFi is available throughout the building. Connect to "JK-Residents" and use your resident credentials.';
  if (lower.includes('maintenance') || lower.includes('repair')) return 'You can submit a maintenance request through the app. Go to the Notifications section or ask me to navigate there.';
  return 'I\'m here to help with building navigation, smart home controls, and resident services. What would you like to know?';
}

// ─── Automation Suggestion AI ─────────────────
export async function suggestAutomation(
  patterns: string[],
  userName: string
): Promise<{ name: string; description: string; trigger: string; confidence: number }> {
  const prompt = `Smart home usage patterns for ${userName}: ${patterns.join('; ')}. 
Suggest ONE automation in JSON: { "name": "...", "description": "...", "trigger": "...", "confidence": 0.0-1.0 }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
      temperature: 0.6,
      response_format: { type: 'json_object' },
    });
    const content = response.choices[0]?.message?.content;
    if (content) return JSON.parse(content);
  } catch {}

  return {
    name: 'Evening Comfort',
    description: 'Based on your routine, prepare your home for evening',
    trigger: 'When you arrive home between 18:00–19:00',
    confidence: 0.88,
  };
}
