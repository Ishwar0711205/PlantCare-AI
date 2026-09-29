import { useLanguage } from '../context/LanguageContext'
import { MODEL_ORDER, MODEL_META, pct } from '../data/projectData'
import { CheckCircleIcon, ChartIcon } from './icons'

/**
 * Verified per-model metrics.
 *
 * Every number is read from `model_results.json`. Training accuracy that was
 * never recorded is rendered as "N/R" rather than being filled in.
 */
export default function MetricsTable({ results }) {
  const { t } = useLanguage()
  const nr = t('research.metrics.nr')

  const rows = MODEL_ORDER.filter((id) => results?.[id])
  if (!rows.length) return null

  const cell = 'px-4 py-3.5 text-sm align-middle sm:px-5'

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-leaf-100 bg-gradient-to-r from-leaf-50/90 to-white px-5 py-4 sm:px-7">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-leaf-950">
          <ChartIcon size={18} className="text-leaf-600" />
          {t('research.metrics.title')}
        </h2>
        <p className="mt-1 text-sm text-leaf-950/85">{t('research.metrics.subtitle')}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">{t('research.metrics.title')}</caption>
          <thead>
            <tr className="border-b border-leaf-100 bg-leaf-50/50">
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.model')}
              </th>
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.architecture')}
              </th>
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.input')}
              </th>
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.training')}
              </th>
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.validation')}
              </th>
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.precision')}
              </th>
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.recall')}
              </th>
              <th scope="col" className={`${cell} font-display text-xs font-bold uppercase tracking-wider text-leaf-800`}>
                {t('research.metrics.cols.f1')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-leaf-50">
            {rows.map((id, i) => {
              const r = results[id]
              const meta = MODEL_META[id] || {}
              const hasTrain = r.training_accuracy !== null && r.training_accuracy !== undefined
              return (
                <tr
                  key={id}
                  className="transition-colors hover:bg-leaf-50/40"
                  style={{ animation: 'fadeUp 0.5s ease-out both', animationDelay: `${i * 70}ms` }}
                >
                  <th scope="row" className={`${cell} font-display font-bold text-leaf-950`}>
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: meta.accent || '#0d7d4e' }}
                      />
                      {r.display_name || id}
                    </span>
                  </th>
                  <td className={`${cell} text-leaf-950/82`}>
                    {meta.type === 'custom' ? t('models.archCustom') : t('models.archTransfer')}
                  </td>
                  <td className={`${cell} tnum text-leaf-950/82`}>
                    {r.input_size ? r.input_size.replace('x', ' × ') : meta.input || '—'}
                  </td>
                  <td className={`${cell} tnum`}>
                    {hasTrain ? (
                      <span className="font-medium text-leaf-950/88">{pct(r.training_accuracy, nr)}</span>
                    ) : (
                      <span className="rounded-md bg-leaf-50 px-2 py-0.5 text-xs font-semibold text-leaf-950/82">
                        {nr}
                      </span>
                    )}
                  </td>
                  <td className={`${cell} tnum`}>
                    <span className="inline-flex items-center gap-1.5 font-bold text-leaf-700">
                      <CheckCircleIcon size={13} />
                      {pct(r.validation_accuracy, nr)}
                    </span>
                  </td>
                  <td className={`${cell} tnum text-leaf-950/85`}>{pct(r.macro_precision, nr)}</td>
                  <td className={`${cell} tnum text-leaf-950/85`}>{pct(r.macro_recall, nr)}</td>
                  <td className={`${cell} tnum text-leaf-950/85`}>{pct(r.macro_f1, nr)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="border-t border-leaf-50 px-5 py-4 text-xs leading-relaxed text-leaf-950/85 sm:px-7">
        {t('research.metrics.note')}
      </p>
    </div>
  )
}
