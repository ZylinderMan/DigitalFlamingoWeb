"use client";

import { motion } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SUN_SIZE = "clamp(220px, 58vh, 620px)";
const SUN_LEFT = "2%";
const SUN_START_BOTTOM = "-100vh"; // relative to the clip wrapper below — comfortably off-screen at start
// Relative to the clip wrapper's own bottom edge (= the water's top edge).
// Negative tucks part of the sun below that line — same visual proportion
// as before, but now it's physically clipped there, so it can never show
// through even where the water itself fades to transparent.
const SUN_FINAL_BOTTOM = "-22vh";

const SUN_COLOR = "#FFC93C";
const SUN_GLOW_COLOR = "#FFE9A8";
const RAY_COLOR = "#FFDD70";

interface Ray {
  angle: number;
  distanceFactor: number;
  size: number;
  opacity: number;
}

const RAYS: Ray[] = [
  { angle: 0, distanceFactor: 0.62, size: 22, opacity: 0.85 },
  { angle: 32, distanceFactor: 0.78, size: 30, opacity: 0.55 },
  { angle: 64, distanceFactor: 0.58, size: 20, opacity: 0.9 },
  { angle: 96, distanceFactor: 0.85, size: 34, opacity: 0.45 },
  { angle: 128, distanceFactor: 0.6, size: 22, opacity: 0.85 },
  { angle: 160, distanceFactor: 0.8, size: 32, opacity: 0.5 },
  { angle: 192, distanceFactor: 0.64, size: 24, opacity: 0.8 },
  { angle: 224, distanceFactor: 0.82, size: 33, opacity: 0.48 },
  { angle: 256, distanceFactor: 0.59, size: 21, opacity: 0.88 },
  { angle: 288, distanceFactor: 0.76, size: 29, opacity: 0.55 },
  { angle: 320, distanceFactor: 0.61, size: 22, opacity: 0.85 },
  { angle: 350, distanceFactor: 0.83, size: 35, opacity: 0.45 },
];

function Shine({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity, display: "block" }}>
      <path d="M12 2 Q15 9 22 12 Q15 15 12 22 Q9 15 2 12 Q9 9 12 2 Z" fill={RAY_COLOR} />
    </svg>
  );
}

export default function HeroSunrise({
  waterHeight,
  riseDelay,
  riseDuration,
  raysDelay,
  raysGrowDuration,
}: {
  waterHeight: string;
  riseDelay: number;
  riseDuration: number;
  raysDelay: number;
  raysGrowDuration: number;
}) {
  return (
    // Hard clip: nothing inside this box can ever render below the water's
    // own top edge. This is what guarantees the sun stays invisible below
    // the waterline, independent of the water's own opacity/fade.
    <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ bottom: waterHeight }} aria-hidden="true">
      <motion.div
        className="absolute"
        style={{ left: SUN_LEFT, width: SUN_SIZE, height: SUN_SIZE }}
        initial={{ bottom: SUN_START_BOTTOM }}
        animate={{ bottom: SUN_FINAL_BOTTOM }}
        transition={{ duration: riseDuration, delay: riseDelay, ease: EASE_OUT }}
      >
        <div
          className="absolute rounded-full blur-3xl"
          style={{ inset: "-15%", backgroundColor: SUN_GLOW_COLOR, opacity: 0.55 }}
        />

        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: SUN_COLOR,
            boxShadow: "inset 0 0 0 8px rgba(255,167,38,0.35), 0 0 70px 14px rgba(255,201,60,0.45)",
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: "50% 50%" }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: raysDelay, duration: raysGrowDuration, ease: EASE_OUT }}
          >
            {RAYS.map((ray, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${ray.angle}deg) translateX(calc(${SUN_SIZE} * ${ray.distanceFactor}))`,
                }}
              >
                <Shine size={ray.size} opacity={ray.opacity} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}