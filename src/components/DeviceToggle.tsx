"use client";

import { Monitor, Smartphone } from "lucide-react";
import type { Device } from "@/types/device";

export default function DeviceToggle({
  device,
  onChange,
}: {
  device: Device;
  onChange: (device: Device) => void;
}) {
  return (
    <div className="flex md:flex-col gap-3 shrink-0">
      <button
        onClick={() => onChange("pc")}
        aria-label="Desktop view"
        className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
          device === "pc"
            ? "border-white bg-neutral-800 text-white"
            : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <Monitor size={18} />
      </button>
      <button
        onClick={() => onChange("phone")}
        aria-label="Mobile view"
        className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
          device === "phone"
            ? "border-white bg-neutral-800 text-white"
            : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <Smartphone size={18} />
      </button>
    </div>
  );
}