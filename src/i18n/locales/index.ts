import type { Dictionary } from "../types";
import { en } from "./en";
import { fr } from "./fr";

export interface LocaleDefinition {
  /** Name shown in tooltips, written in its own language */
  label: string;
  /** Short code shown on the switcher button */
  short: string;
  /** Value for <html lang="…"> */
  htmlLang: string;
  /** Regional format for dates written by code, e.g. "en-GB" → "Sunday 1 November 2026" */
  dateLocale: string;
  dictionary: Dictionary;
}

/**
 * REGISTERED LANGUAGES
 * To add a language: create locales/xx.ts (copy fr.ts), import it above,
 * and add one line here. The switcher picks it up automatically.
 */
export const locales = {
  en: { label: "English", short: "EN", htmlLang: "en", dateLocale: "en-GB", dictionary: en },
  fr: { label: "Français", short: "FR", htmlLang: "fr", dateLocale: "fr-FR", dictionary: fr },
} satisfies Record<string, LocaleDefinition>;

export type Locale = keyof typeof locales;

/** Used when the visitor's browser language isn't available, and as fallback for missing keys */
export const defaultLocale: Locale = "en";
