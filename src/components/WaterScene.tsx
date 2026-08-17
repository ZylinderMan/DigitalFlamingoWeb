"use client";

import { motion } from "framer-motion";

const WAVE_HEIGHT = 24; // px — matches the wave SVG's own viewBox height

interface WaterSceneProps {
  height: string; // height of the flat water body, below the wave crest
  waterColor: string;
  bubbleColor: string;
  bubbleCount?: number;
  fadeBottom?: boolean;
}

export default function WaterScene({
  height,
  waterColor,
  bubbleColor,
  bubbleCount = 10,
  fadeBottom = false,
}: WaterSceneProps) {
  const maskStyle = fadeBottom
    ? {
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
      }
    : {};

  return (
    <div
      className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none"
      style={{ height: `calc(${height} + ${WAVE_HEIGHT}px)`, ...maskStyle }}
      aria-hidden="true"
    >
      {/* Wave crest: rendered above the flat body, over open (transparent)
          space, so its silhouette is genuinely visible — rather than being
          same-color paint sitting on top of an already same-color parent. */}
      <div
        className="absolute top-0 left-0 flex"
        style={{ width: "200%", height: WAVE_HEIGHT, animation: "wave-scroll 7s linear infinite" }}
      >
        {[0, 1].map((i) => (
          <svg key={i} width="50%" height={WAVE_HEIGHT} viewBox="0 0 400 24" preserveAspectRatio="none">
            <path
              d="M0 12 Q25 0 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 V24 H0 Z"
              fill={waterColor}
            />
          </svg>
        ))}
      </div>

      {/* Flat water body — starts exactly where the wave's own baseline
          sits, so the two connect with zero seam (identical solid color). */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: WAVE_HEIGHT, backgroundColor: waterColor }}>
        {Array.from({ length: bubbleCount }).map((_, i) => (
          <Bubble key={i} index={i} color={bubbleColor} />
        ))}
      </div>
    </div>
  );
}

function Bubble({ index, color }: { index: number; color: string }) {
  const left = 4 + ((index * 29) % 92);
  const bottomPercent = 6 + ((index * 53) % 82);
  const size = 5 + (index % 5) * 2;
  const duration = 3.5 + (index % 6) * 0.6;
  const delay = (index * 0.35) % 5;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{ left: `${left}%`, bottom: `${bottomPercent}%`, width: size, height: size, backgroundColor: color }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: [0, -50], opacity: [0, 0.85, 0.85, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}