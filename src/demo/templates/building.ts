import { el } from "../../utils/dom";
import { PLACEHOLDER, brandMark, copyright, keysFor, type TemplateData } from "./shared";

const k = keysFor("building");

/**
 * BUILDING TRADES: corporate general-contractor layout.
 * Utility bar, breadcrumb hero on a blueprint grid, "single contact" pitch,
 * key figures, fields of work, 3-step method, contact band, dark footer.
 * Styles: src/styles/templates/building.css (class prefix "b-")
 */
export function renderBuilding(data: TemplateData): HTMLElement {
  const topbar = el("div", {
    className: "b-topbar",
    children: [
      el("div", {
        className: "b-wrap b-topbar__inner",
        children: [
          el("span", { children: [PLACEHOLDER.phone] }),
          el("span", {
            className: "b-topbar__links",
            children: [el("span", { text: k("topCareers") }), el("span", { text: k("topSuppliers") })],
          }),
        ],
      }),
    ],
  });

  const header = el("div", {
    className: "b-header",
    children: [
      el("div", {
        className: "b-wrap b-header__inner",
        children: [
          el("span", { className: "b-brand", children: [brandMark(data, "b-mark"), el("span", { children: [data.company] })] }),
          el("span", {
            className: "b-nav",
            children: [
              el("span", { className: "is-active", text: k("navExpertise") }),
              el("span", { text: k("navProjects") }),
              el("span", { text: k("navCommitments") }),
              el("span", { text: k("navContact") }),
            ],
          }),
        ],
      }),
    ],
  });

  const hero = el("div", {
    className: "b-hero",
    children: [
      el("div", {
        className: "b-wrap",
        children: [
          el("p", {
            className: "b-breadcrumb",
            children: [
              el("span", { text: k("breadcrumbHome") }),
              el("span", { attrs: { "aria-hidden": "true" }, children: ["/"] }),
              el("span", { text: k("breadcrumbExpertise") }),
              el("span", { attrs: { "aria-hidden": "true" }, children: ["/"] }),
              el("span", { text: k("heroTitle") }),
            ],
          }),
          el("h3", { className: "b-hero__title", text: k("heroTitle") }),
          el("p", { className: "b-hero__text", text: k("heroText") }),
        ],
      }),
    ],
  });

  const intro = el("div", {
    className: "b-section",
    children: [
      el("div", {
        className: "b-wrap b-intro",
        children: [
          el("div", {
            children: [
              el("h4", { className: "b-heading", text: k("introTitle") }),
              el("p", { className: "b-intro__text", text: k("introText") }),
            ],
          }),
          el("div", {
            className: "b-highlight",
            children: [
              el("h5", { text: k("highlightTitle") }),
              el("ul", {
                children: (["highlight1", "highlight2", "highlight3"] as const).map((f) => el("li", { text: k(f) })),
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const figures: Array<[string, Parameters<typeof k>[0]]> = [
    ["25", "figure1"],
    ["340", "figure2"],
    ["120", "figure3"],
  ];
  const figuresBand = el("div", {
    className: "b-figures",
    children: [
      el("div", {
        className: "b-wrap b-figures__inner",
        children: figures.map(([value, label]) =>
          el("div", { className: "b-figure", children: [el("strong", { children: [value] }), el("span", { text: k(label) })] }),
        ),
      }),
    ],
  });

  const fields = el("div", {
    className: "b-section",
    children: [
      el("div", {
        className: "b-wrap",
        children: [
          el("h4", { className: "b-heading", text: k("fieldsTitle") }),
          el("ul", {
            className: "b-fields",
            children: (["field1", "field2", "field3", "field4", "field5", "field6"] as const).map((f) =>
              el("li", { className: "b-field", text: k(f) }),
            ),
          }),
        ],
      }),
    ],
  });

  const steps = el("div", {
    className: "b-section b-section--grey",
    children: [
      el("div", {
        className: "b-wrap",
        children: [
          el("h4", { className: "b-heading", text: k("stepsTitle") }),
          el("ol", {
            className: "b-steps",
            children: (
              [
                ["step1Title", "step1Text"],
                ["step2Title", "step2Text"],
                ["step3Title", "step3Text"],
              ] as const
            ).map(([title, text]) =>
              el("li", { className: "b-step", children: [el("h5", { text: k(title) }), el("p", { text: k(text) })] }),
            ),
          }),
        ],
      }),
    ],
  });

  const cta = el("div", {
    className: "b-cta",
    children: [
      el("div", {
        className: "b-wrap b-cta__inner",
        children: [
          el("h4", { text: k("ctaTitle") }),
          el("span", { className: "b-button b-button--light", text: k("ctaButton") }),
        ],
      }),
    ],
  });

  const footer = el("div", {
    className: "b-footer",
    children: [
      el("div", {
        className: "b-wrap b-footer__inner",
        children: [
          el("div", {
            children: [
              el("p", { className: "b-footer__brand", children: [data.company] }),
              el("p", { text: k("footerAbout") }),
            ],
          }),
          el("div", {
            children: [
              el("p", { children: [PLACEHOLDER.address] }),
              el("p", { children: [PLACEHOLDER.phone] }),
              el("p", { children: [PLACEHOLDER.email(data.slug)] }),
            ],
          }),
          el("div", {
            children: [el("p", { text: k("footerLegal") }), el("p", { text: k("footerPrivacy") })],
          }),
        ],
      }),
      el("div", { className: "b-wrap", children: [copyright(data.company, "b-footer__copy")] }),
    ],
  });

  return el("div", {
    className: "tpl tpl-building",
    children: [topbar, header, hero, intro, figuresBand, fields, steps, cta, footer],
  });
}
