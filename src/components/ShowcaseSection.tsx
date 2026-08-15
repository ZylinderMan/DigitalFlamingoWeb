"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants, Easing } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import ShowcasePanel from "./ShowcasePanel";
import type { ShowcaseTab } from "./ShowcasePanel";
import ShowcaseButtons from "./ShowcaseButtons";

const WORD_STAGGER = 0.05;
const WORD_DURATION = 0.5;
const SOFT_BACK_OUT_EASE: Easing = [0.3, 1.2, 0.6, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: WORD_STAGGER, delayChildren: 0.1 } },
};

const wordVariants: Variants = {
  hidden: { y: "40%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: WORD_DURATION, ease: SOFT_BACK_OUT_EASE } },
};

export default function ShowcaseSection() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<ShowcaseTab>("uiux");
  const words = t.showcase.heading.split(" ");

  return (
    <section className="min-h-screen w-full flex items-center px-6 py-24">
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 md:gap-0">
        {/* Left: mini player */}
        <div className="flex-1 max-w-md w-full">
          <ShowcasePanel selected={selected} />
        </div>

        {/* Center: buttons + connector (touches the panel, zero gap on desktop) */}
        <ShowcaseButtons selected={selected} onSelect={setSelected} />

        {/* Right: heading + description */}
        <div className="flex-1 flex flex-col items-start text-left md:max-w-sm md:pl-10">
          <motion.h2
            key={t.showcase.heading}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="flex flex-wrap justify-start gap-x-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug"
          >
            {words.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-1">
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.p
              key={selected}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="mt-4 text-sm sm:text-base text-neutral-400"
            >
              {t.showcase.descriptions[selected]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}