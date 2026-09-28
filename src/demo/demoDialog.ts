import { createLanguageSwitcher } from "../components/languageSwitcher";
import type { TranslationKey } from "../i18n";
import { el, setText } from "../utils/dom";
import { createMockup, type MockupData } from "./mockup";
import { findSector, getSector, sectorKey, sectors, type SectorId } from "./sectors";

const MAX_LOGO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_LOGO_TYPES = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif";

/** Anchor shown in the address bar while the form is open (matches the section id) */
const FORM_HASH = "#demo";
/** Anchor shown while a sector's sample site is open, e.g. #demo-restaurant */
const sectorHash = (id: SectorId) => `#demo-${id}`;

interface DemoDialog {
  open(sectorId?: SectorId): void;
}

let instance: DemoDialog | undefined;

/** Opens the full-screen demo (the dialog is built the first time it's needed) */
export function openDemoDialog(sectorId?: SectorId): void {
  instance ??= createDemoDialog();
  instance.open(sectorId);
}

/**
 * Makes links like https://yoursite.fr/#demo-restaurant open the demo
 * with that sector selected (on page load and when the anchor changes).
 */
export function initDemoDeepLinks(): void {
  const check = () => {
    const match = /^#demo-([\w-]+)$/.exec(location.hash);
    const sector = match ? findSector(match[1]) : undefined;
    if (sector) openDemoDialog(sector.id);
  };
  check();
  window.addEventListener("hashchange", check);
}

/** Change the address-bar anchor without scrolling or adding history entries */
function setHash(hash: string): void {
  if (location.hash !== hash) history.replaceState(null, "", hash);
}

