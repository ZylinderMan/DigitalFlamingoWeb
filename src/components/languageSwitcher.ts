import { getAvailableLocales, getLocale, getLocaleInfo, onLocaleChange, setLocale } from "../i18n";
import { el } from "../utils/dom";

/** One button per registered language, built automatically from the locale registry */
export function createLanguageSwitcher(): HTMLElement {
  const group = el("div", {
    className: "lang-switcher",
    attrs: { role: "group" },
    textAttrs: { "aria-label": "nav.languageSwitcher" },
  });

  const buttons = getAvailableLocales().map((locale) => {
    const info = getLocaleInfo(locale);
    const button = el("button", {
      className: "lang-switcher__button",
      attrs: { type: "button", lang: info.htmlLang, title: info.label, "aria-label": info.label },
      children: [info.short],
    });
    button.addEventListener("click", () => setLocale(locale));
    return { locale, button };
  });

  const syncPressed = () => {
    const active = getLocale();
    buttons.forEach(({ locale, button }) => button.setAttribute("aria-pressed", String(locale === active)));
  };

  syncPressed();
  onLocaleChange(syncPressed);

  group.append(...buttons.map(({ button }) => button));
  return group;
}
