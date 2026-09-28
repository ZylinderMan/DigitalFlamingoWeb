import { el } from "../../utils/dom";
import { ICONS, PLACEHOLDER, brandMark, copyright, icon, keysFor, type TemplateData } from "./shared";

const k = keysFor("restaurant");

/**
 * RESTAURANT: upscale gastronomic layout.
 * Centred brand between split navigation, dark cellar-toned hero, short
 * philosophy statement, three "atmospheres" in alternating rows, chef quote,
 * opening hours + booking, centred footer.
 * Styles: src/styles/templates/restaurant.css (class prefix "r-")
 */
export function renderRestaurant(data: TemplateData): HTMLElement {
  const header = el("div", {
    className: "r-header",
    children: [
      el("span", {
        className: "r-nav r-nav--left",
        children: [el("span", { text: k("navRestaurant") }), el("span", { text: k("navMenus") })],
      }),
      el("span", { className: "r-brand", children: [brandMark(data, "r-mark"), el("span", { children: [data.company] })] }),
      el("span", {
        className: "r-nav r-nav--right",
        children: [
          el("span", { className: "r-nav__link", text: k("navChef") }),
          el("span", { className: "r-nav__link", text: k("navVisit") }),
          el("span", { className: "r-button r-button--outline", text: k("book") }),
        ],
      }),
    ],
  });

  const hero = el("div", {
    className: "r-hero",
    children: [
      el("h3", { className: "r-hero__title", text: k("heroTitle") }),
      el("p", { className: "r-hero__text", text: k("heroText") }),
      el("div", {
        className: "r-hero__actions",
        children: [
          el("span", { className: "r-button r-button--gold", text: k("book") }),
          el("span", { className: "r-button r-button--ghost", text: k("heroMenus") }),
        ],
      }),
    ],
  });

  const intro = el("div", {
    className: "r-intro",
    children: [icon(ICONS.sprig, "r-ornament"), el("p", { text: k("introText") })],
  });

  const venues = (
    [
      ["venue1Name", "venue1Text", "venue1Meta", ICONS.plate],
      ["venue2Name", "venue2Text", "venue2Meta", ICONS.glass],
      ["venue3Name", "venue3Text", "venue3Meta", ICONS.sun],
    ] as const
  ).map(([name, text, meta, svg]) =>
    el("div", {
      className: "r-venue",
      children: [
        el("div", { className: "r-venue__panel", children: [icon(svg, "r-venue__icon")] }),
        el("div", {
          className: "r-venue__body",
          children: [
            el("h5", { text: k(name) }),
            el("p", { text: k(text) }),
            el("p", { className: "r-venue__meta", text: k(meta) }),
          ],
        }),
      ],
    }),
  );

  const venuesSection = el("div", {
    className: "r-section",
    children: [el("h4", { className: "r-heading", text: k("venuesTitle") }), el("div", { className: "r-venues", children: venues })],
  });

  const quote = el("div", {
    className: "r-quote",
    children: [
      el("blockquote", { children: [el("p", { text: k("chefQuote") })] }),
      el("p", { className: "r-quote__role", text: k("chefRole") }),
    ],
  });

  const hours = (
    [
      ["hoursLunch", "hoursLunchValue"],
      ["hoursDinner", "hoursDinnerValue"],
      ["hoursClosed", "hoursClosedValue"],
    ] as const
  ).flatMap(([label, value]) => [el("dt", { text: k(label) }), el("dd", { text: k(value) })]);

  const practical = el("div", {
    className: "r-section r-practical",
    children: [
      el("div", {
        children: [el("h4", { className: "r-heading r-heading--left", text: k("hoursTitle") }), el("dl", { className: "r-hours", children: hours })],
      }),
      el("div", {
        className: "r-booking",
        children: [
          el("h5", { text: k("bookTitle") }),
          el("p", { text: k("bookText") }),
          el("p", { className: "r-booking__phone", children: [PLACEHOLDER.phone] }),
          el("span", { className: "r-button r-button--gold", text: k("book") }),
        ],
      }),
    ],
  });

  const footer = el("div", {
    className: "r-footer",
    children: [
      el("p", { className: "r-footer__brand", children: [data.company] }),
      el("p", { text: k("footerTagline") }),
      el("p", { children: [PLACEHOLDER.address] }),
      el("p", { children: [`${PLACEHOLDER.phone}  |  ${PLACEHOLDER.email(data.slug)}`] }),
      copyright(data.company, "r-footer__copy"),
    ],
  });

  return el("div", {
    className: "tpl tpl-restaurant",
    children: [header, hero, intro, venuesSection, quote, practical, footer],
  });
}
