/** Indoor Beacon graph for The Meridian, Tower A — used by Nestura wayfinding. */

export const BEACONS = [
  { id: "gate", name: "Visitor gate", level: "G", hint: "Street entrance / QR checkpoint" },
  { id: "lobby", name: "Main lobby beacon", level: "G", hint: "Concierge desk" },
  { id: "lifts-g", name: "Tower A lift lobby (Ground)", level: "G", hint: "Resident + visitor lifts" },
  { id: "mail", name: "Mailroom beacon", level: "G", hint: "Parcels" },
  { id: "lifts-b1", name: "Lift lobby B1", level: "B1", hint: "Resident parking" },
  { id: "parking", name: "Resident parking beacon", level: "B1", hint: "Bay rows A–F" },
  { id: "visitor-parking", name: "Visitor parking beacon", level: "B2", hint: "Short-stay bays" },
  { id: "lifts-l1", name: "Lift lobby L1", level: "L1", hint: "Amenity floor" },
  { id: "gym", name: "Gym beacon", level: "L1", hint: "Fitness Center" },
  { id: "kids", name: "Kids' play beacon", level: "L1", hint: "Play zone" },
  { id: "cowork", name: "Co-working beacon", level: "L1", hint: "Lounge" },
  { id: "lifts-l2", name: "Lift lobby L2", level: "L2", hint: "Guest suites" },
  { id: "lifts-res", name: "Residential lift lobby (L3–L20)", level: "L12", hint: "Apartment floors" },
  { id: "w001", name: "Unit W001 door beacon", level: "L12", hint: "John Perera household" },
  { id: "w002", name: "Unit W002 door beacon", level: "L12", hint: "Fernando family" },
  { id: "w003", name: "Unit W003 door beacon", level: "L8", hint: "Sarah Fernando" },
  { id: "lifts-r", name: "Rooftop lift lobby", level: "R", hint: "Level 21" },
  { id: "pool", name: "Pool deck beacon", level: "R", hint: "Infinity pool" },
];

const EDGES = [
  ["gate", "lobby", "Walk through the visitor gate, past security, into the main lobby."],
  ["lobby", "lifts-g", "From the concierge desk, continue straight to the Tower A lift bank."],
  ["lobby", "mail", "Turn right of the lobby — Mailroom is beside the Security Office."],
  ["lifts-g", "lifts-b1", "Take any Tower A lift and select B1."],
  ["lifts-b1", "parking", "Exit the lift, follow the green Beacon lights to resident bays."],
  ["lifts-g", "visitor-parking", "Take the lift to B2 for visitor parking / EV bays."],
  ["lifts-g", "lifts-l1", "Take the lift to Level 1 (amenities)."],
  ["lifts-l1", "gym", "Exit left — Fitness Center is the first door on the right (Beacon GY-01)."],
  ["lifts-l1", "kids", "Opposite the gym, follow the play-zone Beacon."],
  ["lifts-l1", "cowork", "Straight across from the kids' zone — Co-working lounge."],
  ["lifts-g", "lifts-l2", "Lift to Level 2 for guest suites and the business center."],
  ["lifts-g", "lifts-res", "Lift to your host's floor (W001/W002 = Level 12, W003 = Level 8)."],
  ["lifts-res", "w001", "Turn left out of the lift. W001 is the second door, Beacon UN-W001."],
  ["lifts-res", "w002", "Turn right out of the lift. W002 is the first door, Beacon UN-W002."],
  ["lifts-g", "w003", "Lift to Level 8. Exit right — W003 is mid-corridor, Beacon UN-W003."],
  ["lifts-g", "lifts-r", "Lift to Rooftop (Level 21)."],
  ["lifts-r", "pool", "Straight ahead from the rooftop lobby onto the pool deck."],
];

const KEYWORDS = [
  { keys: ["gym", "fitness", "workout"], id: "gym" },
  { keys: ["pool", "swim", "sundeck"], id: "pool" },
  { keys: ["park", "car", "garage", "b1"], id: "parking" },
  { keys: ["visitor park", "b2"], id: "visitor-parking" },
  { keys: ["mail", "parcel", "package"], id: "mail" },
  { keys: ["lobby", "concierge", "reception"], id: "lobby" },
  { keys: ["cowork", "work", "study"], id: "cowork" },
  { keys: ["kids", "play", "children"], id: "kids" },
  { keys: ["w001", "john perera"], id: "w001" },
  { keys: ["w002", "fernando family", "ruwan", "nisha", "anika"], id: "w002" },
  { keys: ["w003", "sarah"], id: "w003" },
  { keys: ["guest", "suite"], id: "lifts-l2" },
];

function adj() {
  const map = new Map();
  for (const [a, b, step] of EDGES) {
    if (!map.has(a)) map.set(a, []);
    if (!map.has(b)) map.set(b, []);
    map.get(a).push({ to: b, step });
    map.get(b).push({ to: a, step: `Return via the same corridor toward ${beaconName(a)}.` });
  }
  return map;
}

function beaconName(id) {
  return BEACONS.find((b) => b.id === id)?.name || id;
}

export function matchBeacon(query) {
  const q = (query || "").toLowerCase();
  const hit = KEYWORDS.find((k) => k.keys.some((key) => q.includes(key)));
  return hit ? BEACONS.find((b) => b.id === hit.id) : undefined;
}

export function routeBeacons(fromId, toId) {
  if (fromId === toId) return [`You are already at ${beaconName(toId)}.`];
  const graph = adj();
  const q = [fromId];
  const prev = new Map([[fromId, null]]);
  const via = new Map();
  while (q.length) {
    const cur = q.shift();
    for (const edge of graph.get(cur) || []) {
      if (prev.has(edge.to)) continue;
      prev.set(edge.to, cur);
      via.set(edge.to, edge.step);
      q.push(edge.to);
    }
  }
  if (!prev.has(toId)) return [`Follow lobby Beacon signage toward ${beaconName(toId)}.`];
  const ids = [];
  for (let n = toId; n; n = prev.get(n)) ids.push(n);
  ids.reverse();
  const steps = [];
  for (let i = 1; i < ids.length; i++) steps.push(via.get(ids[i]));
  const dest = BEACONS.find((b) => b.id === toId);
  steps.push(`You have arrived at ${dest.name} (${dest.level}).`);
  return steps;
}

export function beaconDirectory() {
  return BEACONS.map((b) => `${b.id}: ${b.name} [${b.level}] — ${b.hint}`).join("\n");
}

export function directionsForQuery(query, originId = "lobby") {
  const dest = matchBeacon(query);
  if (!dest) return null;
  const steps = routeBeacons(originId, dest.id);
  return {
    destination: dest,
    origin: BEACONS.find((b) => b.id === originId),
    steps,
    text: `Beacon route to ${dest.name}:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
  };
}