function createDemoDialog(): DemoDialog {
  let logoUrl: string | null = null;

  // ---------- Top bar ----------
  const title = el("h2", {
    className: "demo-dialog__title",
    text: "demoForm.title",
    attrs: { id: "demo-dialog-title", tabindex: "-1" },
  });
  const closeButton = el("button", {
    className: "button button--ghost",
    text: "demoDialog.close",
    attrs: { type: "button" },
  });
  const bar = el("div", {
    className: "demo-dialog__bar",
    children: [title, createLanguageSwitcher(), closeButton],
  });

  // ---------- Company name ----------
  const companyInput = el("input", {
    className: "field__input",
    attrs: {
      id: "demo-company",
      name: "company",
      type: "text",
      autocomplete: "organization",
      maxlength: "60",
      required: "",
      "aria-describedby": "demo-company-error",
    },
    textAttrs: { placeholder: "demoForm.companyPlaceholder" },
  });
  const companyError = el("p", {
    className: "field__error",
    text: "demoForm.companyError",
    attrs: { id: "demo-company-error", hidden: "" },
  });
  const companyField = el("div", {
    className: "field",
    children: [
      el("label", { className: "field__label", text: "demoForm.companyLabel", attrs: { for: "demo-company" } }),
      companyInput,
      companyError,
    ],
  });

  // ---------- Sector picker ----------
  const sectorOptions = sectors.map((sector, index) => {
    const input = el("input", {
      className: "visually-hidden",
      attrs: { type: "radio", name: "sector", value: sector.id },
    });
    input.checked = index === 0;
    const icon = el("span", { className: "sector-option__icon" });
    icon.innerHTML = sector.icon;
    return el("label", {
      className: "sector-option",
      children: [
        input,
        icon,
        el("span", { className: "sector-option__name", text: sectorKey(sector.id, "name") }),
        el("span", { className: "sector-option__desc", text: sectorKey(sector.id, "description") }),
      ],
    });
  });
  const sectorField = el("fieldset", {
    className: "field",
    children: [
      el("legend", { className: "field__label", text: "demoForm.sectorLabel" }),
      el("div", { className: "sector-options", children: sectorOptions }),
    ],
  });

  // ---------- Logo upload ----------
  const fileInput = el("input", {
    className: "visually-hidden",
    attrs: { id: "demo-logo", type: "file", accept: ACCEPTED_LOGO_TYPES, "aria-describedby": "demo-logo-hint" },
  });
  const chooseLabel = el("label", {
    className: "button button--ghost logo-picker__choose",
    text: "demoForm.logoChoose",
    attrs: { for: "demo-logo" },
  });
  const previewImage = el("img", { className: "logo-picker__image", attrs: { alt: "" } });
  const fileName = el("span", { className: "logo-picker__name" });
  const removeButton = el("button", {
    className: "logo-picker__remove",
    text: "demoForm.logoRemove",
    attrs: { type: "button" },
  });
  const logoPreview = el("div", {
    className: "logo-picker__preview",
    attrs: { hidden: "" },
    children: [previewImage, fileName, removeButton],
  });
  const logoError = el("p", { className: "field__error", attrs: { hidden: "", role: "alert" } });
  const logoField = el("div", {
    className: "field",
    children: [
      el("span", { className: "field__label", text: "demoForm.logoLabel" }),
      el("div", { className: "logo-picker", children: [fileInput, chooseLabel, logoPreview] }),
      el("p", { className: "field__hint", text: "demoForm.logoHint", attrs: { id: "demo-logo-hint" } }),
      logoError,
    ],
  });

  // ---------- Form ----------
  const form = el("form", {
    className: "demo-form",
    attrs: { novalidate: "" },
    children: [
      companyField,
      sectorField,
      logoField,
      el("button", { className: "button demo-form__submit", text: "demoForm.submit", attrs: { type: "submit" } }),
    ],
  });

  // ---------- Preview ----------
  const preview = el("div", { className: "demo-preview", attrs: { hidden: "" } });

  const body = el("div", { className: "demo-dialog__body", children: [form, preview] });
  const dialog = el("dialog", {
    className: "demo-dialog",
    attrs: { "aria-labelledby": "demo-dialog-title" },
    children: [bar, body],
  });
  document.body.append(dialog);

  // ---------- Behaviour ----------
  function setLogo(url: string | null, name = ""): void {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    logoUrl = url;
    if (url) {
      previewImage.src = url;
      fileName.textContent = name;
      logoPreview.hidden = false;
    } else {
      previewImage.removeAttribute("src");
      logoPreview.hidden = true;
      fileInput.value = "";
    }
  }

  function showLogoError(key: TranslationKey | null): void {
    if (key) setText(logoError, key);
    logoError.hidden = key === null;
  }

  function showCompanyError(show: boolean): void {
    companyError.hidden = !show;
    companyInput.setAttribute("aria-invalid", String(show));
  }

  function selectSector(id: SectorId): void {
    const radio = form.querySelector<HTMLInputElement>(`input[name="sector"][value="${id}"]`);
    if (radio) radio.checked = true;
  }

  function selectedSector() {
    return getSector(String(new FormData(form).get("sector")));
  }

  function showForm(): void {
    setHash(FORM_HASH);
    preview.hidden = true;
    preview.replaceChildren();
    form.hidden = false;
    setText(title, "demoForm.title");
    body.scrollTop = 0;
    companyInput.focus();
  }

  function showPreview(data: MockupData): void {
    setHash(sectorHash(data.sector.id));
    const backButton = el("button", {
      className: "button button--ghost",
      text: "demoPreview.back",
      attrs: { type: "button" },
    });
    backButton.addEventListener("click", showForm);

    preview.replaceChildren(
      el("div", {
        className: "demo-preview__toolbar",
        children: [
          el("p", { className: "demo-preview__notice", text: "demoPreview.notice", params: { company: data.company } }),
          backButton,
        ],
      }),
      createMockup(data),
    );

    form.hidden = true;
    preview.hidden = false;
    setText(title, "demoPreview.title");
    body.scrollTop = 0;
    title.focus();
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    showLogoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      fileInput.value = "";
      showLogoError("demoForm.logoTypeError");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      fileInput.value = "";
      showLogoError("demoForm.logoSizeError");
      return;
    }
    setLogo(URL.createObjectURL(file), file.name);
  });

  removeButton.addEventListener("click", () => {
    setLogo(null);
    fileInput.focus();
  });

  companyInput.addEventListener("input", () => {
    if (companyInput.value.trim()) showCompanyError(false);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const company = companyInput.value.trim();
    if (!company) {
      showCompanyError(true);
      companyInput.focus();
      return;
    }
    showPreview({ company, sector: selectedSector(), logoUrl });
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => setHash(FORM_HASH));

  return {
    open(sectorId) {
      if (!dialog.open) dialog.showModal();

      if (sectorId) {
        selectSector(sectorId);
        // Company already entered earlier: go straight to that sector's site
        const company = companyInput.value.trim();
        if (company) {
          showPreview({ company, sector: selectedSector(), logoUrl });
          return;
        }
      }

      if (form.hidden) setHash(sectorHash(selectedSector().id));
      else showForm();
    },
  };
}
