import type { SectionDefinition } from "./types";
import { el } from "../utils/dom";

export const contactSection: SectionDefinition = {
  id: "contact",
  navLabel: "nav.contact",
  className: "contact",
  render: () => [
    el("h2", { className: "section__title", text: "contact.title" }),
    el("p", { className: "section__lead", text: "contact.lead" }),
    el("a", {
      className: "button",
      text: "contact.cta",
      attrs: { href: "mailto:hello@example.com" }, // ← your email here
    }),
  ],
};
