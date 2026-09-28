import { t, type TranslationKey, type TranslationParams } from "../i18n";

export interface ElementOptions {
  className?: string;
  /** Translated text content; updates automatically on language change */
  text?: TranslationKey;
  /** Values for {placeholders} in `text` */
  params?: TranslationParams;
  /** Translated attributes, e.g. { "aria-label": "nav.home" } */
  textAttrs?: Record<string, TranslationKey>;
  /** Plain (non-translated) attributes. Use "" for boolean attributes like hidden. */
  attrs?: Record<string, string>;
  children?: Array<Node | string>;
}

/**
 * Small helper to build DOM elements with translation support.
 *
 *   el("h2", { className: "section__title", text: "services.title" })
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  if (options.className) node.className = options.className;

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) node.setAttribute(name, value);
  }

  if (options.text) setText(node, options.text, options.params);

  if (options.textAttrs) {
    node.dataset.i18nAttrs = JSON.stringify(options.textAttrs);
    for (const [name, key] of Object.entries(options.textAttrs)) node.setAttribute(name, t(key));
  }

  if (options.children) node.append(...options.children);

  return node;
}

/** Change which translation an existing element shows (keeps it live-translated) */
export function setText(node: HTMLElement, key: TranslationKey, params?: TranslationParams): void {
  node.dataset.i18n = key;
  if (params) node.dataset.i18nParams = JSON.stringify(params);
  else delete node.dataset.i18nParams;
  node.textContent = t(key, params);
}
