"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { ShowcaseTab } from "./ShowcasePanel";

const TABS: ShowcaseTab[] = ["uiux", "database", "payment"];

const BUTTON_HEIGHT = 48;
const GAP = 16;
const TOTAL_HEIGHT = BUTTON_HEIGHT * TABS.length + GAP * (TABS.length - 1);
const CENTERS = TABS.map((_, i) => BUTTON_HEIGHT / 2 + i * (BUTTON_HEIGHT + GAP));
const MID_CENTER = CENTERS[1];
const CORNER_RADIUS = 16;
const TRUNK_INSET = 32;

// Each tab gets its own palette color instead of the shared accent pink —
// this is the experiment: borders/active-states drawn from blue/green/cream.
const TAB_COLORS: Record<ShowcaseTab, { solid: string; glow: string }> = {
  uiux: { solid: "var(--palette-blue-deep)", glow: "rgba(168, 196, 226, 0.6)" },
  database: { solid: "var(--palette-green-deep)", glow: "rgba(168, 221, 160, 0.6)" },
  payment: { solid: "var(--palette-cream-deep)", glow: "rgba(224, 201, 154, 0.6)" },
};

type Point = { x: number; y: number };

function dist(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function pointTowards(from: Point, to: Point, distance: number): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: from.x + (dx / len) * distance, y: from.y + (dy / len) * distance };
}

function roundedPath(points: Point[], radius: number): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const r = Math.min(radius, dist(prev, curr) / 2, dist(curr, next) / 2);
    const start = pointTowards(curr, prev, r);
    const end = pointTowards(curr, next, r);
    d += ` L ${start.x} ${start.y} Q ${curr.x} ${curr.y} ${end.x} ${end.y}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

export default function ShowcaseButtons({
  selected,
  onSelect,
}: {
  selected: ShowcaseTab;
  onSelect: (tab: ShowcaseTab) => void;
}) {
  const { t } = useLanguage();
  const connectorRef = useRef<HTMLDivElement>(null);
  const [connectorWidth, setConnectorWidth] = useState(160);

  useEffect(() => {
    const el = connectorRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setConnectorWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectedIndex = TABS.indexOf(selected);
  const trunkX = Math.max(connectorWidth - TRUNK_INSET, 40);

  function pathFor(index: number): string {
    return roundedPath(
      [
        { x: 0, y: MID_CENTER },
        { x: trunkX, y: MID_CENTER },
        { x: trunkX, y: CENTERS[index] },
        { x: connectorWidth, y: CENTERS[index] },
      ],
      CORNER_RADIUS
    );
  }

  const activePath = pathFor(selectedIndex);

  return (
    <div className="flex-1 min-w-0 flex items-center">
      <div ref={connectorRef} className="flex-1 min-w-[60px] hidden md:block" style={{ height: TOTAL_HEIGHT }}>
        <svg width={connectorWidth} height={TOTAL_HEIGHT} className="overflow-visible">
          {TABS.map((_, i) => (
            <path
              key={i}
              d={pathFor(i)}
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          ))}

          <motion.path
            fill="none"
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={{ d: activePath, stroke: TAB_COLORS[selected].solid }}
            transition={{ type: "spring", duration: 0.5 }}
            style={{ filter: `drop-shadow(0 0 4px ${TAB_COLORS[selected].glow})` }}
          />
        </svg>
      </div>

      <div className="flex flex-col shrink-0" style={{ gap: GAP }}>
        {TABS.map((tab) => {
          const active = tab === selected;
          return (
            <button
              key={tab}
              onClick={() => onSelect(tab)}
              style={{
                height: BUTTON_HEIGHT,
                ...(active
                  ? {
                      borderColor: TAB_COLORS[tab].solid,
                      backgroundColor: TAB_COLORS[tab].solid,
                      boxShadow: `0 0 12px ${TAB_COLORS[tab].glow}`,
                    }
                  : {}),
              }}
              className={`min-w-[130px] px-5 rounded-lg border text-sm font-medium transition-colors ${
                active
                  ? "text-[var(--foreground)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t.showcase.buttons[tab]}
            </button>
          );
        })}
      </div>
    </div>
  );
}