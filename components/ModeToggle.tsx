"use client";

import { ArrowUpDown } from "lucide-react";
import type { ConversionMode } from "@/types/address";

interface ModeToggleProps {
  mode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
}

// Single swap button: shows the current direction, tap to flip it
export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const isOldToNew = mode === "old-to-new";

  return (
    <button
      type="button"
      onClick={() => onModeChange(isOldToNew ? "new-to-old" : "old-to-new")}
      className="
        w-full h-11 px-2 rounded-xl
        bg-secondary text-secondary-foreground
        font-semibold text-xs whitespace-nowrap
        flex items-center justify-center gap-1.5
        hover:bg-secondary/90 active:scale-[0.98] transition-all duration-200
      "
      aria-label={
        isOldToNew
          ? "Đang chuyển từ 63 tỉnh thành cũ sang 34 tỉnh thành mới. Nhấn để đổi chiều"
          : "Đang chuyển từ 34 tỉnh thành mới sang 63 tỉnh thành cũ. Nhấn để đổi chiều"
      }
    >
      <span>
        {isOldToNew ? "Cũ (63)" : "Mới (34)"} → {isOldToNew ? "Mới (34)" : "Cũ (63)"}
      </span>
      <ArrowUpDown className="hidden min-[400px]:block w-3.5 h-3.5 shrink-0 opacity-70" />
    </button>
  );
}
