"use client";

import type { ConversionMode } from "@/types/address";

interface ModeToggleProps {
  mode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex bg-muted/60 p-1 rounded-xl">
      <button
        onClick={() => onModeChange("old-to-new")}
        className={`
          px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200
          flex items-center gap-2
          ${
            mode === "old-to-new"
              ? "bg-secondary text-secondary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <span>Cũ → Mới</span>
      </button>

      <button
        onClick={() => onModeChange("new-to-old")}
        className={`
          px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200
          flex items-center gap-2
          ${
            mode === "new-to-old"
              ? "bg-secondary text-secondary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <span>Mới → Cũ</span>
      </button>
    </div>
  );
}
