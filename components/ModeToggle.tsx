'use client'

import type { ConversionMode } from '@/types/address'

interface ModeToggleProps {
  mode: ConversionMode
  onModeChange: (mode: ConversionMode) => void
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-3 mb-8">
      <button
        onClick={() => onModeChange('old-to-new')}
        className={`
          relative px-6 py-3 rounded-xl font-medium transition-all duration-300
          ${mode === 'old-to-new'
            ? 'bg-gradient-to-r from-jade-500 to-emerald-500 text-white shadow-lg glow-jade scale-105'
            : 'glass-panel glass-panel-hover text-white/70 hover:text-white'
          }
        `}
        aria-pressed={mode === 'old-to-new'}
        aria-label="Convert from old 63 provinces to new 34 provinces"
      >
        <span className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <span>Old → New</span>
          <span className="text-sm opacity-75">(63 → 34)</span>
        </span>
      </button>

      <button
        onClick={() => onModeChange('new-to-old')}
        className={`
          relative px-6 py-3 rounded-xl font-medium transition-all duration-300
          ${mode === 'new-to-old'
            ? 'bg-gradient-to-r from-lotus-500 to-pink-500 text-white shadow-lg glow-lotus scale-105'
            : 'glass-panel glass-panel-hover text-white/70 hover:text-white'
          }
        `}
        aria-pressed={mode === 'new-to-old'}
        aria-label="Convert from new 34 provinces to old 63 provinces"
      >
        <span className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span>New → Old</span>
          <span className="text-sm opacity-75">(34 → 63)</span>
        </span>
      </button>
    </div>
  )
}
