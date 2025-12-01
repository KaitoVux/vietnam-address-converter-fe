'use client'

export type InputMode = 'selection' | 'quick'

interface InputModeToggleProps {
  mode: InputMode
  onModeChange: (mode: InputMode) => void
}

export default function InputModeToggle({ mode, onModeChange }: InputModeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-0 mb-4 border border-gray-300">
      <button
        onClick={() => onModeChange('selection')}
        className={`
          px-4 py-2 font-semibold transition-all duration-150 text-xs tracking-tight
          ${mode === 'selection'
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-gray-50'
          }
        `}
        aria-pressed={mode === 'selection'}
        aria-label="Chế độ chọn từ danh sách"
      >
        <span className="text-sm">Chọn từ danh sách</span>
      </button>

      <button
        onClick={() => onModeChange('quick')}
        className={`
          px-4 py-2 font-semibold transition-all duration-150 text-xs tracking-tight border-l border-gray-300
          ${mode === 'quick'
            ? 'swiss-accent text-white'
            : 'bg-white text-black hover:bg-gray-50'
          }
        `}
        aria-pressed={mode === 'quick'}
        aria-label="Chế độ nhập nhanh toàn bộ địa chỉ"
      >
        <span className="text-sm">Nhập nhanh</span>
      </button>
    </div>
  )
}
