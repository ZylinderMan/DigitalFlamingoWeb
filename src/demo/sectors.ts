import type { TranslationKey } from "../i18n";
import type { Dictionary } from "../i18n/types";
import type { TemplateData } from "./templates/shared";
import { renderBuilding } from "./templates/building";
import { renderRestaurant } from "./templates/restaurant";
import { renderHealth } from "./templates/health";

/** Sector ids come from the dictionary: "building" | "restaurant" | "health" */
export type SectorId = keyof Dictionary["sectors"];

export interface SectorTemplate {
  id: SectorId;
  /** Inline SVG (uses currentColor) shown on the sector card in the form */
  icon: string;
  /** Builds the sample website for this sector */
  render: (data: TemplateData) => HTMLElement;
}

/** Translation key for the sector's name or description in the form */
export function sectorKey(id: SectorId, field: "name" | "description"): TranslationKey {
  return `sectors.${id}.${field}`;
}

const ICON_ATTRS =
  'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

/**
 * SECTOR REGISTRY
 * To add a sector:
 *   1. add `sectors.<id>` (name, description) and `templates.<id>` (the site's texts)
 *      to every dictionary
 *   2. create src/demo/templates/<id>.ts with a render function (copy an existing one)
 *   3. create src/styles/templates/<id>.css and import it in src/main.ts
 *   4. add an entry below
 * Its URL anchor becomes #demo-<id> automatically.
 */
export const sectors: SectorTemplate[] = [
  {
    id: "building",
    icon: `<svg ${ICON_ATTRS}><path d="M8 30 32 10l24 20"/><path d="M14 25v29h36V25"/><path d="M27 54V40h10v14"/><path d="M42 14v8"/></svg>`,
    render: renderBuilding,
  },
  {
    id: "restaurant",
    icon: `<svg ${ICON_ATTRS}><path d="M18 8v14a6 6 0 0 0 12 0V8"/><path d="M24 8v48"/><path d="M46 56V8c-6 3-8 12-8 21h8"/></svg>`,
    render: renderRestaurant,
  },
  {
    id: "health",
    icon: `<svg ${ICON_ATTRS}><rect x="10" y="10" width="44" height="44" rx="14"/><path d="M32 22v20M22 32h20"/></svg>`,
    render: renderHealth,
  },
];

export function findSector(id: string): SectorTemplate | undefined {
  return sectors.find((sector) => sector.id === id);
}

export function getSector(id: string): SectorTemplate {
  return findSector(id) ?? sectors[0];
}
