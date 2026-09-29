import { useLanguage } from '../context/LanguageContext'
import useInView from '../hooks/useInView'
import { MODEL_ORDER, MODEL_META } from '../data/projectData'
import { ChartIcon } from './icons'

const GRID = [0, 25, 50, 75, 100]

/**
 * Validation accuracy comparison.
 *
 * Values come straight from `model_results.json`; bars are drawn on a true
 * 0–100% scale so the differences are not visually exaggerated. Each bar grows
 * from 0 when the section scrolls into view.
 */
export default function AccuracyChart({ results }) {
  const { t } = useLanguage()
  const { ref, inView } = useInView({ threshold: 0.2 })

  const rows = MODEL_ORDER.filter((id) => {
    const v = results?.[id]?.validation_accuracy
    return v !== null && v !== undefined
  })

  if (!rows.length) return null

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-leaf-100 bg-gradient-to-r from-leaf-50/90 to-white px-5 py-4 sm:px-7">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-leaf-950">
            <ChartIcon size={18} className="text-leaf-600" />
            {t('models.comparisonTitle')}
          </h2>
          <p className="mt-1 text-sm text-leaf-950/85">{t('models.comparisonSubtitle')}</p>
        </div>
        <span className="chip shrink-0 bg-white">{t('home.hero.chips.classes')}</span>
      </div>

      <div ref={ref} className="px-5 py-6 sm:px-7">
        {/*
          Axis. Each tick is pinned to its true percentage on the same 0–100%
          track the bars use, so the labels sit directly above the gridlines.
          Edge ticks are anchored to the ends instead of centred, otherwise they
          would overhang the track. Hidden from assistive tech because every row
          below already announces its own exact value.
        */}
        <div aria-hidden="true" className="tnum relative mb-2.5 h-3.5 text-[11px] font-semibold text-leaf-950/82">
          {GRID.map((g) => (
            <span
              key={g}
              className={`absolute top-0 whitespace-nowrap ${
                g === 0 ? '' : g === 100 ? '-translate-x-full' : '-translate-x-1/2'
              }`}
              style={{ left: `${g}%` }}
            >
              {g}%
            </span>
          ))}
        </div>

        <ul className="space-y-4">
          {rows.map((id, i) => {
            const r = results[id]
            const value = r.validation_accuracy
            const name = r.display_name || id
            const accent = MODEL_META[id]?.accent || '#0d7d4e'
            /* Bars use the bright accent; the printed number uses the darkened
               accentInk so the figure stays legible on the white card. */
            const ink = MODEL_META[id]?.accentInk || accent
            return (
              <li key={id} className="group">
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-leaf-950">{name}</span>
                    <span className="text-[11px] font-medium text-leaf-950/82">
                      {r.input_size ? r.input_size.replace('x', ' × ') : ''}
                    </span>
                  </span>
                  <span className="font-display text-sm font-bold tnum" style={{ color: ink }}>
                    {value.toFixed(2)}%
                  </span>
                </div>

                <div className="relative h-3 w-full overflow-hidden rounded-full bg-leaf-50 ring-1 ring-inset ring-leaf-100/70">
                  {/* gridlines at 25 / 50 / 75 / 100 % — same track as the axis above */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                    {GRID.slice(1).map((g) => (
                      <span
                        key={g}
                        className="absolute inset-y-0 border-l border-dashed border-leaf-200/60"
                        style={{ left: `${g}%` }}
                      />
                    ))}
                  </span>
                  <span
                    className={`relative block h-full rounded-full ${inView ? 'bar-grow' : ''}`}
                    style={{
                      '--bar-w': `${value}%`,
                      width: inView ? undefined : 0,
                      background: `linear-gradient(90deg, ${accent}59, ${accent})`,
                      animationDelay: `${i * 110}ms`,
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 border-t border-leaf-50 pt-4 text-xs text-leaf-950/72">
          {t('models.axisNote')}
        </p>
      </div>
    </div>
  )
}

/** Compact variant used on the Home page. */
export function AccuracyChartMini({ results, className = '' }) {
  const { ref, inView } = useInView({ threshold: 0.25 })
  const rows = MODEL_ORDER.filter((id) => results?.[id]?.validation_accuracy != null)
  if (!rows.length) return null

  return (
    <div className={className} ref={ref}>
      <ul className="space-y-3.5">
        {rows.map((id, i) => {
          const value = results[id].validation_accuracy
          const accent = MODEL_META[id]?.accent || '#0d7d4e'
          const ink = MODEL_META[id]?.accentInk || accent
          return (
            <li key={id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-display text-sm font-semibold text-leaf-950">
                  {results[id].display_name || id}
                </span>
                <span className="text-xs font-bold tnum" style={{ color: ink }}>
                  {value.toFixed(2)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-leaf-100/70">
                <span
                  className={`block h-full rounded-full ${inView ? 'bar-grow' : ''}`}
                  style={{
                    '--bar-w': `${value}%`,
                    width: inView ? undefined : 0,
                    background: `linear-gradient(90deg, ${accent}59, ${accent})`,
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
