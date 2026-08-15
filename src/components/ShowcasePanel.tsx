"use client";

import { AnimatePresence, motion } from "framer-motion";
import UIUXGame from "./UIUXGame";
import DatabaseMockup from "./DatabaseMockup";
import PaymentGame from "./PaymentGame";

export type ShowcaseTab = "uiux" | "database" | "payment";

export default function ShowcasePanel({ selected }: { selected: ShowcaseTab }) {
  return (
    <div className="w-full h-[420px] rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden select-none">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800/80 border-b border-neutral-800">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
      </div>

      <div className="relative" style={{ height: "calc(100% - 2.25rem)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {selected === "uiux" && <UIUXGame />}
            {selected === "database" && <DatabaseMockup />}
            {selected === "payment" && <PaymentGame />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}