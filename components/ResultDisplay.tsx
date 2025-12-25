"use client";

import { useState } from "react";
import { Copy, ArrowRightLeft, RotateCcw, Check } from "lucide-react";
import type { ConversionResponse } from "@/lib/api";

interface ResultDisplayProps {
  result: ConversionResponse | null;
  onCopy: () => void;
  onSwitchDirection: () => void;
  onReset: () => void;
}

export default function ResultDisplay({
  result,
  onCopy,
  onSwitchDirection,
  onReset,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 pt-8 border-t border-border animate-fade-in">
      <h3 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">
        Kết Quả
      </h3>

      {result.success ? (
        <>
          <div className="space-y-4 mb-6">
            {/* Old address - muted */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-muted to-muted/50 rounded-2xl blur opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-5 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                    Cũ
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground font-medium">
                    (63)
                  </span>
                </div>
                <p className="text-sm md:text-base text-foreground font-medium leading-relaxed">
                  {result.old_address || "N/A"}
                </p>
              </div>
            </div>

            {/* New address - highlighted with primary */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-40 transition duration-1000 group-hover:opacity-60 group-hover:duration-200 animate-pulse-soft"></div>
              <div className="relative p-5 bg-card rounded-xl border-2 border-primary/20 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Mới
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 rounded text-primary font-bold">
                    (34)
                  </span>
                </div>
                <p className="text-base md:text-lg text-foreground font-semibold leading-relaxed">
                  {result.new_address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleCopy}
              className="
                px-4 py-3 rounded-xl font-medium text-sm
                border border-border bg-background text-foreground
                hover:bg-muted/50 hover:border-foreground/20
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copied ? "Đã sao" : "Sao chép"}</span>
            </button>

            <button
              onClick={onSwitchDirection}
              className="
                px-4 py-3 rounded-xl font-bold text-sm text-white
                bg-gradient-to-r from-primary to-primary/90
                hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Đổi chiều</span>
            </button>

            <button
              onClick={onReset}
              className="
                px-4 py-3 rounded-xl font-medium text-sm
                border border-border bg-background text-foreground
                hover:bg-muted/50 hover:border-foreground/20
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              <RotateCcw className="w-4 h-4" />
              <span>Đặt lại</span>
            </button>
          </div>
        </>
      ) : (
        <div className="border-l-4 border-destructive bg-destructive/5 rounded-r-lg p-5">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-destructive text-xs uppercase tracking-wide">
              Chuyển đổi thất bại
            </p>
            <p className="text-destructive text-sm leading-relaxed">
              {result.message ||
                "Đã xảy ra lỗi trong quá trình chuyển đổi. Vui lòng kiểm tra lại địa chỉ và thử lại."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
