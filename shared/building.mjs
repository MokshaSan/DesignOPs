export const PROPERTY_NAME = "John Keells Residencies — The Meridian";
export const DEFAULT_UNIT = "W001";

export const BUILDING_LEVELS = [
  { code: "B2", name: "Basement 2", amenities: ["Visitor Parking", "EV Charging Bay"] },
  { code: "B1", name: "Basement 1", amenities: ["Resident Parking", "Storage Lockers"] },
  { code: "G", name: "Ground Floor", amenities: ["Main Lobby & Concierge", "Mailroom & Parcel Room", "Security Office"] },
  { code: "L1", name: "Level 1", amenities: ["Fitness Center & Gym", "Yoga & Wellness Studio", "Kids' Play Zone", "Co-working Lounge"] },
  { code: "L2", name: "Level 2", amenities: ["Business Center & Meeting Rooms", "Guest Suites", "Library Lounge"] },
  { code: "L3-L20", name: "Levels 3–20", amenities: ["Residential apartments, 4 per floor (A–D)"] },
  { code: "R", name: "Rooftop (Level 21)", amenities: ["Infinity Pool & Sundeck", "Sky Lounge & BBQ Deck", "Observation Terrace"] },
];

export const AMENITIES = [
  { name: "Fitness Center & Gym", level: "L1", directions: "Take the Tower A lift down to Level 1. Exit and turn left — it's the first door on your right, next to the Yoga Studio.", hours: "5:00 AM – 11:00 PM" },
  { name: "Infinity Pool & Sundeck", level: "Rooftop (Level 21)", directions: "Take the Tower A lift up to the Rooftop. The pool is straight ahead as you exit the lift lobby.", hours: "6:00 AM – 10:00 PM" },
  { name: "Sky Lounge & BBQ Deck", level: "Rooftop (Level 21)", directions: "Rooftop level, past the pool deck, on the north side of the roof.", hours: "4:00 PM – 12:00 AM" },
  { name: "Main Lobby & Concierge", level: "Ground Floor", directions: "Ground floor, directly ahead of the main entrance.", hours: "24/7" },
  { name: "Mailroom & Parcel Room", level: "Ground Floor", directions: "Ground floor, to the right of the main lobby, beside the Security Office.", hours: "24/7 (staffed 8 AM – 8 PM)" },
  { name: "Co-working Lounge", level: "Level 1", directions: "Level 1, opposite the Kids' Play Zone.", hours: "6:00 AM – 12:00 AM" },
  { name: "Guest Suites", level: "Level 2", directions: "Level 2, next to the Business Center & Meeting Rooms.", hours: "Front-desk booking required" },
  { name: "Resident Parking", level: "Basement 1 (B1)", directions: "Take the Tower A lift and select B1.", hours: "24/7" },
  { name: "Kids' Play Zone", level: "Level 1", directions: "Level 1, beside the Fitness Center, opposite the Co-working Lounge.", hours: "8:00 AM – 8:00 PM" },
];

export function buildingContext() {
  const amenityLines = AMENITIES.map(
    (a) => `- ${a.name} — ${a.level}. Directions from a resident's apartment: ${a.directions} Hours: ${a.hours}.`,
  ).join("\n");
  const levelLines = BUILDING_LEVELS.map((l) => `${l.name} (${l.code}): ${l.amenities.join(", ")}`).join("\n");
  return `Property: ${PROPERTY_NAME}, developed by John Keells Properties.\nResident units use codes W001, W002, W003 (Tower A). Default demo unit: ${DEFAULT_UNIT}.\n\nFloor directory:\n${levelLines}\n\nAmenity directions:\n${amenityLines}`;
}
