import { el } from "../../utils/dom";
import { ICONS, PLACEHOLDER, brandMark, companyName, copyright, icon, keysFor, type TemplateData } from "./shared";

const k = keysFor("health");

/**
 * HEALTH / INDEPENDENT PROFESSIONS: practice website layout.
 * Info bar (address, hours, phone), header with many nav items and an
 * appointment button, welcome hero, practice & equipment, areas of expertise
 * with icons, online booking band, footer with contact columns.
 * Styles: src/styles/templates/health.css (class prefix "h-")
 */
export function renderHealth(data: TemplateData): HTMLElement {
  const topbar = el("div", {
    className: "h-topbar",
    children: [
      el("div", {
        className: "h-wrap h-topbar__inner",
        children: [
          el("span", { children: [PLACEHOLDER.address] }),
          el("span", {
            className: "h-topbar__right",
            children: [el("span", { className: "h-topbar__hours", text: k("topHours") }), el("strong", { className: "h-topbar__phone", children: [PLACEHOLDER.phone] })],
          }),
        ],
      }),
    ],
  });

  const header = el("div", {
    className: "h-header",
    children: [
      el("div", {
        className: "h-wrap h-header__inner",
        children: [
          el("span", { className: "h-brand", children: [brandMark(data, "h-mark"), companyName(data.company)] }),
          el("span", {
            className: "h-nav",
            children: [
              el("span", { className: "is-active", text: k("navHome") }),
              el("span", { text: k("navPractice") }),
              el("span", { text: k("navExpertise") }),
              el("span", { text: k("navTeam") }),
              el("span", { text: k("navContact") }),
            ],
          }),
          el("span", { className: "h-button", text: k("appointment") }),
        ],
      }),
    ],
  });

  const hero = el("div", {
    className: "h-hero",
    children: [
      el("div", {
        className: "h-wrap h-hero__inner",
        children: [
          el("div", {
            children: [
              el("h3", { className: "h-hero__title", text: k("heroTitle") }),
              el("p", {
                className: "h-tags",
                children: (["heroTag1", "heroTag2", "heroTag3"] as const).map((f) => el("span", { text: k(f) })),
              }),
              el("p", { className: "h-hero__text", text: k("heroText") }),
              el("div", {
                className: "h-hero__actions",
                children: [
                  el("span", { className: "h-button", text: k("appointment") }),
                  el("span", { className: "h-link", text: k("heroLink") }),
                ],
              }),
            ],
          }),
          el("div", { className: "h-art", children: [icon(ICONS.practice, "h-art__icon")] }),
        ],
      }),
    ],
  });

  const practice = el("div", {
    className: "h-section",
    children: [
      el("div", {
        className: "h-wrap h-practice",
        children: [
          el("div", {
            children: [
              el("h4", { className: "h-heading", text: k("practiceTitle") }),
              el("p", { text: k("practiceText1") }),
              el("p", { text: k("practiceText2") }),
            ],
          }),
          el("ul", {
            className: "h-checklist",
            children: (["practiceList1", "practiceList2", "practiceList3"] as const).map((f) =>
              el("li", { children: [icon(ICONS.check, "h-checklist__icon"), el("span", { text: k(f) })] }),
            ),
          }),
        ],
      }),
    ],
  });

  const areas = (
    [
      ["area1Title", "area1Text", ICONS.chat],
      ["area2Title", "area2Text", ICONS.care],
      ["area3Title", "area3Text", ICONS.shield],
      ["area4Title", "area4Text", ICONS.opinion],
    ] as const
  ).map(([title, text, svg]) =>
    el("div", {
      className: "h-area",
      children: [
        icon(svg, "h-area__icon"),
        el("div", { children: [el("h5", { text: k(title) }), el("p", { text: k(text) })] }),
      ],
    }),
  );

  const expertise = el("div", {
    className: "h-section h-section--tinted",
    children: [
      el("div", {
        className: "h-wrap",
        children: [
          el("h4", { className: "h-heading h-heading--center", text: k("expertiseTitle") }),
          el("p", { className: "h-lead", text: k("expertiseLead") }),
          el("div", { className: "h-areas", children: areas }),
        ],
      }),
    ],
  });

  const booking = el("div", {
    className: "h-booking",
    children: [
      el("div", {
        className: "h-wrap h-booking__inner",
        children: [
          el("div", { children: [el("h4", { text: k("bookingTitle") }), el("p", { text: k("bookingText") })] }),
          el("span", { className: "h-button h-button--light", text: k("bookingButton") }),
        ],
      }),
    ],
  });

  const footerColumn = (label: Parameters<typeof k>[0], value: HTMLElement) =>
    el("div", { children: [el("p", { className: "h-footer__label", text: k(label) }), value] });

  const footer = el("div", {
    className: "h-footer",
    children: [
      el("div", {
        className: "h-wrap h-footer__inner",
        children: [
          el("div", {
            children: [brandMark(data, "h-mark"), el("p", { className: "h-footer__brand", children: [companyName(data.company, "", false)] })],
          }),
          footerColumn("footerAddress", el("p", { children: [PLACEHOLDER.address] })),
          footerColumn("footerPhone", el("p", { children: [PLACEHOLDER.phone] })),
          footerColumn("footerWrite", el("p", { className: "h-footer__link", text: k("footerForm") })),
        ],
      }),
      el("div", {
        className: "h-wrap h-footer__bottom",
        children: [copyright(data.company), el("span", { text: k("footerLegal") })],
      }),
    ],
  });

  return el("div", {
    className: "tpl tpl-health",
    children: [topbar, header, hero, practice, expertise, booking, footer],
  });
}
