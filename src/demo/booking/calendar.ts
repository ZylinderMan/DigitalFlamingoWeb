import { getLocale, getLocaleInfo, t } from "../../i18n";
import { el } from "../../utils/dom";

export interface CalendarOptions {
  /** Days of the week that can't be booked: 0 = Sunday … 6 = Saturday */
  closedWeekdays: number[];
  /** How many months ahead visitors can browse. Default: 6 */
  monthsAhead?: number;
  /** Called whenever the visitor picks a day */
  onSelect?: (date: Date) => void;
}

export interface Calendar {
  element: HTMLElement;
  getSelected(): Date | null;
  /** Clear the selection and go back to the current month */
  reset(): void;
  /** Redraw (e.g. after a language change) */
  refresh(): void;
  /** Move keyboard focus to the selected day, or the first available one */
  focus(): void;
}

const lang = () => getLocaleInfo(getLocale()).dateLocale;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase(lang()) + text.slice(1);

/** "Wednesday 14 October 2026" in the current language */
export function formatLongDate(date: Date): string {
  return capitalize(
    new Intl.DateTimeFormat(lang(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date),
  );
}

const chevron = (d: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

/** Month calendar with Monday-first weeks; past and closed days are disabled */
export function createCalendar(options: CalendarOptions): Calendar {
  const monthsAhead = options.monthsAhead ?? 6;
  let today = startOfDay(new Date());
  let selected: Date | null = null;
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  const title = el("p", { className: "calendar__title", attrs: { "aria-live": "polite" } });
  const prev = el("button", {
    className: "calendar__nav",
    attrs: { type: "button" },
    textAttrs: { "aria-label": "mockup.booking.prevMonth", title: "mockup.booking.prevMonth" },
  });
  prev.innerHTML = chevron("M15 6l-6 6 6 6");
  const next = el("button", {
    className: "calendar__nav",
    attrs: { type: "button" },
    textAttrs: { "aria-label": "mockup.booking.nextMonth", title: "mockup.booking.nextMonth" },
  });
  next.innerHTML = chevron("M9 6l6 6-6 6");

  const weekdays = el("div", { className: "calendar__weekdays", attrs: { "aria-hidden": "true" } });
  const grid = el("div", { className: "calendar__grid" });

  const element = el("div", {
    className: "calendar",
    children: [el("div", { className: "calendar__head", children: [prev, title, next] }), weekdays, grid],
  });

  const firstMonth = () => new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = () => new Date(today.getFullYear(), today.getMonth() + monthsAhead, 1);
  const isOpen = (d: Date) =>
    d >= today &&
    d < new Date(today.getFullYear(), today.getMonth() + monthsAhead + 1, 1) &&
    !options.closedWeekdays.includes(d.getDay());

  function render(): void {
    today = startOfDay(new Date());
    const year = view.getFullYear();
    const month = view.getMonth();

    title.textContent = capitalize(new Intl.DateTimeFormat(lang(), { month: "long", year: "numeric" }).format(view));
    prev.disabled = view <= firstMonth();
    next.disabled = view >= lastMonth();

    // Weekday initials, Monday first (1 Jan 2024 was a Monday)
    const weekdayFormat = new Intl.DateTimeFormat(lang(), { weekday: "short" });
    weekdays.replaceChildren(
      ...Array.from({ length: 7 }, (_, i) => el("span", { children: [weekdayFormat.format(new Date(2024, 0, 1 + i))] })),
    );

    const dayLabel = new Intl.DateTimeFormat(lang(), { weekday: "long", day: "numeric", month: "long" });
    const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: HTMLElement[] = Array.from({ length: leadingBlanks }, () => el("span"));
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const open = isOpen(date);
      const isSelected = selected !== null && date.getTime() === selected.getTime();
      const button = el("button", {
        className: ["calendar__day", date.getTime() === today.getTime() ? "is-today" : "", isSelected ? "is-selected" : ""]
          .filter(Boolean)
          .join(" "),
        attrs: {
          type: "button",
          "data-day": String(day),
          "aria-pressed": String(isSelected),
          "aria-label": capitalize(dayLabel.format(date)) + (open ? "" : `, ${t("mockup.booking.unavailable")}`),
        },
        children: [String(day)],
      });
      button.disabled = !open;
      button.addEventListener("click", () => {
        selected = date;
        render();
        grid.querySelector<HTMLButtonElement>(`[data-day="${day}"]`)?.focus();
        options.onSelect?.(date);
      });
      cells.push(button);
    }
    grid.replaceChildren(...cells);
  }

  prev.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    render();
  });
  next.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    render();
  });

  render();

  return {
    element,
    getSelected: () => selected,
    reset() {
      selected = null;
      view = firstMonth();
      render();
    },
    refresh: render,
    focus() {
      const target =
        grid.querySelector<HTMLButtonElement>(".calendar__day.is-selected") ??
        grid.querySelector<HTMLButtonElement>(".calendar__day:not(:disabled)") ??
        next;
      target.focus();
    },
  };
}
