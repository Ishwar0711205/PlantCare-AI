import { useLanguage } from '../context/LanguageContext'
import useRadioGroup from '../hooks/useRadioGroup'
import ModelCard from './ModelCard'
import { CpuIcon } from './icons'

/**
 * Model picker used on the Detection page.
 *
 * Renders the trained models as selectable cards. The backend decides which
 * models are actually available; the picker only offers what is handed to it.
 *
 * Keyboard behaviour (one tab stop, arrow keys to move and select) lives in
 * useRadioGroup.
 */
export default function ModelSelector({ models, results, selected, onSelect, disabled = false }) {
  const { t } = useLanguage()

  /* Availability is unknown until model_results.json arrives, so an unknown
     model is left interactive rather than locking the user out mid-load. */
  const isUnavailable = (id) => {
    const r = results?.[id]
    if (!r) return false
    return !(r.status === 'Available' || r.validation_accuracy != null)
  }

  const { setNode, tabIndexFor, onKeyDown } = useRadioGroup(models || [], selected, onSelect, isUnavailable)

  if (!models?.length) {
    return (
      <p className="rounded-xl border border-dashed border-leaf-200 bg-leaf-50/40 px-4 py-6 text-center text-sm text-leaf-950/85">
        {t('detect.modelHelp')}
      </p>
    )
  }

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-leaf-600">
        <CpuIcon size={13} />
        {t('detect.modelLabel')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t('detect.modelLabel')}>
        {models.map((id) => (
          <ModelCard
            key={id}
            id={id}
            result={results?.[id]}
            selected={selected === id}
            onSelect={onSelect}
            disabled={disabled || isUnavailable(id)}
            compact
            tabIndex={tabIndexFor(id)}
            onKeyDown={(e) => onKeyDown(e, id)}
            cardRef={(el) => setNode(id, el)}
          />
        ))}
      </div>
    </div>
  )
}
