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
    <div>
      <label
        htmlFor="province-select"
        className="block swiss-label text-gray-900 mb-2"
      >
        Tỉnh / Thành phố
      </label>
      <div className="relative">
        <select
          id="province-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className="
            w-full px-3 py-2
            swiss-input
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            text-sm
          "
          aria-label="Chọn tỉnh hoặc thành phố"
        >
          <option value="" className="bg-white text-black">
            {isLoading ? 'Đang tải...' : 'Chọn tỉnh/thành'}
          </option>
          {provinces?.map((province) => (
            <option
              key={province.code}
              value={province.code}
              className="bg-white text-black py-2"
            >
              {province.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-3 h-3 text-gray-600"
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
