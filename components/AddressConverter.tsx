"use client";

import { useState, useEffect } from "react";
import { MapPin, Zap, RotateCcw } from "lucide-react";
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
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Chuyển Đổi Địa Chỉ Việt Nam
          </h1>
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

  const handleSwitchDirection = () => {
    const newMode: ConversionMode =
      mode === "old-to-new" ? "new-to-old" : "old-to-new";
    handleModeChange(newMode);
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
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/20 rounded-full mb-4">
          <span className="text-xs font-medium text-primary">
            🌟 Nghị quyết số 76/2025/UBTVQH15
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Chuyển Đổi Địa Chỉ <span className="text-primary">Việt Nam</span>
          </h1>
        </div>

        {/* Sub-badge */}
        <div className="flex items-center gap-3 text-sm font-medium bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-border shadow-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-foreground/60"></span>
            63 tỉnh thành cũ
          </span>
          <RotateCcw className="w-4 h-4 text-muted-foreground" />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-primary">34 tỉnh thành mới</span>
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-card shadow-xl rounded-2xl overflow-hidden animate-fade-in border-t-4 border-primary">
        <div className="p-6 md:p-8">
          {/* Control Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <InputModeToggle
              mode={inputMode}
              onModeChange={handleInputModeChange}
            />
            <ModeToggle mode={mode} onModeChange={handleModeChange} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Display API errors */}
            {error && (
              <div className="mb-6 border-l-4 border-destructive bg-destructive/5 rounded-r-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-destructive text-xs mb-1 uppercase tracking-wide">
                      Lỗi
                    </p>
                    <p className="text-destructive text-sm">
                      {error || "Đã xảy ra lỗi. Vui lòng thử lại."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {inputMode === "quick" ? (
                <QuickConvertInput
                  value={fullAddress}
                  onChange={setFullAddress}
                  mode={mode}
                />
              ) : (
                <>
                  <div
                    className={`grid gap-4 ${
                      mode === "old-to-new"
                        ? "grid-cols-1 md:grid-cols-3"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
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
                  </div>

                  {/* Street input */}
                  <div>
                    <label
                      htmlFor="street-input"
                      className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 pl-1"
                    >
                      Đường (Không bắt buộc)
                    </label>
                    <input
                      id="street-input"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="
                                                w-full px-4 py-3 text-sm
                                                bg-background border border-input rounded-xl
                                                text-foreground
                                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                                transition-all duration-200
                                            "
                      placeholder="Nhập số nhà, tên đường..."
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="
                                        md:w-32 px-4 py-3.5 rounded-xl font-medium text-sm
                                        border border-border bg-background text-foreground
                                        hover:bg-muted/50 hover:border-foreground/20
                                        transition-all duration-200
                                        flex items-center justify-center gap-2
                                    "
                >
                  <RotateCcw className="w-4 h-4" />
                  Đặt lại
                </button>

                <button
                  type="submit"
                  disabled={!isFormValid || currentPending}
                  className={`
                                        flex-1 px-4 py-3.5 rounded-xl font-bold text-base
                                        flex items-center justify-center gap-2
                                        transition-all duration-200 shadow-lg shadow-primary/20
                                        ${
                                          !isFormValid || currentPending
                                            ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                                            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-0.5"
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
              </div>
            </div>
          </form>

          <ResultDisplay
            result={currentResult || null}
            onCopy={handleCopy}
            onSwitchDirection={handleSwitchDirection}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center pb-8">
        <p className="text-xs font-medium text-muted-foreground/80">
          Sử dụng{" "}
          <span className="text-primary hover:underline cursor-pointer">
            VietnamAdminUnits
          </span>{" "}
          &{" "}
          <span className="text-primary hover:underline cursor-pointer">
            Provinces Open API
          </span>
        </p>
      </div>
    </div>
  );
}
