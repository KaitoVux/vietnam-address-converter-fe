"use client";

import { MapPin, ChevronDown } from "lucide-react";
import type { Province } from "@/types/address";

interface ProvinceSelectProps {
  provinces: Province[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export default function ProvinceSelect({
  provinces,
  value,
  onChange,
  isLoading,
}: ProvinceSelectProps) {
  return (
    <div>
      <label
        htmlFor="province-select"
        className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2"
      >
        <MapPin className="w-3 h-3 inline mr-1" />
        Tỉnh / Thành phố
      </label>
      <div className="relative">
        <select
          id="province-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
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
          aria-label="Chọn tỉnh hoặc thành phố"
        >
          <option value="" className="bg-background text-foreground">
            {isLoading ? "Đang tải..." : "Chọn tỉnh/thành"}
          </option>
          {provinces?.map((province) => (
            <option
              key={province.code}
              value={province.code}
              className="bg-background text-foreground py-2"
            >
              {province.name}
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
