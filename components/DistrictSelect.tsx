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
    <div>
      <label
        htmlFor="district-select"
        className="block swiss-label text-gray-900 mb-2"
      >
        Quận / Huyện
      </label>
      <div className="relative">
        <select
          id="district-select"
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
          aria-label="Chọn quận hoặc huyện"
        >
          <option value="" className="bg-white text-black">
            {disabled
              ? 'Chọn tỉnh/thành trước'
              : isLoading
              ? 'Đang tải...'
              : 'Chọn quận/huyện'}
          </option>
          {districts?.map((district) => (
            <option
              key={district.code}
              value={district.code}
              className="bg-white text-black py-2"
            >
              {district.name}
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
