import type { SectionDefinition } from "../sections/types";
import { el } from "../utils/dom";
import { createLanguageSwitcher } from "./languageSwitcher";

/** Sticky header: brand, auto-generated nav links, language switcher */
export function createHeader(sections: SectionDefinition[]): HTMLElement {
  const navLinks = sections
    .filter((section) => section.navLabel)
    .map((section) => el("a", { text: section.navLabel, attrs: { href: `#${section.id}` } }));

  return el("header", {
    className: "site-header",
    children: [
      el("div", {
        className: "site-header__inner",
        children: [
          el("a", { className: "site-header__brand", text: "meta.brand", attrs: { href: "#" } }),
          el("nav", { className: "site-nav", children: navLinks }),
          createLanguageSwitcher(),
        ],
      }),
    ],
  });
}
