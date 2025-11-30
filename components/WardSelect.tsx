'use client'

import type { Ward } from '@/types/address'

interface WardSelectProps {
  wards: Ward[]
  value: string
  onChange: (value: string) => void
  isLoading: boolean
  disabled: boolean
}

export default function WardSelect({
  wards,
  value,
  onChange,
  isLoading,
  disabled
}: WardSelectProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor="ward-select"
        className="block text-sm font-semibold text-white/90 mb-3 tracking-wide"
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-lg">🏡</span>
          Ward / Commune
        </span>
      </label>
      <div className="relative">
        <select
          id="ward-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          className="
            w-full px-5 py-4 rounded-xl
            glass-panel glass-panel-hover
            text-white placeholder-white/40
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            text-base font-medium
            transition-all duration-200
          "
          aria-label="Select ward or commune"
        >
          <option value="" className="bg-slate-900 text-white">
            {disabled
              ? 'Select district first...'
              : isLoading
              ? 'Loading wards...'
              : 'Select ward...'}
          </option>
          {wards?.map((ward) => (
            <option
              key={ward.code}
              value={ward.code}
              className="bg-slate-900 text-white py-2"
            >
              {ward.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-white/60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}
