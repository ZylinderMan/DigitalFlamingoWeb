import type { TranslationKey } from "../i18n";

/** Background variant — maps to semantic colours in theme.css */
export type SectionTone = "base" | "raised" | "accent";

export interface SectionDefinition {
  /** Unique id, also used as the anchor (#id) for navigation */
  id: string;
  /** If set, the section gets a link in the header navigation */
  navLabel?: TranslationKey;
  /** Background variant. Default: "base" */
  tone?: SectionTone;
  /** Show the subtle divider above this section. Default: true (never shown on the first section) */
  divider?: boolean;
  /** Make the section fill the screen height. Default: false */
  fullHeight?: boolean;
  /** Extra CSS class on the <section> element, for section-specific styling */
  className?: string;
  /** Builds the section's content (everything inside the centred container) */
  render: () => Node[];
}
