import type { SectionDefinition } from "./types";
import { el } from "../utils/dom";
import { openDemoDialog } from "../demo/demoDialog";

export const demoSection: SectionDefinition = {
  id: "demo",
  navLabel: "nav.demo",
  className: "demo",
  render: () => {
    const button = el("button", {
      className: "button",
      text: "demo.cta",
      attrs: { type: "button", "aria-haspopup": "dialog" },
    });
    button.addEventListener("click", () => openDemoDialog());

    return [
      el("div", {
        className: "demo__panel",
        children: [
          el("div", {
            children: [
              el("h2", { className: "section__title", text: "demo.title" }),
              el("p", { className: "section__lead", text: "demo.lead" }),
            ],
          }),
          button,
        ],
      }),
    ];
  },
};
