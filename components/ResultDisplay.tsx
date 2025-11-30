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
    <div className="mt-8 glass-panel rounded-2xl p-8 animate-float">
      <h3 className="text-2xl font-bold mb-6 aurora-text flex items-center gap-3">
        <span className="text-3xl">✅</span>
        Conversion Result
      </h3>

      {result.success ? (
        <>
          <div className="space-y-5 mb-6">
            <div className="glass-panel rounded-xl p-5">
              <p className="text-sm text-white/60 mb-2 font-medium tracking-wide">
                OLD FORMAT (63 PROVINCES)
              </p>
              <p className="text-lg font-semibold text-white leading-relaxed">
                {result.old_address || 'N/A'}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-r from-jade-500 via-lotus-500 to-amber-500 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-5 border-2 border-jade-500/30">
              <p className="text-sm text-white/60 mb-2 font-medium tracking-wide">
                NEW FORMAT (34 PROVINCES)
              </p>
              <p className="text-lg font-semibold text-jade-300 leading-relaxed">
                {result.new_address || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="
                flex-1 min-w-[160px] px-6 py-3.5 rounded-xl font-semibold
                bg-gradient-to-r from-jade-500 to-emerald-600
                text-white shadow-lg glow-jade
                transition-all duration-200
                hover:scale-105 active:scale-95
                flex items-center justify-center gap-2
              "
              aria-label="Copy converted address to clipboard"
            >
              {copied ? (
                <>
                  <span className="text-xl">✓</span>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <span className="text-xl">📋</span>
                  <span>Copy Result</span>
                </>
              )}
            </button>

            <button
              onClick={onSwitchDirection}
              className="
                flex-1 min-w-[160px] px-6 py-3.5 rounded-xl font-semibold
                bg-gradient-to-r from-lotus-500 to-pink-600
                text-white shadow-lg glow-lotus
                transition-all duration-200
                hover:scale-105 active:scale-95
                flex items-center justify-center gap-2
              "
              aria-label="Switch conversion direction"
            >
              <span className="text-xl">🔄</span>
              <span>Switch Direction</span>
            </button>

            <button
              onClick={onReset}
              className="
                flex-1 min-w-[160px] px-6 py-3.5 rounded-xl font-semibold
                glass-panel glass-panel-hover
                text-white
                transition-all duration-200
                hover:scale-105 active:scale-95
                flex items-center justify-center gap-2
              "
              aria-label="Reset form"
            >
              <span className="text-xl">↺</span>
              <span>Reset</span>
            </button>
          </div>
        </>
      ) : (
        <div className="glass-panel rounded-xl p-6 border-2 border-red-500/30">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="font-bold text-red-400 text-lg mb-2">Conversion Failed</p>
              <p className="text-white/80 leading-relaxed">
                {result.message || 'An error occurred during conversion. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
