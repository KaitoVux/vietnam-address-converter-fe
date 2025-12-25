"use client";

import { Building2, ChevronDown } from "lucide-react";
import type { District } from "@/types/address";

interface DistrictSelectProps {
  districts: District[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function DistrictSelect({
  districts,
  value,
  onChange,
  isLoading,
  disabled,
}: DistrictSelectProps) {
  return (
    <div>
      <label
        htmlFor="district-select"
        className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2"
      >
        <Building2 className="w-3 h-3 inline mr-1" />
        Quận / Huyện
      </label>
      <div className="relative">
        <select
          id="district-select"
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
          aria-label="Chọn quận hoặc huyện"
        >
          <option value="" className="bg-background text-foreground">
            {disabled
              ? "Chọn tỉnh/thành trước"
              : isLoading
              ? "Đang tải..."
              : "Chọn quận/huyện"}
          </option>
          {districts?.map((district) => (
            <option
              key={district.code}
              value={district.code}
              className="bg-background text-foreground py-2"
            >
              {district.name}
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
