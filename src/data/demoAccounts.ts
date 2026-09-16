import type { ResidentTier, Role } from "@/types";

export const DEMO_PASSWORD = "NesturaDemo!2026";

export interface DemoAccount {
  key: string;
  name: string;
  email: string;
  role: Role;
  tier?: ResidentTier;
  unitId: string;
  to: string;
  label: string;
  detail: string;
}

/** Demo personas. CCTV is operator-only. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    key: "w001-owner",
    name: "John Perera",
    email: "john.owner@example.com",
    role: "resident",
    tier: "owner",
    unitId: "W001",
    to: "/resident",
    label: "Owner · W001",
    detail: "Full unit control, tenancy & household",
  },
  {
    key: "w001-occupier",
    name: "Alex Perera",
    email: "resident@example.com",
    role: "resident",
    tier: "occupier",
    unitId: "W001",
    to: "/resident",
    label: "Occupier · W001",
    detail: "Home, scenes, visitors — no billing",
  },
  {
    key: "w002-owner",
    name: "Ruwan Fernando",
    email: "ruwan.w002@example.com",
    role: "resident",
    tier: "owner",
    unitId: "W002",
    to: "/resident",
    label: "Owner · W002 family",
    detail: "Family head — grants visitors & billing",
  },
  {
    key: "w002-spouse",
    name: "Nisha Fernando",
    email: "nisha.w002@example.com",
    role: "resident",
    tier: "occupier",
    unitId: "W002",
    to: "/resident",
    label: "Spouse · W002",
    detail: "Same household alerts & visitor notices",
  },
  {
    key: "w002-child",
    name: "Anika Fernando",
    email: "anika.w002@example.com",
    role: "resident",
    tier: "occupier",
    unitId: "W002",
    to: "/resident",
    label: "Household · W002",
    detail: "Shared home access & notifications",
  },
  {
    key: "w003-tenant",
    name: "Sarah Fernando",
    email: "sarah.tenant@example.com",
    role: "resident",
    tier: "tenant",
    unitId: "W003",
    to: "/resident",
    label: "Tenant · W003",
    detail: "Smart home during tenancy",
  },
  {
    key: "operator",
    name: "Maya Jayawardena",
    email: "operator@example.com",
    role: "operator",
    unitId: "Tower A",
    to: "/operator",
    label: "Building Operator",
    detail: "Operations, visitors, CCTV",
  },
  {
    key: "developer",
    name: "Arjun Keells",
    email: "developer@example.com",
    role: "developer",
    unitId: "Portfolio",
    to: "/developer",
    label: "Developer",
    detail: "Portfolio intelligence",
  },
  {
    key: "visitor",
    name: "Priya Silva",
    email: "visitor@example.com",
    role: "visitor",
    unitId: "W001",
    to: "/visitor/request",
    label: "Visitor",
    detail: "Request a visit + Beacon wayfinding",
  },
];

export const UNIT_HOSTS: Record<string, string> = {
  W001: "John Perera",
  W002: "Ruwan Fernando",
  W003: "Sarah Fernando",
};
