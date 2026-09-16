import type { ResidentTier, RolePermissions } from "@/types";

export const TIER_PERMISSIONS: Record<ResidentTier, RolePermissions> = {
  owner: { smartHome: true, access: true, billing: true, services: true, automation: true },
  occupier: { smartHome: true, access: true, billing: false, services: true, automation: true },
  tenant: { smartHome: true, access: false, billing: false, services: false, automation: true },
};

export const TIER_LABEL: Record<ResidentTier, string> = {
  owner: "Owner",
  occupier: "Occupier",
  tenant: "Tenant",
};

export const TIER_DESCRIPTION: Record<ResidentTier, string> = {
  owner: "Full control over the unit — smart home, access, billing, services and automation.",
  occupier: "Day-to-day control of the home, including visitor access, without billing visibility.",
  tenant: "Smart home and automation only. Visitor access and billing are managed by the owner.",
};
