'use client'

import { useState, useEffect } from 'react'
import type { ConversionMode } from '@/types/address'
import ModeToggle from './ModeToggle'
import InputModeToggle, { type InputMode } from './InputModeToggle'
import ProvinceSelect from './ProvinceSelect'
import DistrictSelect from './DistrictSelect'
import WardSelect from './WardSelect'
import QuickConvertInput from './QuickConvertInput'
import ResultDisplay from './ResultDisplay'
import { useProvinces } from '@/hooks/useProvinces'
import { useDistricts } from '@/hooks/useDistricts'
import { useWards } from '@/hooks/useWards'
import { useConvert } from '@/hooks/useConvert'
import { useQuickConvert } from '@/hooks/useQuickConvert'

export default function AddressConverter() {
    const [mounted, setMounted] = useState(false)
    const [inputMode, setInputMode] = useState<InputMode>('selection')
    const [mode, setMode] = useState<ConversionMode>('old-to-new')
    // Store both code (for fetching) and name (for API submission)
    const [province, setProvince] = useState<{ code: string; name: string } | null>(null)
    const [district, setDistrict] = useState<{ code: string; name: string } | null>(null)
    const [ward, setWard] = useState<{ code: string; name: string } | null>(null)
    const [street, setStreet] = useState('')
    const [fullAddress, setFullAddress] = useState('')

    const { data: provinces, isLoading: provincesLoading, error: provincesError } = useProvinces(mode)
    const { data: districts, isLoading: districtsLoading, error: districtsError } = useDistricts(province?.code || '', mode)
    const { data: wards, isLoading: wardsLoading, error: wardsError } = useWards(district?.code || '', mode, province?.code || '')
    const { mutate: convert, data: result, isPending, error: convertError, reset: resetMutation } = useConvert(mode)
    const { mutate: quickConvert, data: quickResult, isPending: quickPending, error: quickConvertError, reset: resetQuickMutation } = useQuickConvert(mode)

    // Prevent hydration errors by only rendering after client-side mount
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4">
                <div className="mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 swiss-heading">
                        Chuyển Đổi Địa Chỉ Việt Nam
                    </h1>
                    <p className="text-gray-600 text-xs max-w-xl">
                        Đang tải...
                    </p>
                </div>
            </div>
        )
    }

    const handleInputModeChange = (newInputMode: InputMode) => {
        setInputMode(newInputMode)
        // Reset both forms when switching input mode
        setProvince(null)
        setDistrict(null)
        setWard(null)
        setStreet('')
        setFullAddress('')
        resetMutation()
        resetQuickMutation()
    }

    const handleModeChange = (newMode: ConversionMode) => {
        setMode(newMode)
        setProvince(null)
        setDistrict(null)
        setWard(null)
        setStreet('')
        setFullAddress('')
        resetMutation()
        resetQuickMutation()
    }

    const handleProvinceChange = (value: string) => {
        // Convert value to number for comparison since API returns numeric codes
        const selectedProvince = provinces?.find((p: any) => String(p.code) === value)
        setProvince(selectedProvince ? { code: String(selectedProvince.code), name: selectedProvince.name } : null)
        setDistrict(null)
        setWard(null)
    }

    const handleDistrictChange = (value: string) => {
        // Convert value to number for comparison since API returns numeric codes
        const selectedDistrict = districts?.find((d: any) => String(d.code) === value)
        setDistrict(selectedDistrict ? { code: String(selectedDistrict.code), name: selectedDistrict.name } : null)
        setWard(null)
    }

    const handleWardChange = (value: string) => {
        // Convert value to number for comparison since API returns numeric codes
        const selectedWard = wards?.find((w: any) => String(w.code) === value)
        setWard(selectedWard ? { code: String(selectedWard.code), name: selectedWard.name } : null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (inputMode === 'quick') {
            // Quick convert mode - send full address
            quickConvert({ address: fullAddress })
        } else {
            // Selection mode - send individual fields
            convert({
                province: province?.name || '',
                district: district?.name || '',
                ward: ward?.name || '',
                street: street || undefined
            })
        }
    }

    const handleCopy = () => {
        const currentResult = inputMode === 'quick' ? quickResult : result
        const textToCopy = mode === 'old-to-new' ? currentResult?.new_address : currentResult?.old_address
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
        }
    }

    const handleSwitchDirection = () => {
        const newMode: ConversionMode = mode === 'old-to-new' ? 'new-to-old' : 'old-to-new'
        handleModeChange(newMode)
    }

    const handleReset = () => {
        setProvince(null)
        setDistrict(null)
        setWard(null)
        setStreet('')
        setFullAddress('')
        resetMutation()
        resetQuickMutation()
    }

    // For v2 (new-to-old), district is not required
    const isFormValid = inputMode === 'quick'
        ? fullAddress.trim().length > 0
        : (mode === 'new-to-old' ? (province && ward) : (province && district && ward))

    const currentResult = inputMode === 'quick' ? quickResult : result
    const currentPending = inputMode === 'quick' ? quickPending : isPending
    const currentError = inputMode === 'quick' ? quickConvertError : convertError

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 swiss-heading">
                    Chuyển Đổi Địa Chỉ Việt Nam
                </h1>
                <p className="text-gray-600 text-xs max-w-xl">
                    Công cụ chuyển đổi hai chiều chính xác. <span className="font-semibold text-black">63 tỉnh thành (trước 2025)</span> ↔ <span className="swiss-accent-text font-semibold">34 tỉnh thành (sau 2025)</span>
                </p>
            </div>

            {/* Main Card */}
            <div className="swiss-card p-5">
                <InputModeToggle mode={inputMode} onModeChange={handleInputModeChange} />
                <ModeToggle mode={mode} onModeChange={handleModeChange} />

                <form onSubmit={handleSubmit}>
                    {/* Display API errors */}
                    {(provincesError || districtsError || wardsError || currentError) && (
                        <div className="mb-4 border-l-4 border-red-600 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <p className="font-bold text-red-900 text-xs mb-1 swiss-label">Lỗi</p>
                                    <p className="text-red-800 text-xs">
                                        {(provincesError as Error)?.message ||
                                            (districtsError as Error)?.message ||
                                            (wardsError as Error)?.message ||
                                            (currentError as Error)?.message ||
                                            'Đã xảy ra lỗi. Vui lòng thử lại.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {inputMode === 'quick' ? (
                        /* Quick Convert Mode */
                        <QuickConvertInput
                            value={fullAddress}
                            onChange={setFullAddress}
                            mode={mode}
                        />
                    ) : (
                        /* Selection Mode */
                        <>
                            {/* Grid layout for form fields */}
                            <div className={`grid gap-2 mb-3 ${mode === 'old-to-new' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                                <ProvinceSelect
                                    provinces={provinces || []}
                                    value={province?.code || ''}
                                    onChange={handleProvinceChange}
                                    isLoading={provincesLoading}
                                />

                                {/* Hide district selector for new-to-old mode (v2) */}
                                {mode === 'old-to-new' && (
                                    <DistrictSelect
                                        districts={districts || []}
                                        value={district?.code || ''}
                                        onChange={handleDistrictChange}
                                        isLoading={districtsLoading}
                                        disabled={!province}
                                    />
                                )}

                                <WardSelect
                                    wards={wards || []}
                                    value={ward?.code || ''}
                                    onChange={handleWardChange}
                                    isLoading={wardsLoading}
                                    disabled={mode === 'new-to-old' ? !province : !district}
                                />
                            </div>

                            {/* Street input in separate row */}
                            <div className="mb-3">
                                <label
                                    htmlFor="street-input"
                                    className="block swiss-label text-gray-900 mb-2"
                                >
                                    Đường (Không bắt buộc)
                                </label>
                                <input
                                    id="street-input"
                                    type="text"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className="
                        w-full px-3 py-2
                        swiss-input
                        text-sm
                      "
                                    placeholder="Địa chỉ đường"
                                    aria-label="Địa chỉ đường (không bắt buộc)"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={!isFormValid || currentPending}
                        className={`
              w-full px-4 py-2.5 font-bold text-sm
              swiss-button
              transition-all duration-150
              ${!isFormValid || currentPending
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'swiss-accent text-white hover:-translate-y-0.5'
                            }
            `}
                        aria-label="Chuyển đổi địa chỉ"
                    >
                        {currentPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                                Đang chuyển đổi
                            </span>
                        ) : (
                            'Chuyển Đổi'
                        )}
                    </button>
                </form>

                <ResultDisplay
                    result={currentResult || null}
                    onCopy={handleCopy}
                    onSwitchDirection={handleSwitchDirection}
                    onReset={handleReset}
                />
            </div>

            {/* Footer */}
            <div className="mt-3 text-center text-gray-400 text-xs tracking-wide">
                <p>SỬ DỤNG VIETNAMADMINUNITS & PROVINCES OPEN API</p>
            </div>
        </div>
    )
}
