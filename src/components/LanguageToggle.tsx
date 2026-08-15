"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { locales } from "@/i18n/config";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-1 rounded-full border border-neutral-800 bg-neutral-900/80 backdrop-blur p-1">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            onClick={() => setLocale(l)}
            aria-label={`Switch to ${l}`}
            className={`relative px-3 py-1.5 text-sm rounded-full transition-colors ${
              active ? "text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {active && (
              <motion.span
                layoutId="active-locale-pill"
                className="absolute inset-0 bg-neutral-700 rounded-full"
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