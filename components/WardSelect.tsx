"use client";

import { Home, ChevronDown } from "lucide-react";
import type { Ward } from "@/types/address";

interface WardSelectProps {
  wards: Ward[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function WardSelect({
  wards,
  value,
  onChange,
  isLoading,
  disabled,
}: WardSelectProps) {
  return (
    <div>
      <label
        htmlFor="ward-select"
        className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2"
      >
        <Home className="w-3 h-3 inline mr-1" />
        Phường / Xã
      </label>
      <div className="relative">
        <select
          id="ward-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          className="
            w-full px-3 py-2 text-sm
            bg-background border border-input rounded-lg
            text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            transition-colors duration-200
            hover:border-primary/50
          "
          aria-label="Chọn phường hoặc xã"
        >
          <option value="" className="bg-background text-foreground">
            {disabled
              ? "Chọn quận/huyện trước"
              : isLoading
              ? "Đang tải..."
              : "Chọn phường/xã"}
          </option>
          {wards?.map((ward) => (
            <option
              key={ward.code}
              value={ward.code}
              className="bg-background text-foreground py-2"
            >
              {ward.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
