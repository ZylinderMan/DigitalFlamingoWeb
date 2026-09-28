import type { TranslationKey } from "../../i18n";
import type { Dictionary } from "../../i18n/types";
import { el } from "../../utils/dom";

/** What every template receives */
export interface TemplateData {
  company: string;
  /** Object URL of the uploaded logo, or null for a generated monogram */
  logoUrl: string | null;
  /** URL-friendly company name, e.g. "dupont-fils" */
  slug: string;
}

/** Placeholder contact details shown in every template (change them here) */
export const PLACEHOLDER = {
  phone: "01 23 45 67 89",
  address: "12 rue de l'Exemple, 75001 Paris",
  email: (slug: string) => `contact@${slug}.fr`,
};

type Templates = Dictionary["templates"];

/**
 * Returns a helper that turns a field name into a full translation key:
 *   const k = keysFor("building");  k("heroTitle") → "templates.building.heroTitle"
 * Only fields that exist in the dictionary are accepted.
 */
export function keysFor<S extends keyof Templates>(sector: S) {
  return (field: keyof Templates[S] & string) => `templates.${sector}.${field}` as TranslationKey;
}

/** "Dupont & Fils Électricité" → "dupont-fils-electricite" */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** "Dupont & Fils" → "DF" */
export function initials(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => word.match(/[\p{L}\p{N}]/u)?.[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** The client's logo, or a monogram of their initials when no logo was uploaded */
export function brandMark(data: TemplateData, className: string): HTMLElement {
  return data.logoUrl
    ? el("img", { className: `${className} ${className}--image`, attrs: { src: data.logoUrl, alt: "" } })
    : el("span", {
        className: `${className} ${className}--monogram`,
        attrs: { "aria-hidden": "true" },
        children: [initials(data.company)],
      });
}

/** Inline SVG from a trusted, static string (never pass user input here) */
export function icon(markup: string, className = ""): HTMLElement {
  const span = el("span", { className, attrs: { "aria-hidden": "true" } });
  span.innerHTML = markup;
  return span;
}

/** "© 2026 Company. All rights reserved." — live translated */
export function copyright(company: string, className = ""): HTMLElement {
  return el("p", {
    className,
    text: "mockup.copyright",
    params: { year: new Date().getFullYear(), company },
  });
}

const SVG = 'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';

/** Small icon set shared by the templates */
export const ICONS = {
  check: `<svg ${SVG}><path d="M12 25l8 8 16-18"/></svg>`,
  plate: `<svg ${SVG}><circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="9"/></svg>`,
  glass: `<svg ${SVG}><path d="M15 6h18c0 11-3 17-9 17s-9-6-9-17z"/><path d="M24 23v15M16 42h16"/></svg>`,
  sun: `<svg ${SVG}><circle cx="24" cy="24" r="8"/><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.5 10.5l3.5 3.5M34 34l3.5 3.5M10.5 37.5l3.5-3.5M34 14l3.5-3.5"/></svg>`,
  sprig: `<svg viewBox="0 0 120 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 12h44M72 12h44"/><path d="M60 4c-6 4-6 12 0 16 6-4 6-12 0-16z"/></svg>`,
  chat: `<svg ${SVG}><path d="M8 10h32v22H22l-8 7v-7H8z"/><path d="M16 19h16M16 25h10"/></svg>`,
  care: `<svg ${SVG}><circle cx="24" cy="24" r="17"/><path d="M24 16v16M16 24h16"/></svg>`,
  shield: `<svg ${SVG}><path d="M24 6l15 5v11c0 10-7 17-15 20-8-3-15-10-15-20V11z"/><path d="M18 24l5 5 8-9"/></svg>`,
  opinion: `<svg ${SVG}><circle cx="18" cy="24" r="10"/><circle cx="30" cy="24" r="10"/></svg>`,
  practice: `<svg ${SVG}><rect x="8" y="8" width="32" height="32" rx="10"/><path d="M24 16v16M16 24h16"/></svg>`,
};
