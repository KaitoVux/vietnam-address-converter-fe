'use client'

import type { District } from '@/types/address'

interface DistrictSelectProps {
  districts: District[]
  value: string
  onChange: (value: string) => void
  isLoading: boolean
  disabled: boolean
}

export default function DistrictSelect({
  districts,
  value,
  onChange,
  isLoading,
  disabled
}: DistrictSelectProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor="district-select"
        className="block text-sm font-semibold text-white/90 mb-3 tracking-wide"
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-lg">🏘️</span>
          District
        </span>
      </label>
      <div className="relative">
        <select
          id="district-select"
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
          aria-label="Select district"
        >
          <option value="" className="bg-slate-900 text-white">
            {disabled
              ? 'Select province first...'
              : isLoading
              ? 'Loading districts...'
              : 'Select district...'}
          </option>
          {districts?.map((district) => (
            <option
              key={district.code}
              value={district.code}
              className="bg-slate-900 text-white py-2"
            >
              {district.name}
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
