"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ConversionResponse } from "@/lib/api";
import type { ConversionMode } from "@/types/address";

interface ResultDisplayProps {
  result: ConversionResponse | null;
  mode: ConversionMode;
  errorMessage?: string;
  onCopy: () => void;
}

export default function ResultDisplay({
  result,
  mode,
  errorMessage,
  onCopy,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (errorMessage) {
    return (
      <div className="border-l-4 border-destructive bg-destructive/5 rounded-r-lg p-3" role="alert">
        <p className="font-semibold text-destructive text-[10px] mb-1 uppercase tracking-wide">
          Lỗi
        </p>
        <p className="text-destructive text-xs">{errorMessage}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="border border-dashed border-border rounded-xl p-3 text-center">
        <p className="text-xs text-muted-foreground">Kết quả sẽ hiển thị ở đây</p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="border-l-4 border-destructive bg-destructive/5 rounded-r-lg p-3" role="alert">
        <p className="font-semibold text-destructive text-[10px] mb-1 uppercase tracking-wide">
          Chuyển đổi thất bại
        </p>
        <p className="text-destructive text-xs">
          {result.message ||
            "Đã xảy ra lỗi trong quá trình chuyển đổi. Vui lòng kiểm tra lại địa chỉ và thử lại."}
        </p>
      </div>
    );
  }

  const isOldToNew = mode === "old-to-new";
  const targetAddress = isOldToNew ? result.new_address : result.old_address;
  const sourceAddress = isOldToNew ? result.old_address : result.new_address;

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-3 bg-card rounded-xl border-2 border-primary/30 shadow-sm animate-fade-in"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {isOldToNew ? "Mới" : "Cũ"}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 rounded text-primary font-bold">
              ({isOldToNew ? 34 : 63})
            </span>
          </div>
          <p className="text-sm md:text-base text-foreground font-semibold leading-snug break-words">
            {targetAddress || "N/A"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="
            -mt-1 -mr-1 shrink-0 w-11 h-11 rounded-lg
            flex items-center justify-center
            text-muted-foreground hover:text-foreground hover:bg-muted/50
            transition-colors duration-200
          "
          aria-label={copied ? "Đã sao chép" : "Sao chép địa chỉ đã chuyển đổi"}
          title={copied ? "Đã sao chép" : "Sao chép"}
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground truncate">
        <span className="font-semibold">{isOldToNew ? "Cũ" : "Mới"}:</span>{" "}
        {sourceAddress || "N/A"}
      </p>
    </div>
  );
}
