import type { ResidentTier, Role } from "@/types";

export const DEMO_PASSWORD = "NesturaDemo!2026";

export interface DemoAccount {
  key: string;
  name: string;
  email: string;
  role: Role;
  tier?: ResidentTier;
  to: string;
  label: string;
  detail: string;
}

/** Demo personas for every Nestura audience. CCTV is operator-only. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    key: "owner",
    name: "John Perera",
    email: "john.owner@example.com",
    role: "resident",
    tier: "owner",
    to: "/resident",
    label: "Owner · W001",
    detail: "Full unit control, tenancy & household",
  },
  {
    key: "occupier",
    name: "Alex Perera",
    email: "resident@example.com",
    role: "resident",
    tier: "occupier",
    to: "/resident",
    label: "Occupier · W001",
    detail: "Home, scenes, visitors — no billing",
  },
  {
    key: "tenant",
    name: "Sarah Fernando",
    email: "sarah.tenant@example.com",
    role: "resident",
    tier: "tenant",
    to: "/resident",
    label: "Tenant · W001",
    detail: "Smart home only during tenancy",
  },
  {
    key: "household",
    name: "David Perera",
    email: "david.household@example.com",
    role: "resident",
    tier: "occupier",
    to: "/resident",
    label: "Household member · W001",
    detail: "Shared home access",
  },
  {
    key: "operator",
    name: "Maya Jayawardena",
    email: "operator@example.com",
    role: "operator",
    to: "/operator",
    label: "Building Operator",
    detail: "Operations, visitors, CCTV",
  },
  {
    key: "developer",
    name: "Arjun Keells",
    email: "developer@example.com",
    role: "developer",
    to: "/developer",
    label: "Developer",
    detail: "Portfolio intelligence",
  },
  {
    key: "visitor",
    name: "Priya Silva",
    email: "visitor@example.com",
    role: "visitor",
    to: "/visitor/request",
    label: "Visitor",
    detail: "Request a visit — no building CCTV",
  },
];
