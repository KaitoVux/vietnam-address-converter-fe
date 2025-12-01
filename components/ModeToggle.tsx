'use client'

import type { ConversionMode } from '@/types/address'

interface ModeToggleProps {
  mode: ConversionMode
  onModeChange: (mode: ConversionMode) => void
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-0 mb-4 border border-gray-300">
      <button
        onClick={() => onModeChange('old-to-new')}
        className={`
          px-4 py-2 font-semibold transition-all duration-150 text-xs tracking-tight
          ${mode === 'old-to-new'
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-gray-50'
          }
        `}
        aria-pressed={mode === 'old-to-new'}
        aria-label="Chuyển đổi từ 63 tỉnh thành cũ sang 34 tỉnh thành mới"
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-sm">Cũ → Mới</span>
          <span className="text-xs opacity-60">Trước sát nhập → Sau sát nhập</span>
        </div>
      </button>

      <button
        onClick={() => onModeChange('new-to-old')}
        className={`
          px-4 py-2 font-semibold transition-all duration-150 text-xs tracking-tight border-l border-gray-300
          ${mode === 'new-to-old'
            ? 'swiss-accent text-white'
            : 'bg-white text-black hover:bg-gray-50'
          }
        `}
        aria-pressed={mode === 'new-to-old'}
        aria-label="Chuyển đổi từ 34 tỉnh thành mới sang 63 tỉnh thành cũ"
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-sm">Mới → Cũ</span>
          <span className="text-xs opacity-60">Sau sát nhập → Trước sát nhập</span>
        </div>
      </button>
    </div>
  )
}
