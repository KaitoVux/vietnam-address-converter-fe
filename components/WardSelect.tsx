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
    <div>
      <label
        htmlFor="ward-select"
        className="block swiss-label text-gray-900 mb-2"
      >
        Phường / Xã
      </label>
      <div className="relative">
        <select
          id="ward-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          className="
            w-full px-3 py-2
            swiss-input
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            text-sm
          "
          aria-label="Chọn phường hoặc xã"
        >
          <option value="" className="bg-white text-black">
            {disabled
              ? 'Chọn quận/huyện trước'
              : isLoading
              ? 'Đang tải...'
              : 'Chọn phường/xã'}
          </option>
          {wards?.map((ward) => (
            <option
              key={ward.code}
              value={ward.code}
              className="bg-white text-black py-2"
            >
              {ward.name}
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
