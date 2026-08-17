"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { locales } from "@/i18n/config";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-1 rounded-full border border-[var(--border)] bg-[var(--panel)] p-1 shadow-sm">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            onClick={() => setLocale(l)}
            aria-label={`Switch to ${l}`}
            className={`relative px-3 py-1.5 text-sm rounded-full transition-colors ${
              active ? "text-[var(--accent-contrast)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="active-locale-pill"
                className="absolute inset-0 bg-[var(--accent)] rounded-full shadow-[0_0_10px_var(--glow)]"
                transition={{ type: "spring", duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{l.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}