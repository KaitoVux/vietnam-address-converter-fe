"use client";

import { useState, useEffect } from "react";
import { MapPin, Zap, RotateCcw } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import type { ConversionMode } from "@/types/address";
import ModeToggle from "./ModeToggle";
import InputModeToggle, { type InputMode } from "./InputModeToggle";
import ProvinceSelect from "./ProvinceSelect";
import DistrictSelect from "./DistrictSelect";
import WardSelect from "./WardSelect";
import QuickConvertInput from "./QuickConvertInput";
import ResultDisplay from "./ResultDisplay";
import { useProvinces } from "@/hooks/useProvinces";
import { useDistricts } from "@/hooks/useDistricts";
import { useWards } from "@/hooks/useWards";
import { useConvert } from "@/hooks/useConvert";
import { useQuickConvert } from "@/hooks/useQuickConvert";

export default function AddressConverter() {
  const [mounted, setMounted] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("selection");
  const [mode, setMode] = useState<ConversionMode>("old-to-new");
  const [province, setProvince] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [district, setDistrict] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [ward, setWard] = useState<{ code: string; name: string } | null>(null);
  const [street, setStreet] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const {
    data: provinces,
    isLoading: provincesLoading,
    error: provincesError,
  } = useProvinces(mode);
  const {
    data: districts,
    isLoading: districtsLoading,
    error: districtsError,
  } = useDistricts(province?.code || "", mode);
  const {
    data: wards,
    isLoading: wardsLoading,
    error: wardsError,
  } = useWards(district?.code || "", mode, province?.code || "");
  const {
    mutate: convert,
    data: result,
    isPending,
    error: convertError,
    reset: resetMutation,
  } = useConvert(mode);
  const {
    mutate: quickConvert,
    data: quickResult,
    isPending: quickPending,
    error: quickConvertError,
    reset: resetQuickMutation,
  } = useQuickConvert(mode);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative z-10 flex-1 min-h-0 w-full flex flex-col bg-card border-t-4 border-primary md:flex-none md:max-w-md md:h-[min(760px,calc(100dvh-3rem))] md:rounded-2xl md:shadow-xl md:overflow-hidden">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const handleInputModeChange = (newInputMode: InputMode) => {
    setInputMode(newInputMode);
    setProvince(null);
    setDistrict(null);
    setWard(null);
    setStreet("");
    setFullAddress("");
    resetMutation();
    resetQuickMutation();
  };

  const handleModeChange = (newMode: ConversionMode) => {
    setMode(newMode);
    setProvince(null);
    setDistrict(null);
    setWard(null);
    setStreet("");
    setFullAddress("");
    resetMutation();
    resetQuickMutation();
  };

  const handleProvinceChange = (value: string) => {
    const selectedProvince = provinces?.find(
      (p: any) => String(p.code) === value
    );
    setProvince(
      selectedProvince
        ? { code: String(selectedProvince.code), name: selectedProvince.name }
        : null
    );
    setDistrict(null);
    setWard(null);
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts?.find(
      (d: any) => String(d.code) === value
    );
    setDistrict(
      selectedDistrict
        ? { code: String(selectedDistrict.code), name: selectedDistrict.name }
        : null
    );
    setWard(null);
  };

  const handleWardChange = (value: string) => {
    const selectedWard = wards?.find((w: any) => String(w.code) === value);
    setWard(
      selectedWard
        ? { code: String(selectedWard.code), name: selectedWard.name }
        : null
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMode === "quick") {
      quickConvert({ address: fullAddress });
    } else {
      convert({
        province: province?.name || "",
        district: district?.name || "",
        ward: ward?.name || "",
        street: street || undefined,
      });
    }
  };

  const handleCopy = () => {
    const currentResult = inputMode === "quick" ? quickResult : result;
    const textToCopy =
      mode === "old-to-new"
        ? currentResult?.new_address
        : currentResult?.old_address;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    }
  };

  const handleReset = () => {
    setProvince(null);
    setDistrict(null);
    setWard(null);
    setStreet("");
    setFullAddress("");
    resetMutation();
    resetQuickMutation();
  };

  const isFormValid =
    inputMode === "quick"
      ? fullAddress.trim().length > 0
      : mode === "new-to-old"
      ? province && ward
      : province && district && ward;

  const currentResult = inputMode === "quick" ? quickResult : result;
  const currentPending = inputMode === "quick" ? quickPending : isPending;
  const currentError = inputMode === "quick" ? quickConvertError : convertError;
  const error =
    (provincesError as Error)?.message ||
    (districtsError as Error)?.message ||
    (wardsError as Error)?.message ||
    (currentError as Error)?.message;

  return (
    <form onSubmit={handleSubmit} className="relative z-10 flex-1 min-h-0 w-full flex flex-col bg-card border-t-4 border-primary md:flex-none md:max-w-md md:h-[min(760px,calc(100dvh-3rem))] md:rounded-2xl md:shadow-xl md:overflow-hidden">
      <AppHeader onReset={handleReset} />

      {/* Scrollable content zone - the page itself never scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <InputModeToggle
            mode={inputMode}
            onModeChange={handleInputModeChange}
          />
          <ModeToggle mode={mode} onModeChange={handleModeChange} />
        </div>

        {inputMode === "quick" ? (
          <QuickConvertInput
            value={fullAddress}
            onChange={setFullAddress}
            mode={mode}
          />
        ) : (
          <div className="space-y-2">
            <ProvinceSelect
              provinces={provinces || []}
              value={province?.code || ""}
              onChange={handleProvinceChange}
              isLoading={provincesLoading}
            />

            {mode === "old-to-new" && (
              <DistrictSelect
                districts={districts || []}
                value={district?.code || ""}
                onChange={handleDistrictChange}
                isLoading={districtsLoading}
                disabled={!province}
              />
            )}

            <WardSelect
              wards={wards || []}
              value={ward?.code || ""}
              onChange={handleWardChange}
              isLoading={wardsLoading}
              disabled={mode === "new-to-old" ? !province : !district}
            />

            <div>
              <label htmlFor="street-input" className="sr-only">
                Đường (Không bắt buộc)
              </label>
              <input
                id="street-input"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="
                  w-full h-11 px-3 text-base md:text-sm
                  bg-background border border-input rounded-lg
                  text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  transition-colors duration-200
                  hover:border-primary/50
                "
                placeholder="Số nhà, tên đường (không bắt buộc)"
              />
            </div>
          </div>
        )}

        <ResultDisplay
          result={currentResult || null}
          mode={mode}
          errorMessage={error}
          onCopy={handleCopy}
        />

        <p className="hidden md:block pt-2 text-center text-[11px] font-medium text-muted-foreground/80">
          Sử dụng <span className="text-primary">VietnamAdminUnits</span> & 
          <span className="text-primary">Provinces Open API</span>
        </p>
      </div>

      {/* Pinned action bar */}
      <footer className="shrink-0 border-t border-border bg-card px-4 pt-3 safe-bottom">
        <button
          type="submit"
          disabled={!isFormValid || currentPending}
          className={`
            w-full h-11 px-4 rounded-xl font-bold text-base
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              !isFormValid || currentPending
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98]"
            }
          `}
        >
          {currentPending ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Đang xử lý...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Chuyển Đổi Địa Chỉ
            </>
          )}
        </button>
      </footer>
    </form>
  );
}

function AppHeader({ onReset }: { onReset?: () => void }) {
  return (
    <header className="shrink-0 h-12 px-4 flex items-center gap-2.5 border-b border-border">
      <div className="w-8 h-8 shrink-0 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25">
        <MapPin className="w-4 h-4 text-primary-foreground" />
      </div>
      <h1 className="flex-1 min-w-0 text-base font-bold text-foreground truncate">
        Chuyển Đổi Địa Chỉ <span className="text-primary">VN</span>
      </h1>
      <ThemeToggle />
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
          aria-label="Đặt lại"
          title="Đặt lại"
        >
          <RotateCcw className="w-4 h-4 text-foreground" />
        </button>
      )}
    </header>
  );
}
