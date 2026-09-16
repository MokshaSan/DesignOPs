export interface BuildingLevel {
  code: string;
  name: string;
  order: number;
  amenities: string[];
}

export interface Amenity {
  id: string;
  name: string;
  levelCode: string;
  keywords: string[];
  directions: string;
  hours?: string;
}

export const PROPERTY_NAME = "John Keells Residencies — The Meridian";
export const PROPERTY_TOWER = "Tower A";
export const DEFAULT_UNIT = "12A";
export const DEFAULT_UNIT_FLOOR = 12;

export const BUILDING_LEVELS: BuildingLevel[] = [
  { code: "B2", name: "Basement 2", order: -2, amenities: ["Visitor Parking", "EV Charging Bay"] },
  { code: "B1", name: "Basement 1", order: -1, amenities: ["Resident Parking", "Storage Lockers"] },
  { code: "G", name: "Ground Floor", order: 0, amenities: ["Main Lobby & Concierge", "Mailroom & Parcel Room", "Security Office"] },
  { code: "L1", name: "Level 1", order: 1, amenities: ["Fitness Center & Gym", "Yoga & Wellness Studio", "Kids' Play Zone", "Co-working Lounge"] },
  { code: "L2", name: "Level 2", order: 2, amenities: ["Business Center & Meeting Rooms", "Guest Suites", "Library Lounge"] },
  ...Array.from({ length: 18 }, (_, i) => ({
    code: `L${i + 3}`,
    name: `Level ${i + 3}`,
    order: i + 3,
    amenities: [`Apartments ${i + 3}A - ${i + 3}D`],
  })),
  { code: "R", name: "Rooftop (Level 21)", order: 21, amenities: ["Infinity Pool & Sundeck", "Sky Lounge & BBQ Deck", "Observation Terrace"] },
];

export const AMENITIES: Amenity[] = [
  {
    id: "gym",
    name: "Fitness Center & Gym",
    levelCode: "L1",
    keywords: ["gym", "fitness", "workout", "weights", "treadmill"],
    directions:
      "Take the Tower A lift down to Level 1. Exit and turn left — the Fitness Center & Gym is the first door on your right, right next to the Yoga Studio.",
    hours: "5:00 AM – 11:00 PM",
  },
  {
    id: "pool",
    name: "Infinity Pool & Sundeck",
    levelCode: "R",
    keywords: ["pool", "swim", "sundeck", "rooftop"],
    directions: "Take the Tower A lift up to the Rooftop (Level 21). The Infinity Pool & Sundeck is straight ahead as you exit the lift lobby.",
    hours: "6:00 AM – 10:00 PM",
  },
  {
    id: "sky-lounge",
    name: "Sky Lounge & BBQ Deck",
    levelCode: "R",
    keywords: ["sky lounge", "bbq", "rooftop bar", "terrace"],
    directions: "Rooftop level, past the pool deck — follow signage to the Sky Lounge on the north side of the roof.",
    hours: "4:00 PM – 12:00 AM",
  },
  {
    id: "concierge",
    name: "Main Lobby & Concierge",
    levelCode: "G",
    keywords: ["concierge", "lobby", "reception", "front desk"],
    directions: "Take the lift to the Ground Floor. The Concierge desk is directly ahead of the main lobby entrance.",
    hours: "24 / 7",
  },
  {
    id: "mailroom",
    name: "Mailroom & Parcel Room",
    levelCode: "G",
    keywords: ["mail", "parcel", "package", "delivery room"],
    directions: "Ground Floor, to the right of the main lobby, beside the Security Office.",
    hours: "24 / 7 (staffed 8 AM – 8 PM)",
  },
  {
    id: "coworking",
    name: "Co-working Lounge",
    levelCode: "L1",
    keywords: ["coworking", "work", "wifi lounge", "study"],
    directions: "Level 1, directly opposite the Kids' Play Zone.",
    hours: "6:00 AM – 12:00 AM",
  },
  {
    id: "guest-suites",
    name: "Guest Suites",
    levelCode: "L2",
    keywords: ["guest suite", "guest room", "visitor room"],
    directions: "Level 2, next to the Business Center & Meeting Rooms.",
    hours: "Reception required",
  },
  {
    id: "parking",
    name: "Resident Parking",
    levelCode: "B1",
    keywords: ["parking", "car park", "garage"],
    directions: "Resident parking is on Basement Level 1 (B1). Take the Tower A lift and select B1.",
    hours: "24 / 7",
  },
  {
    id: "kids-play",
    name: "Kids' Play Zone",
    levelCode: "L1",
    keywords: ["kids", "play area", "children"],
    directions: "Level 1, beside the Fitness Center, opposite the Co-working Lounge.",
    hours: "8:00 AM – 8:00 PM",
  },
];

export function findAmenity(query: string): Amenity | undefined {
  const q = query.toLowerCase();
  return AMENITIES.find((a) => a.keywords.some((k) => q.includes(k)) || q.includes(a.name.toLowerCase()));
}

export function buildingMapSummary(): string {
  return BUILDING_LEVELS.map((l) => `${l.name} (${l.code}): ${l.amenities.join(", ")}`).join("\n");
}
