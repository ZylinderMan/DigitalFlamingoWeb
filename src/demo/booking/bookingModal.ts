import { onLocaleChange, type TranslationKey } from "../../i18n";
import { el, setText } from "../../utils/dom";
import { createCalendar, formatLongDate } from "./calendar";

/** A number picker with − / + buttons (e.g. number of guests) */
export interface NumberField {
  kind: "number";
  label: TranslationKey;
  hint?: TranslationKey;
  error: TranslationKey;
  min: number;
  max: number;
  initial: number;
  decreaseLabel: TranslationKey;
  increaseLabel: TranslationKey;
}

/** A dropdown (e.g. type of consultation) */
export interface SelectField {
  kind: "select";
  label: TranslationKey;
  placeholder: TranslationKey;
  error: TranslationKey;
  options: Array<{ value: string; label: TranslationKey }>;
}

export interface BookingModalOptions {
  /** Extra class on the <dialog>, used by the template's CSS to set colours (--bk-*) */
  className: string;
  title: TranslationKey;
  lead: TranslationKey;
  /** Days of the week that can't be booked: 0 = Sunday … 6 = Saturday */
  closedWeekdays: number[];
  field: NumberField | SelectField;
  confirm: TranslationKey;
  successTitle: TranslationKey;
  successText: TranslationKey;
}

export interface BookingModal {
  element: HTMLDialogElement;
  open(): void;
}

interface FieldControl {
  element: HTMLElement;
  /** Returns the display value, or null when invalid */
  read(): Node | null;
  showError(show: boolean): void;
  focus(): void;
  reset(): void;
}

let counter = 0;

const CLOSE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const CHECK_ICON =
  '<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg>';

function errorText(id: string, key: TranslationKey): HTMLElement {
  return el("p", { className: "booking__error", text: key, attrs: { id, hidden: "", role: "alert" } });
}

function buildNumberField(f: NumberField, id: string): FieldControl {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const input = el("input", {
    className: "booking__number",
    attrs: {
      id,
      type: "number",
      inputmode: "numeric",
      min: String(f.min),
      max: String(f.max),
      step: "1",
      value: String(f.initial),
      "aria-describedby": f.hint ? `${hintId} ${errorId}` : errorId,
    },
  });
  const less = el("button", { className: "booking__step", attrs: { type: "button" }, textAttrs: { "aria-label": f.decreaseLabel }, children: ["−"] });
  const more = el("button", { className: "booking__step", attrs: { type: "button" }, textAttrs: { "aria-label": f.increaseLabel }, children: ["+"] });
  const error = errorText(errorId, f.error);

  const current = () => Number(input.value);
  const valid = () => input.value.trim() !== "" && Number.isInteger(current()) && current() >= f.min && current() <= f.max;
  const step = (delta: number) => {
    const base = Number.isFinite(current()) && input.value.trim() !== "" ? Math.round(current()) : f.initial;
    input.value = String(Math.min(f.max, Math.max(f.min, base + delta)));
    control.showError(false);
  };
  less.addEventListener("click", () => step(-1));
  more.addEventListener("click", () => step(1));
  input.addEventListener("input", () => valid() && control.showError(false));

  const control: FieldControl = {
    element: el("div", {
      className: "booking__field",
      children: [
        el("label", { className: "booking__label", text: f.label, attrs: { for: id } }),
        el("div", { className: "booking__stepper", children: [less, input, more] }),
        ...(f.hint ? [el("p", { className: "booking__hint", text: f.hint, attrs: { id: hintId } })] : []),
        error,
      ],
    }),
    read: () => (valid() ? document.createTextNode(String(current())) : null),
    showError(show) {
      error.hidden = !show;
      input.setAttribute("aria-invalid", String(show));
    },
    focus: () => input.focus(),
    reset() {
      input.value = String(f.initial);
      control.showError(false);
    },
  };
  return control;
}

function buildSelectField(f: SelectField, id: string): FieldControl {
  const errorId = `${id}-error`;
  const select = el("select", {
    className: "booking__select",
    attrs: { id, required: "", "aria-describedby": errorId },
    children: [
      el("option", { text: f.placeholder, attrs: { value: "" } }),
      ...f.options.map((option) => el("option", { text: option.label, attrs: { value: option.value } })),
    ],
  });
  const error = errorText(errorId, f.error);
  select.addEventListener("change", () => select.value && control.showError(false));

  const control: FieldControl = {
    element: el("div", {
      className: "booking__field",
      children: [el("label", { className: "booking__label", text: f.label, attrs: { for: id } }), select, error],
    }),
    read() {
      const option = f.options.find((o) => o.value === select.value);
      return option ? el("span", { text: option.label }) : null; // stays translated
    },
    showError(show) {
      error.hidden = !show;
      select.setAttribute("aria-invalid", String(show));
    },
    focus: () => select.focus(),
    reset() {
      select.value = "";
      control.showError(false);
    },
  };
  return control;
}

