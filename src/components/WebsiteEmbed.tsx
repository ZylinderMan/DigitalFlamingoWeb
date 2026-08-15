"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Circle, Square } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Device } from "@/types/device";

const DIMENSIONS: Record<Device, { width: number; height: number }> = {
  pc: { width: 520, height: 340 },
  phone: { width: 260, height: 520 },
};

export default function WebsiteEmbed({ device }: { device: Device }) {
  const { locale } = useLanguage();
  const src = `/mock-site/${locale}/index.html`;
  const { width, height } = DIMENSIONS[device];

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ width, height }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`max-w-full overflow-hidden shadow-2xl ${
          device === "pc"
            ? "rounded-xl border border-neutral-800 bg-neutral-900"
            : "rounded-[2rem] border-[6px] border-neutral-800 bg-neutral-900"
        }`}
      >
        {device === "pc" ? (
          <>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800/80 border-b border-neutral-800">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 text-[10px] text-neutral-500 truncate">yoursite.com</span>
            </div>
            <iframe
              key={src}
              src={src}
              title="Website preview"
              className="w-full bg-white"
              style={{ height: "calc(100% - 2.25rem)" }}
            />
          </>
        ) : (
          <>
            <div className="flex justify-center pt-1.5 pb-1">
              <span className="w-10 h-1.5 rounded-full bg-neutral-700" />
            </div>
            <iframe
              key={src}
              src={src}
              title="Website preview"
              className="w-full bg-white"
              style={{ height: "calc(100% - 1.5rem)" }}
            />
          </>
        )}
      </motion.div>

      {device === "phone" && (
        <div className="flex items-center gap-5 text-neutral-600">
          <ChevronLeft size={14} />
          <Circle size={14} />
          <Square size={12} />
        </div>
      )}
    </div>
  );
}