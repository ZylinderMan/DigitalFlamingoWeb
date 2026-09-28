import type { SectionDefinition } from "./types";
import type { TranslationKey } from "../i18n";
import { el } from "../utils/dom";

const items: Array<{ title: TranslationKey; text: TranslationKey }> = [
  { title: "services.designTitle", text: "services.designText" },
  { title: "services.buildTitle", text: "services.buildText" },
  { title: "services.securityTitle", text: "services.securityText" },
  { title: "services.functionalityTitle", text: "services.functionalityText" },
  { title: "services.languagesTitle", text: "services.languagesText" },
];

export const servicesSection: SectionDefinition = {
  id: "services",
  navLabel: "nav.services",
  tone: "raised",
  className: "services",
  render: () => [
    el("h2", { className: "section__title", text: "services.title" }),
    el("p", { className: "section__lead", text: "services.lead" }),
    el("ul", {
      className: "services__list",
      children: items.map((item) =>
        el("li", {
          className: "services__item",
          children: [el("h3", { text: item.title }), el("p", { text: item.text })],
        }),
      ),
    }),
  ],
};
