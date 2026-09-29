import { useLanguage } from '../context/LanguageContext'
import { CheckCircleIcon } from './icons'

const DEFAULT_INPUT = { CNN: '128 × 128', EfficientNetB0: '224 × 224', ResNet50: '224 × 224', MobileNetV2: '224 × 224', VGG16: '224 × 224' }

function Hourglass() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8" />
      <path d="M9 3v4.5l5 4.5-5 4.5V21h6" />
      <path d="M15 21h-2" />
    </svg>
  )
}

export default function ModelTable({ results }) {
  const { t } = useLanguage()

  const rows = Object.entries(results || {}).map(([key, r]) => {
    const available = r.validation_accuracy !== null && r.validation_accuracy !== undefined && r.status === 'Available'
    const accuracy = r.validation_accuracy !== null && r.validation_accuracy !== undefined ? r.validation_accuracy : null
    return {
      name: r.display_name || key,
      architecture: key === 'CNN' ? t('models.archCustom') : t('models.archTransfer'),
      input: r.input_size ? r.input_size.replace('x', ' × ') : DEFAULT_INPUT[key] || '—',
      accuracy,
      available,
    }
  })

  return (
    <div className="overflow-x-auto rounded-2xl border border-leaf-100 bg-white shadow-sm shadow-leaf-900/5">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-leaf-100 bg-leaf-50/80">
            <th className="px-5 py-4 font-display text-xs font-semibold uppercase tracking-wider text-leaf-800">{t('models.cols.model')}</th>
            <th className="px-5 py-4 font-display text-xs font-semibold uppercase tracking-wider text-leaf-800">{t('models.cols.arch')}</th>
            <th className="px-5 py-4 font-display text-xs font-semibold uppercase tracking-wider text-leaf-800">{t('models.cols.input')}</th>
            <th className="px-5 py-4 font-display text-xs font-semibold uppercase tracking-wider text-leaf-800">{t('models.cols.acc')}</th>
            <th className="px-5 py-4 font-display text-xs font-semibold uppercase tracking-wider text-leaf-800">{t('models.cols.status')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-leaf-50">
          {rows.map((row) => (
            <tr key={row.name} className="transition-hover hover:bg-leaf-50/40">
              <td className="px-5 py-4 font-display font-semibold text-leaf-950">{row.name}</td>
              <td className="px-5 py-4 text-leaf-950/85">{row.architecture}</td>
              <td className="px-5 py-4 text-leaf-950/85">{row.input}</td>
              <td className="px-5 py-4">
                {row.accuracy !== null ? (
                  <div className="max-w-40">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-leaf-700">{row.accuracy.toFixed(2)}%</span>
                      <span className="text-[11px] text-leaf-950/82">{t('models.imageCount')}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-leaf-100">
                      <div className="h-full rounded-full bg-leaf-500" style={{ width: `${row.accuracy}%` }} />
                    </div>
                  </div>
                ) : (
                  <span className="text-leaf-950/72">{t('models.pending')}</span>
                )}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    row.available ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {row.available ? <CheckCircleIcon size={13} /> : <Hourglass />}
                  {row.available ? t('models.available') : t('models.pending')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}