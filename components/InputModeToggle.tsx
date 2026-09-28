"use client";

import { List, Zap } from "lucide-react";

export type InputMode = "selection" | "quick";

interface InputModeToggleProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

export default function InputModeToggle({
  mode,
  onModeChange,
}: InputModeToggleProps) {
  return (
    <div className="grid grid-cols-2 bg-muted/60 p-1 rounded-xl">
      <button
        type="button"
        onClick={() => onModeChange("selection")}
        className={`
          h-9 px-1 rounded-lg font-semibold text-xs whitespace-nowrap transition-all duration-200
          flex items-center justify-center gap-1
          ${
            mode === "selection"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
        aria-pressed={mode === "selection"}
        aria-label="Chế độ chọn từ danh sách"
      >
        <List className="hidden min-[400px]:block w-3.5 h-3.5 shrink-0" />
        Danh sách
      </button>

      <button
        type="button"
        onClick={() => onModeChange("quick")}
        className={`
          h-9 px-1 rounded-lg font-semibold text-xs whitespace-nowrap transition-all duration-200
          flex items-center justify-center gap-1
          ${
            mode === "quick"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
        aria-pressed={mode === "quick"}
        aria-label="Chế độ nhập nhanh toàn bộ địa chỉ"
      >
        <Zap className="hidden min-[400px]:block w-3.5 h-3.5 shrink-0" />
        Nhập nhanh
      </button>
    </div>
  );
}