/**
 * Booking popup used by the sample sites: calendar + one extra field + confirm,
 * then a confirmation screen with a check mark. Nothing is sent anywhere.
 * Styles: src/styles/booking.css (colours come from --bk-* set by the template)
 */
export function createBookingModal(o: BookingModalOptions): BookingModal {
  const id = `booking-${++counter}`;
  let bookedDate: Date | null = null;

  // ---------- Form ----------
  const selectedText = el("p", { className: "booking__selected", text: "mockup.booking.noDate", attrs: { "aria-live": "polite" } });
  const updateSelectedText = () => {
    const date = calendar.getSelected();
    if (date) setText(selectedText, "mockup.booking.selected", { date: formatLongDate(date) });
    else setText(selectedText, "mockup.booking.noDate");
  };

  const dateError = errorText(`${id}-date-error`, "mockup.booking.dateError");
  const calendar = createCalendar({
    closedWeekdays: o.closedWeekdays,
    onSelect: () => {
      dateError.hidden = true;
      updateSelectedText();
    },
  });

  const field = o.field.kind === "number" ? buildNumberField(o.field, `${id}-field`) : buildSelectField(o.field, `${id}-field`);

  const form = el("form", {
    className: "booking__form",
    attrs: { novalidate: "" },
    children: [
      el("p", { className: "booking__lead", text: o.lead }),
      el("fieldset", {
        className: "booking__date",
        children: [
          el("legend", { className: "booking__label", text: "mockup.booking.dateLabel" }),
          calendar.element,
          selectedText,
          dateError,
        ],
      }),
      field.element,
      el("button", { className: "booking__primary", text: o.confirm, attrs: { type: "submit" } }),
    ],
  });

  // ---------- Confirmation ----------
  const summaryDate = el("dd");
  const summaryValue = el("dd");
  const doneButton = el("button", { className: "booking__primary", text: "mockup.booking.done", attrs: { type: "button" } });
  const check = el("div", { className: "booking__check" });
  check.innerHTML = CHECK_ICON;

  const done = el("div", {
    className: "booking__done",
    attrs: { hidden: "", role: "status" },
    children: [
      check,
      el("h4", { className: "booking__title", text: o.successTitle }),
      el("p", { className: "booking__lead", text: o.successText }),
      el("dl", {
        className: "booking__summary",
        children: [
          el("dt", { text: "mockup.booking.dateLabel" }),
          summaryDate,
          el("dt", { text: o.field.label }),
          summaryValue,
        ],
      }),
      el("p", { className: "booking__note", text: "mockup.booking.demoNote" }),
      doneButton,
    ],
  });

  // ---------- Dialog ----------
  const closeButton = el("button", {
    className: "booking__close",
    attrs: { type: "button" },
    textAttrs: { "aria-label": "mockup.booking.close", title: "mockup.booking.close" },
  });
  closeButton.innerHTML = CLOSE_ICON;

  const dialog = el("dialog", {
    className: `booking ${o.className}`,
    attrs: { "aria-labelledby": `${id}-title` },
    children: [
      el("div", {
        className: "booking__panel",
        children: [
          el("div", {
            className: "booking__head",
            children: [el("h4", { className: "booking__title", text: o.title, attrs: { id: `${id}-title` } }), closeButton],
          }),
          form,
          done,
        ],
      }),
    ],
  });

  // ---------- Behaviour ----------
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = calendar.getSelected();
    const value = field.read();
    dateError.hidden = date !== null;
    field.showError(value === null);

    if (!date) return calendar.focus();
    if (!value) return field.focus();

    bookedDate = date;
    summaryDate.textContent = formatLongDate(date);
    summaryValue.replaceChildren(value);
    form.hidden = true;
    done.hidden = false;
    doneButton.focus();
  });

  closeButton.addEventListener("click", () => dialog.close());
  doneButton.addEventListener("click", () => dialog.close());
  // Clicking the dimmed backdrop closes the popup
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  // Start fresh next time
  dialog.addEventListener("close", () => {
    calendar.reset();
    field.reset();
    updateSelectedText();
    dateError.hidden = true;
    bookedDate = null;
    form.hidden = false;
    done.hidden = true;
  });

  // Dates are formatted in code, so redraw them when the language changes
  const unsubscribe = onLocaleChange(() => {
    if (!dialog.isConnected) return unsubscribe();
    calendar.refresh();
    updateSelectedText();
    if (bookedDate) summaryDate.textContent = formatLongDate(bookedDate);
  });

  return {
    element: dialog,
    open() {
      if (!dialog.open) dialog.showModal();
    },
  };
}
