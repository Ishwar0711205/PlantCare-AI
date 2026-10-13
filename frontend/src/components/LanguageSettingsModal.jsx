import { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { languageOptions } from '../data/translations'
import { GlobeIcon, CheckCircleIcon, CloseIcon } from './icons'

export default function LanguageSettingsModal({ open, onClose }) {
  const { lang, setLang, t } = useLanguage()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const languageDescriptions = {
    en: t('langSettings.englishDesc') || 'Standard English interface with complete scientific and agricultural terms.',
    hi: t('langSettings.hindiDesc') || 'भारतीय किसानों के लिए सरल, सहज और प्रामाणिक कृषि शब्दावली।',
    mr: t('langSettings.marathiDesc') || 'महाराष्ट्रातील शेतकऱ्यांसाठी सोपी, स्पष्ट आणि स्थानिक कृषी भाषा.',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-leaf-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-leaf-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-leaf-100 text-leaf-700 shadow-inner">
              <GlobeIcon size={22} />
            </span>
            <div>
              <h2 id="lang-settings-title" className="font-display text-xl font-bold text-leaf-950 sm:text-2xl">
                {t('langSettings.title')}
              </h2>
              <p className="mt-1 text-xs text-leaf-950/70 sm:text-sm">
                {t('langSettings.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close') || 'Close'}
            className="grid h-8 w-8 place-items-center rounded-full bg-leaf-100 text-leaf-800 transition-colors hover:bg-leaf-200"
          >
            <CloseIcon size={15} />
          </button>
        </div>

        {/* Options List */}
        <div className="mt-6 space-y-3">
          {languageOptions.map((opt) => {
            const isSelected = opt.code === lang
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLang(opt.code)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-leaf-500 bg-leaf-50/80 shadow-sm shadow-leaf-500/10'
                    : 'border-leaf-200 bg-white hover:border-leaf-300 hover:bg-leaf-50/30'
                }`}
              >
                <div
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all ${
                    isSelected
                      ? 'border-leaf-600 bg-leaf-600 text-white'
                      : 'border-leaf-300 bg-white text-transparent'
                  }`}
                >
                  <CheckCircleIcon size={14} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-leaf-950">
                      {opt.native} <span className="text-xs font-normal text-leaf-950/60">({opt.label})</span>
                    </span>
                    {isSelected && (
                      <span className="rounded-full bg-leaf-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-leaf-800">
                        {t('langSettings.activeBadge') || 'Current'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-leaf-950/75">
                    {languageDescriptions[opt.code]}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Note */}
        <div className="mt-5 rounded-xl border border-leaf-100 bg-leaf-50/60 p-3 text-xs leading-relaxed text-leaf-800">
          {t('langSettings.naturalNote')}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary rounded-xl px-5 py-2.5 text-xs font-bold text-white sm:text-sm"
          >
            {t('langSettings.applyBtn') || 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
