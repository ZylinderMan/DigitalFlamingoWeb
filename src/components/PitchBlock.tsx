"use client";

import { useState } from "react";
import { motion, Variants, Easing } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import DeviceToggle from "./DeviceToggle";
import WebsiteEmbed from "./WebsiteEmbed";
import type { Device } from "@/types/device";

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

export default function PitchBlock() {
  const { t } = useLanguage();
  const [device, setDevice] = useState<Device>("pc");
  const words = t.pitch.heading.split(" ");

  const headingRevealTime = 0.1 + (words.length - 1) * WORD_STAGGER + WORD_DURATION;

  return (
    <div className="flex flex-col md:flex-row items-center gap-14 md:gap-10">
      <div className="flex-1 flex flex-col items-end text-right md:max-w-md">
        <motion.h2
          key={t.pitch.heading}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="flex flex-wrap justify-end gap-x-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug"
        >
          {words.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block pb-1">
              <motion.span variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.p
          key={`${t.pitch.description}-sub`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: headingRevealTime }}
          className="mt-4 text-base sm:text-lg text-neutral-400"
        >
          {t.pitch.description}
        </motion.p>
      </div>

      <DeviceToggle device={device} onChange={setDevice} />

      <div className="flex-1 flex justify-center">
        <WebsiteEmbed device={device} />
      </div>
    </div>
  );
}