'use client'

import type { ConversionMode } from '@/types/address'

interface QuickConvertInputProps {
  value: string
  onChange: (value: string) => void
  mode: ConversionMode
}

export default function QuickConvertInput({ value, onChange, mode }: QuickConvertInputProps) {
  const placeholderText = mode === 'old-to-new'
    ? 'Ví dụ: 123 Đường ABC, Phường Phúc Xá, Quận Ba Đình, Hà Nội'
    : 'Ví dụ: 123 Đường ABC, Phường Phúc Xá, Thành phố Hà Nội'

  const helpText = mode === 'old-to-new'
    ? 'Nhập địa chỉ đầy đủ (63 tỉnh thành), phân tách bằng dấu phẩy'
    : 'Nhập địa chỉ đầy đủ (34 tỉnh thành), phân tách bằng dấu phẩy'

  return (
    <div className="mb-3">
      <label
        htmlFor="quick-address-input"
        className="block swiss-label text-gray-900 mb-2"
      >
        Địa chỉ đầy đủ
      </label>
      <textarea
        id="quick-address-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="
          w-full px-3 py-2
          swiss-input
          text-sm
          resize-none
        "
        placeholder={placeholderText}
        aria-label="Nhập địa chỉ đầy đủ, phân tách bằng dấu phẩy"
      />
      <p className="text-xs text-gray-500 mt-1">
        {helpText}
      </p>
    </div>
  )
}
