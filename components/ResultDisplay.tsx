'use client'

import { useState } from 'react'
import type { ConversionResponse } from '@/lib/api'

interface ResultDisplayProps {
  result: ConversionResponse | null
  onCopy: () => void
  onSwitchDirection: () => void
  onReset: () => void
}

export default function ResultDisplay({
  result,
  onCopy,
  onSwitchDirection,
  onReset
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h3 className="text-sm font-bold mb-3 swiss-label text-gray-900">
        Kết Quả
      </h3>

      {result.success ? (
        <>
          <div className="space-y-2 mb-3">
            <div className="border border-gray-300 p-3 bg-gray-50">
              <p className="swiss-label text-gray-600 mb-1">
                Cũ (63)
              </p>
              <p className="text-xs font-medium text-black">
                {result.old_address || 'N/A'}
              </p>
            </div>

            <div className="border-2 border-black p-3 bg-white">
              <p className="swiss-label text-gray-600 mb-1">
                Mới (34)
              </p>
              <p className="text-xs font-semibold text-black">
                {result.new_address || 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopy}
              className="
                px-3 py-2 font-semibold text-xs
                swiss-button bg-black text-white
                hover:-translate-y-0.5
              "
              aria-label="Sao chép địa chỉ đã chuyển đổi"
            >
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>

            <button
              onClick={onSwitchDirection}
              className="
                px-3 py-2 font-semibold text-xs
                swiss-button swiss-accent text-white
                hover:-translate-y-0.5
              "
              aria-label="Đổi chiều chuyển đổi"
            >
              Đổi chiều
            </button>

            <button
              onClick={onReset}
              className="
                px-3 py-2 font-semibold text-xs
                swiss-button border border-gray-300 bg-white text-black
                hover:bg-gray-50
              "
              aria-label="Đặt lại form"
            >
              Đặt lại
            </button>
          </div>
        </>
      ) : (
        <div className="border-l-4 border-red-600 bg-red-50 p-3">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-red-900 text-xs swiss-label">Thất bại</p>
            <p className="text-red-800 text-xs">
              {result.message || 'Đã xảy ra lỗi trong quá trình chuyển đổi. Vui lòng thử lại.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
