'use client'

import { useState, useEffect } from 'react'
import type { ConversionMode } from '@/types/address'
import ModeToggle from './ModeToggle'
import ProvinceSelect from './ProvinceSelect'
import DistrictSelect from './DistrictSelect'
import WardSelect from './WardSelect'
import ResultDisplay from './ResultDisplay'
import { useProvinces } from '@/hooks/useProvinces'
import { useDistricts } from '@/hooks/useDistricts'
import { useWards } from '@/hooks/useWards'
import { useConvert } from '@/hooks/useConvert'

export default function AddressConverter() {
    const [mounted, setMounted] = useState(false)
    const [mode, setMode] = useState<ConversionMode>('old-to-new')
    // Store both code (for fetching) and name (for API submission)
    const [province, setProvince] = useState<{ code: string; name: string } | null>(null)
    const [district, setDistrict] = useState<{ code: string; name: string } | null>(null)
    const [ward, setWard] = useState<{ code: string; name: string } | null>(null)
    const [street, setStreet] = useState('')

    const { data: provinces, isLoading: provincesLoading, error: provincesError } = useProvinces(mode)
    const { data: districts, isLoading: districtsLoading, error: districtsError } = useDistricts(province?.code || '', mode)
    const { data: wards, isLoading: wardsLoading, error: wardsError } = useWards(district?.code || '', mode, province?.code || '')
    const { mutate: convert, data: result, isPending, error: convertError, reset: resetMutation } = useConvert(mode)

    // Prevent hydration errors by only rendering after client-side mount
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-full max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 aurora-text leading-tight">
                        Vietnam Address Converter
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                        Loading...
                    </p>
                </div>
            </div>
        )
    }

    const handleModeChange = (newMode: ConversionMode) => {
        setMode(newMode)
        setProvince(null)
        setDistrict(null)
        setWard(null)
        setStreet('')
        resetMutation()
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
        // Send names to the API, not codes
        convert({
            province: province?.name || '',
            district: district?.name || '',
            ward: ward?.name || '',
            street: street || undefined
        })
    }

    const handleCopy = () => {
        const textToCopy = mode === 'old-to-new' ? result?.new_address : result?.old_address
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
        resetMutation()
    }

    // For v2 (new-to-old), district is not required
    const isFormValid = mode === 'new-to-old' ? (province && ward) : (province && district && ward)

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 aurora-text leading-tight">
                    Vietnam Address Converter
                </h1>
                <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                    Bi-directional converter for Vietnamese administrative divisions
                    <br />
                    <span className="text-jade-400 font-semibold">63 provinces (pre-July 2025)</span>
                    {' ↔ '}
                    <span className="text-lotus-400 font-semibold">34 provinces (post-July 2025)</span>
                </p>
            </div>

            {/* Main Card */}
            <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-2xl">
                <ModeToggle mode={mode} onModeChange={handleModeChange} />

                <form onSubmit={handleSubmit}>
                    {/* Display API errors */}
                    {(provincesError || districtsError || wardsError || convertError) && (
                        <div className="mb-6 glass-panel rounded-xl p-5 border-2 border-red-500/30 animate-float">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">⚠️</span>
                                <div>
                                    <p className="font-bold text-red-400 text-lg mb-2">Error</p>
                                    <p className="text-white/90 leading-relaxed">
                                        {(provincesError as Error)?.message ||
                                            (districtsError as Error)?.message ||
                                            (wardsError as Error)?.message ||
                                            (convertError as Error)?.message ||
                                            'An error occurred. Please try again.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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

                    <div className="mb-6">
                        <label
                            htmlFor="street-input"
                            className="block text-sm font-semibold text-white/90 mb-3 tracking-wide"
                        >
                            <span className="inline-flex items-center gap-2">
                                <span className="text-lg">🛣️</span>
                                Street Address
                                <span className="text-white/50 font-normal text-xs">(Optional)</span>
                            </span>
                        </label>
                        <input
                            id="street-input"
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="
                w-full px-5 py-4 rounded-xl
                glass-panel glass-panel-hover
                text-white placeholder-white/40
                text-base font-medium
                transition-all duration-200
              "
                            placeholder="Enter street address..."
                            aria-label="Street address (optional)"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || isPending}
                        className={`
              w-full px-6 py-5 rounded-xl font-bold text-lg
              transition-all duration-300
              ${!isFormValid || isPending
                                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                : 'bg-gradient-to-r from-jade-500 via-lotus-500 to-amber-500 text-white shadow-2xl hover:scale-[1.02] active:scale-[0.98] glow-jade'
                            }
            `}
                        aria-label="Convert address"
                    >
                        {isPending ? (
                            <span className="flex items-center justify-center gap-3">
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
                                Converting...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span className="text-2xl">⚡</span>
                                Convert Address
                            </span>
                        )}
                    </button>
                </form>

                <ResultDisplay
                    result={result || null}
                    onCopy={handleCopy}
                    onSwitchDirection={handleSwitchDirection}
                    onReset={handleReset}
                />
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-white/50 text-sm">
                <p>Powered by vietnamadminunits library & Provinces Open API</p>
            </div>
        </div>
    )
}
