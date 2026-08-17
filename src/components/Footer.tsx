"use client";

import { useLanguage } from "@/context/LanguageContext";
import SectionDivider from "./SectionDivider";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--panel-alt)]">
      <SectionDivider />

      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 sm:grid-cols-3">
        <div>
          <span className="text-lg font-semibold text-[var(--foreground)]">{t.footer.brand}</span>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--muted-strong)] uppercase tracking-wide">
            {t.footer.contactTitle}
          </h3>
          <a href={`mailto:${t.footer.contactEmail}`} className="mt-3 block text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            {t.footer.contactEmail}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--muted-strong)] uppercase tracking-wide">
            {t.footer.faqTitle}
          </h3>
          <ul className="mt-3 space-y-4">
            {t.footer.faqItems.map((item, i) => (
              <li key={i}>
                <p className="text-[var(--foreground)] text-sm font-medium">{item.question}</p>
                <p className="text-[var(--muted)] text-sm mt-1">{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <p className="max-w-7xl mx-auto px-6 py-6 text-sm text-[var(--muted)]">
          © {year} {t.footer.brand}. {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}