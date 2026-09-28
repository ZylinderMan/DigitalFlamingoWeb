import { el } from "../utils/dom";
import type { SectorTemplate } from "./sectors";
import { slugify } from "./templates/shared";

export interface MockupData {
  company: string;
  sector: SectorTemplate;
  /** Object URL of the uploaded logo, or null for a generated monogram */
  logoUrl: string | null;
}

/**
 * Wraps the sector's sample website in a fake browser window.
 * The window bar sticks to the top while scrolling and always shows
 * a "Demonstration" badge.
 */
export function createMockup({ company, sector, logoUrl }: MockupData): HTMLElement {
  const slug = slugify(company) || "your-company";

  const chrome = el("div", {
    className: "browser__chrome",
    children: [
      el("span", {
        className: "browser__dots",
        attrs: { "aria-hidden": "true" },
        children: [el("span"), el("span"), el("span")],
      }),
      el("span", { className: "browser__url", attrs: { "aria-hidden": "true" }, children: [`www.${slug}.fr`] }),
      el("span", {
        className: "browser__badge",
        text: "mockup.badge",
        textAttrs: { title: "mockup.badgeTitle" },
      }),
    ],
  });

  const site = sector.render({ company, logoUrl, slug });

  return el("div", {
    className: "browser",
    attrs: { "data-sector": sector.id },
    children: [chrome, site],
  });
}
