"use client";

import { useLanguage } from "@/context/LanguageContext";
import SectionDivider from "./SectionDivider";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="snap-start bg-neutral-900">
      <SectionDivider />

      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 sm:grid-cols-3">
        <div>
          <span className="text-lg font-semibold text-white">{t.footer.brand}</span>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
            {t.footer.contactTitle}
          </h3>
          <a href={`mailto:${t.footer.contactEmail}`} className="mt-3 block text-neutral-400 hover:text-white transition-colors">
            {t.footer.contactEmail}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
            {t.footer.faqTitle}
          </h3>
          <ul className="mt-3 space-y-4">
            {t.footer.faqItems.map((item, i) => (
              <li key={i}>
                <p className="text-neutral-300 text-sm font-medium">{item.question}</p>
                <p className="text-neutral-500 text-sm mt-1">{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <p className="max-w-7xl mx-auto px-6 py-6 text-sm text-neutral-500">
          © {year} {t.footer.brand}. {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}