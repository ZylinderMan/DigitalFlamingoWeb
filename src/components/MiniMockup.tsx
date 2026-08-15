"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

type Tab = "home" | "about" | "contact";

export default function MiniMockup() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const tabs: Tab[] = ["home", "about", "contact"];

  return (
    <div className="w-full max-w-sm mx-auto rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden select-none">
      {/* fake browser top bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800/80 border-b border-neutral-800">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[10px] text-neutral-500 truncate">
          yourclient.com/{activeTab === "home" ? "" : activeTab}
        </span>
      </div>

      {/* fake site nav — the interactive part */}
      <div className="flex gap-1 px-3 pt-3">
        {tabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                active
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mockup-active-tab"
                  className="absolute inset-0 bg-neutral-700 rounded-md"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{t.pitch.mockupNav[tab]}</span>
            </button>
          );
        })}
      </div>

      {/* fake page content, swaps with the tab */}
      <div className="relative h-40 px-4 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            <p className="text-sm text-white font-medium">
              {t.pitch.mockupContent[activeTab]}
            </p>
            <div className="h-2 w-4/5 rounded bg-neutral-700" />
            <div className="h-2 w-3/5 rounded bg-neutral-800" />
            <div className="mt-3 h-6 w-20 rounded-full bg-neutral-700" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}