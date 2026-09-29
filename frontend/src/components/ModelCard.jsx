import { useLanguage } from '../context/LanguageContext'
import { MODEL_META } from '../data/projectData'
import { CheckCircleIcon, CpuIcon, LeafIcon, InfoIcon } from './icons'

/**
 * A single model card.
 *
 * Shows only reported values: the architecture type, the input resolution the
 * backend will resize to, and the validation accuracy from `model_results.json`.
 * It never labels one model "best" — that is a judgement for the reader.
 *
 * Layout is a fixed three-row grid (identity / accuracy / facts) so that cards
 * of different name lengths and different numbers of chips still line up when
 * they sit side by side in a row.
 */
export default function ModelCard({
  id,
  result,
  selected = false,
  onSelect,
  disabled = false,
  compact = false,
  tabIndex = 0,
  onKeyDown,
  cardRef,
}) {
  const { t } = useLanguage()
  const meta = MODEL_META[id] || {}
  const name = result?.display_name || id
  const isCustom = meta.type === 'custom'
  const typeLabel = isCustom ? t('models.archCustom') : t('models.archTransfer')
  const input = result?.input_size ? result.input_size.replace('x', ' × ') : meta.input || '—'
  const accuracy = result?.validation_accuracy
  const training = result?.training_accuracy
  const hasAccuracy = accuracy !== null && accuracy !== undefined
  const hasTraining = training !== null && training !== undefined
  const nr = t('research.metrics.nr')

  const body = (
    <>
      {/* Accent wash keyed to the architecture colour — always on for the selected card */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{ background: `radial-gradient(ellipse at 85% 0%, ${meta.accent}1f 0%, transparent 62%)` }}
      />

      {/* Row 1 — identity. Fixed height so every card's row 2 starts at the same y. */}
      <span className="relative flex items-center gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:scale-105 ${
            selected
              ? 'bg-gradient-to-br from-leaf-500 to-leaf-700 text-white shadow-md shadow-leaf-600/30'
              : 'bg-leaf-50 text-leaf-600'
          }`}
        >
          <CpuIcon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-bold leading-tight text-leaf-950">
            {name}
          </span>
          <span className="mt-0.5 block text-xs text-leaf-950/78">{typeLabel}</span>
        </span>
        {selected && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm"
            aria-hidden="true"
          >
            <CheckCircleIcon size={12} />
            {t('models.selectedBadge')}
          </span>
        )}
      </span>

      {/* Row 2 — accuracy. Own bordered block so the numbers always align. */}
      <span className="relative mt-4 block rounded-xl border border-leaf-100 bg-leaf-50/70 px-3 py-2.5">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-leaf-950/85">
            {t('models.accuracyLabel')}
          </span>
          <span
            className={`font-display text-lg font-bold leading-none tnum ${
              selected ? 'text-leaf-700' : 'text-leaf-800'
            }`}
          >
            {hasAccuracy ? `${accuracy.toFixed(2)}%` : nr}
          </span>
        </span>
        {hasTraining && (
          <span className="mt-1.5 flex items-baseline justify-between gap-2 border-t border-leaf-100 pt-1.5">
            <span className="text-[11px] font-medium text-leaf-950/85">{t('models.trainingLabel')}</span>
            <span className="text-xs font-semibold tnum text-leaf-950/88">
              {training.toFixed(2)}%
            </span>
          </span>
        )}
      </span>

      {/* Row 3 — description and hard facts. */}
      {!compact && (
        <span className="relative mt-3 block text-[13px] leading-relaxed text-leaf-950/82">
          {meta.summary}
        </span>
      )}

      <span className="relative mt-auto flex flex-wrap items-center gap-2 pt-4">
        <span className="chip">
          <InfoIcon size={12} />
          {t('models.inputLabel')}: {input}
        </span>
        {result?.validation_images ? (
          <span className="chip tnum">
            <LeafIcon size={12} />
            {t('models.validationImagesLabel')}: {Number(result.validation_images).toLocaleString('en-US')}
          </span>
        ) : null}
      </span>
    </>
  )

  const shell = `group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-300 ${
    selected
      ? 'gradient-border card-selected'
      : 'border-leaf-100 shadow-sm shadow-leaf-900/5 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lg hover:shadow-leaf-900/10'
  }`

  if (!onSelect) {
    return (
      <div className={shell}>
        {body}
        {selected && <span className="sr-only">{t('models.selectedBadge')}</span>}
      </div>
    )
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      tabIndex={tabIndex}
      ref={cardRef}
      onClick={() => onSelect(id)}
      onKeyDown={onKeyDown}
      className={`${shell} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
    >
      {body}
    </button>
  )
}
