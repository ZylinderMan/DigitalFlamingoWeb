import { defaultLocale, locales, type Locale } from "./locales";
import type { TranslationKey } from "./types";

export type { Locale } from "./locales";
export type { TranslationKey } from "./types";

const STORAGE_KEY = "site.locale";

type Listener = (locale: Locale) => void;
const listeners = new Set<Listener>();

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && Object.hasOwn(locales, value);
}

/** Saved choice → browser language → default */
function detectInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* storage unavailable (private mode etc.) — ignore */
  }
  for (const lang of navigator.languages ?? [navigator.language]) {
    const base = lang.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

let current: Locale = detectInitialLocale();

export function getLocale(): Locale {
  return current;
}

export function getAvailableLocales(): Locale[] {
  return Object.keys(locales) as Locale[];
}

export function getLocaleInfo(locale: Locale) {
  return locales[locale];
}

/** Values for {placeholders} in a translation, e.g. { company: "Dupont" } */
export type TranslationParams = Record<string, string | number>;

function lookup(key: TranslationKey, locale: Locale): string | undefined {
  let node: unknown = locales[locale].dictionary;
  for (const part of key.split(".")) {
    node = typeof node === "object" && node !== null ? (node as Record<string, unknown>)[part] : undefined;
  }
  return typeof node === "string" ? node : undefined;
}

function interpolate(text: string, params: TranslationParams): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}

/**
 * Translate a key in the current language, filling in {placeholders}.
 * Falls back to the default language, then to the key itself.
 */
export function t(key: TranslationKey, params?: TranslationParams): string {
  let text = lookup(key, current) ?? lookup(key, defaultLocale);
  if (text === undefined) {
    console.warn(`[i18n] Missing translation for "${key}"`);
    text = key;
  }
  return params ? interpolate(text, params) : text;
}

/**
 * Re-translate everything already on the page:
 *   data-i18n="hero.title"                       → textContent
 *   data-i18n-params='{"company":"Dupont"}'      → values for {placeholders}
 *   data-i18n-attrs='{"aria-label":"nav.home"}'  → attributes
 */
export function applyTranslations(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((node) => {
    const params = node.dataset.i18nParams ? (JSON.parse(node.dataset.i18nParams) as TranslationParams) : undefined;
    node.textContent = t(node.dataset.i18n as TranslationKey, params);
  });

  root.querySelectorAll<HTMLElement>("[data-i18n-attrs]").forEach((node) => {
    const map = JSON.parse(node.dataset.i18nAttrs ?? "{}") as Record<string, TranslationKey>;
    for (const [attr, key] of Object.entries(map)) node.setAttribute(attr, t(key));
  });

  document.title = t("meta.title");
  document.documentElement.lang = locales[current].htmlLang;
}

/** Switch language instantly (no reload) */
export function setLocale(locale: Locale): void {
  if (locale === current) return;
  current = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  applyTranslations();
  listeners.forEach((listener) => listener(locale));
}

/** Run code whenever the language changes. Returns an unsubscribe function. */
export function onLocaleChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
