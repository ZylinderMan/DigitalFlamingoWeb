import type { SectionDefinition } from "./types";
import { el } from "../utils/dom";

export const heroSection: SectionDefinition = {
  id: "home",
  navLabel: "nav.home",
  fullHeight: true,
  className: "hero",
  render: () => [
    el("h1", { className: "hero__title", text: "hero.title" }),
    el("p", { className: "hero__subtitle", text: "hero.subtitle" }),
    el("div", {
      className: "hero__actions",
      children: [
        el("a", { className: "button", text: "hero.ctaPrimary", attrs: { href: "#demo" } }),
        el("a", { className: "button button--ghost", text: "hero.ctaSecondary", attrs: { href: "#services" } }),
      ],
    }),
  ],
};
