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
const TRUNK_INSET = 32; // distance of the vertical trunk from the buttons' edge

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

// Draws a single path through a list of waypoints, replacing each sharp
// interior corner with a short quadratic curve — this is what turns the
// 90-degree elbow into a smooth rounded bend.
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

  // Measures the real available width so the line can stretch to fill
  // whatever gap actually exists between the panel and the buttons,
  // rather than assuming a fixed distance.
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

  const activePath = roundedPath(
    [
      { x: 0, y: MID_CENTER },
      { x: trunkX, y: MID_CENTER },
      { x: trunkX, y: CENTERS[selectedIndex] },
      { x: connectorWidth, y: CENTERS[selectedIndex] },
    ],
    CORNER_RADIUS
  );

  return (
    <div className="flex-1 min-w-0 flex items-center">
      <div ref={connectorRef} className="flex-1 min-w-[60px] hidden md:block" style={{ height: TOTAL_HEIGHT }}>
        <svg width={connectorWidth} height={TOTAL_HEIGHT} className="overflow-visible">
          {/* dim static reference structure: trunk + a branch to every button */}
          <line x1={0} y1={MID_CENTER} x2={trunkX} y2={MID_CENTER} stroke="#404040" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={trunkX} y1={CENTERS[0]} x2={trunkX} y2={CENTERS[2]} stroke="#404040" strokeWidth={1.5} strokeLinecap="round" />
          {CENTERS.map((cy, i) => (
            <line key={i} x1={trunkX} y1={cy} x2={connectorWidth} y2={cy} stroke="#404040" strokeWidth={1.5} strokeLinecap="round" />
          ))}

          {/* bright path tracing the active route, animated + rounded */}
          <motion.path
            fill="none"
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={{ d: activePath }}
            transition={{ type: "spring", duration: 0.5 }}
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
              style={{ height: BUTTON_HEIGHT }}
              className={`min-w-[130px] px-5 rounded-lg border text-sm font-medium transition-colors ${
                active ? "border-white bg-neutral-800 text-white" : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
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