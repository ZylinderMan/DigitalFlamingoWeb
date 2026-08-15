"use client";

import { useEffect, useRef } from "react";

const MIN_THUMB_HEIGHT = 48;

export default function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    function update() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const trackHeight = track!.clientHeight;

      const thumbHeight = Math.max(
        (window.innerHeight / doc.scrollHeight) * trackHeight,
        MIN_THUMB_HEIGHT
      );
      const travel = trackHeight - thumbHeight;
      const fraction = scrollable > 0 ? window.scrollY / scrollable : 0;

      thumb!.style.height = `${thumbHeight}px`;
      thumb!.style.transform = `translateY(${fraction * travel}px)`;
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // Content height can change dynamically here (language switch,
    // device toggle animating the embed's size, etc.) without a
    // scroll event firing, so also watch the document for size changes.
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, []);

  function onThumbPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = window.scrollY;
    // Temporarily disable smooth-scroll so dragging tracks the cursor 1:1
    document.documentElement.style.scrollBehavior = "auto";

    function onMove(ev: PointerEvent) {
      if (!isDragging.current || !trackRef.current) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const trackHeight = trackRef.current.clientHeight;
      const thumbHeight = thumbRef.current?.clientHeight ?? MIN_THUMB_HEIGHT;
      const travel = trackHeight - thumbHeight;
      const deltaY = ev.clientY - dragStartY.current;
      const deltaScroll = travel > 0 ? (deltaY / travel) * scrollable : 0;
      const newScroll = Math.min(Math.max(dragStartScroll.current + deltaScroll, 0), scrollable);
      window.scrollTo({ top: newScroll });
    }

    function onUp() {
      isDragging.current = false;
      document.documentElement.style.scrollBehavior = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function onTrackPointerDown(e: React.PointerEvent) {
    // Ignore clicks that originated on the thumb itself (handled above)
    if (e.target !== e.currentTarget || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const thumbHeight = thumbRef.current?.clientHeight ?? MIN_THUMB_HEIGHT;
    const travel = rect.height - thumbHeight;
    const fraction = Math.min(Math.max((clickY - thumbHeight / 2) / travel, 0), 1);

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    window.scrollTo({ top: fraction * scrollable, behavior: "smooth" });
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={onTrackPointerDown}
      className="fixed right-2 top-4 bottom-4 z-40 w-2.5 rounded-full border border-neutral-800 bg-neutral-900 overflow-hidden select-none hidden sm:block"
    >
      <div
        ref={thumbRef}
        onPointerDown={onThumbPointerDown}
        className="absolute left-0 top-0 w-full rounded-full bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400 transition-colors cursor-grab active:cursor-grabbing touch-none"
      />
    </div>
  );
}