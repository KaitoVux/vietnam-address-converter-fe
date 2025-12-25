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
    <div className="flex space-x-1">
      <button
        onClick={() => onModeChange("selection")}
        className={`
          px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
          flex items-center gap-2
          ${
            mode === "selection"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        `}
      >
        <List className="w-4 h-4" />
        Chọn từ danh sách
      </button>

      <button
        onClick={() => onModeChange("quick")}
        className={`
          px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
          flex items-center gap-2
          ${
            mode === "quick"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        `}
      >
        <Zap className="w-4 h-4" />
        Nhập nhanh
      </button>
    </div>
  );
}
