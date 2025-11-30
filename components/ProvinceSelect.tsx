'use client'

import type { Province } from '@/types/address'

interface ProvinceSelectProps {
  provinces: Province[]
  value: string
  onChange: (value: string) => void
  isLoading: boolean
}

export default function ProvinceSelect({
  provinces,
  value,
  onChange,
  isLoading
}: ProvinceSelectProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor="province-select"
        className="block text-sm font-semibold text-white/90 mb-3 tracking-wide"
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-lg">🏙️</span>
          Province / City
        </span>
      </label>
      <div className="relative">
        <select
          id="province-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className="
            w-full px-5 py-4 rounded-xl
            glass-panel glass-panel-hover
            text-white placeholder-white/40
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            text-base font-medium
            transition-all duration-200
          "
          aria-label="Select province or city"
        >
          <option value="" className="bg-slate-900 text-white">
            {isLoading ? 'Loading provinces...' : 'Select province...'}
          </option>
          {provinces?.map((province) => (
            <option
              key={province.code}
              value={province.code}
              className="bg-slate-900 text-white py-2"
            >
              {province.name}
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
