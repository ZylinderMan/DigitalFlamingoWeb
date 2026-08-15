"use client";

import { motion, Variants, Easing } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const WORD_STAGGER = 0.08;
const WORD_DURATION = 0.7;
const BACK_OUT_EASE: Easing = [0.34, 1.56, 0.64, 1]; // sharp overshoot, "back out" feel

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: WORD_STAGGER,
      delayChildren: 0.2,
    },
  },
};

const wordVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: WORD_DURATION, ease: BACK_OUT_EASE },
  },
};

export default function Hero() {
  const { t } = useLanguage();
  const words = t.home.heading.split(" ");

  // Exact moment the last word finishes animating in
  const headingRevealTime =
    0.2 + (words.length - 1) * WORD_STAGGER + WORD_DURATION;

  return (
    <section className="snap-start relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6">
      <motion.h1
        key={t.home.heading} // re-plays the animation whenever the language changes
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-x-4 text-5xl sm:text-6xl md:text-8xl font-bold text-white text-center leading-tight"
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block pb-2">
            <motion.span variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        key={`${t.home.tagline}-sub`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: headingRevealTime }}
        className="mt-6 text-lg sm:text-xl text-neutral-400 text-center"
      >
        {t.home.tagline}
      </motion.p>

      <ScrollArrow side="left" delay={headingRevealTime} />
      <ScrollArrow side="right" delay={headingRevealTime} />
    </section>
  );
}

function ScrollArrow({ side, delay }: { side: "left" | "right"; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -160 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`absolute bottom-10 ${
        side === "left" ? "left-6 sm:left-12" : "right-6 sm:right-12"
      }`}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-400"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.8,
        }}
      >
        <path d="M12 5v14" />
        <path d="M19 12l-7 7-7-7" />
      </motion.svg>
    </motion.div>
  );
}