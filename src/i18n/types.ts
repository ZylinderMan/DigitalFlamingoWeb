import type { en } from "./locales/en";

/** Same shape as the English dictionary, but every value is just `string` */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type Dictionary = Widen<typeof en>;

/** All valid dotted keys, e.g. "hero.title" | "nav.home" | … */
type Paths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type TranslationKey = Paths<Dictionary>;
