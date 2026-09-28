import type { SectionDefinition } from "./types";
import { el } from "../utils/dom";

/** Wraps a section's content in the standard <section> shell */
export function createSection(definition: SectionDefinition, index: number): HTMLElement {
  const showDivider = index > 0 && definition.divider !== false;

  const section = el("section", {
    className: ["section", definition.className].filter(Boolean).join(" "),
    attrs: {
      id: definition.id,
      "data-tone": definition.tone ?? "base",
      "data-divider": String(showDivider),
      "data-full-height": String(definition.fullHeight ?? false),
    },
  });

  const inner = el("div", { className: "section__inner", children: definition.render() });
  section.append(inner);
  return section;
}
