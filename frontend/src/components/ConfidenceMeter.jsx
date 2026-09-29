import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

/**
 * Animated confidence readout.
 *
 * Renders a circular gauge *and* a bar for the value returned by the backend.
 * The number counts up from 0 to the real confidence — nothing is invented —
 * and jumps straight to the final value when reduced motion is requested.
 */
export default function ConfidenceMeter({ confidence, size = 132, showBar = true }) {
  const { t } = useLanguage()
  const target = Math.max(0, Math.min(1, Number(confidence) || 0)) * 100
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(target)
      return
    }
    setDisplay(0)
    let frame
    let startTs = null
    const duration = 1100
    const step = (ts) => {
      if (startTs === null) startTs = ts
      const p = Math.min((ts - startTs) / duration, 1)
      setDisplay(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])

  const radius = size / 2 - 9
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - display / 100)
  const low = target < 70
  const tone = low ? '#f59e0b' : '#189c61'

  return (
    <div>
      <div className="flex flex-wrap items-center gap-5">
        {/* Circular gauge */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(210,244,224,0.85)"
              strokeWidth="9"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={tone}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke 0.3s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold leading-none tnum text-leaf-950">
              {display.toFixed(1)}%
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-leaf-950/82">
              {t('detect.result.confidence')}
            </span>
          </div>
        </div>

        {showBar && (
          <div className="min-w-[10rem] flex-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-leaf-950/82">
                {target >= 80 ? 'High confidence' : target >= 50 ? 'Moderate confidence' : 'Low confidence'}
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-leaf-100"
              role="progressbar"
              aria-label={t('detect.result.confidence')}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(target)}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${display}%`,
                  background: target < 50
                    ? 'linear-gradient(90deg,#ef4444,#b91c1c)'
                    : target < 80 
                    ? 'linear-gradient(90deg,#fbbf24,#f59e0b)'
                    : 'linear-gradient(90deg,#6dd4a0,#0d7d4e)',
                }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-medium tnum text-leaf-950/82">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
