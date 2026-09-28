import type { SectionDefinition } from "../sections/types";
import { siteConfig } from "../config";
import { el } from "../utils/dom";

/** Site footer: brand + tagline, the same links as the header, contact email, copyright */
export function createFooter(sections: SectionDefinition[]): HTMLElement {
  const links = sections
    .filter((section) => section.navLabel)
    .map((section) => el("a", { text: section.navLabel, attrs: { href: `#${section.id}` } }));

  return el("footer", {
    className: "site-footer",
    children: [
      el("div", {
        className: "site-footer__inner",
        children: [
          el("div", {
            className: "site-footer__about",
            children: [
              el("p", { className: "site-footer__brand", text: "meta.brand" }),
              el("p", { className: "site-footer__tagline", text: "footer.tagline" }),
            ],
          }),
          el("nav", {
            className: "site-footer__nav",
            textAttrs: { "aria-label": "footer.navLabel" },
            children: links,
          }),
          el("a", {
            className: "site-footer__email",
            attrs: { href: `mailto:${siteConfig.contactEmail}` },
            children: [siteConfig.contactEmail],
          }),
        ],
      }),
      el("div", {
        className: "site-footer__bottom",
        children: [el("p", { text: "footer.copyright", params: { year: new Date().getFullYear() } })],
      }),
    ],
  });
}
