import { useLanguage } from '../context/LanguageContext'
import InfoCard, { MissingFieldNote } from './InfoCard'
import { MODEL_INPUT } from '../data/projectData'
import {
  BookOpenIcon,
  AlertIcon,
  SproutIcon,
  FlaskIcon,
  ShieldIcon,
  LeafIcon,
  CheckCircleIcon,
  ActivityIcon,
  CpuIcon,
  InfoIcon,
} from './icons'

const SEVERITY_LABEL = {
  en: { Healthy: 'Healthy', Moderate: 'Moderate' },
  hi: { Healthy: 'स्वस्थ', Moderate: 'मध्यम' },
  mr: { Healthy: 'निरोगी', Moderate: 'मध्यम' },
}

const LANG_LABEL = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' }

/**
 * Reads a knowledge-base field that may be either a plain string or a
 * per-language object, falling back to English. Returns '' when absent so the
 * caller can distinguish "not recorded" from "recorded but empty".
 */
function pickLang(value, lang) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[lang] || value.en || ''
}

/**
 * Disease information shown directly beneath the prediction.
 *
 * Every value is read from `plant_info.json` for the predicted class. Fields
 * the knowledge base does not record (causes, affected parts) say so plainly
 * rather than being filled with generic advice, and no medicine, chemical or
 * dosage is ever produced here — the management text is the project's own
 * label-approved guidance.
 */
export default function ResultSections({ info, result }) {
  const { t, lang } = useLanguage()

  const healthy = result ? result.class.split('___')[1] === 'healthy' : false
  const severity = info?.severity
  const unavailable = t('detect.result.unavailable')

  const nameObj = info?.name || {}
  const otherNames = ['en', 'hi', 'mr'].filter((l) => l !== lang && nameObj[l])

  const symptoms = info?.symptoms?.[lang] || info?.symptoms?.en || ''
  const prevention = info?.what_to_do?.[lang] || info?.what_to_do?.en || ''
  const management = info?.spray?.[lang] || info?.spray?.en || ''
  const expert = info?.safety_note?.[lang] || info?.safety_note?.en || ''

  /* Optional fields: absent from the current knowledge base, but honoured
     automatically if they are added later. Never substituted with guesses. */
  const causes = pickLang(info?.causes, lang)
  const affected = pickLang(info?.affected_parts, lang)

  const careItems = t('detect.healthy.careItems')
  const modelId = result?.model
  const inputSize = MODEL_INPUT[modelId]

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-leaf-950">
          <BookOpenIcon size={18} className="text-leaf-600" />
          {t('detect.details.overview')}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {modelId && (
            <span className="chip">
              <CpuIcon size={12} />
              {t('detect.result.modelUsed')}: {modelId}
              {inputSize ? ` · ${inputSize}` : ''}
            </span>
          )}
          <span
            className={`chip ${
              healthy ? 'bg-leaf-100 text-leaf-700' : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}
          >
            {healthy ? <LeafIcon size={12} /> : <ActivityIcon size={12} />}
            {SEVERITY_LABEL[lang]?.[severity] || severity || '—'}
          </span>
        </div>
      </header>

      {/* Identity grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={<BookOpenIcon size={16} />} title={t('detect.result.disease')}>
          <p className="font-display text-base font-bold text-leaf-950">
            {nameObj[lang] || nameObj.en || '—'}
          </p>
          {otherNames.length > 0 && (
            <ul className="mt-2 space-y-1">
              {otherNames.map((l) => (
                <li key={l} className="text-[13px] text-leaf-950/85">
                  <span className="font-semibold text-leaf-950/82">{LANG_LABEL[l]}:</span> {nameObj[l]}
                </li>
              ))}
            </ul>
          )}
        </InfoCard>

        <InfoCard icon={<LeafIcon size={16} />} title={t('detect.result.plant')}>
          <p className="font-display text-base font-bold text-leaf-950">{info?.plant || '—'}</p>
        </InfoCard>

        <InfoCard icon={<ActivityIcon size={16} />} title={t('detect.result.diseaseType')} className="sm:col-span-2">
          <p className="font-semibold text-leaf-900">
            {SEVERITY_LABEL[lang]?.[severity] || severity || unavailable}
          </p>
          <p className="mt-1 text-[13px] text-leaf-950/85">{t('detect.result.severityCaption')}</p>
        </InfoCard>
      </div>

      {/* Symptoms / prevention / management / expert advice */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={<AlertIcon size={16} />} title={t('detect.result.symptoms')} tone="amber">
          {symptoms || unavailable}
        </InfoCard>

        {causes && (
          <InfoCard icon={<InfoIcon size={16} />} title={t('detect.result.causes')} tone="slate">
            {causes}
          </InfoCard>
        )}

        {affected && (
          <InfoCard icon={<ActivityIcon size={16} />} title={t('detect.result.affected')} tone="slate">
            {affected}
          </InfoCard>
        )}

        <InfoCard icon={<SproutIcon size={16} />} title={t('detect.result.prevention')}>
          {prevention || unavailable}
        </InfoCard>

        <InfoCard icon={<FlaskIcon size={16} />} title={t('detect.result.management')} className="sm:col-span-2">
          {management || unavailable}
        </InfoCard>
      </div>

      {/* Healthy classes get a care checklist instead of disease guidance */}
      {healthy && (
        <div className="rounded-2xl border border-leaf-200 bg-gradient-to-br from-leaf-50 to-white p-5">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-leaf-900">
            <CheckCircleIcon size={18} className="text-leaf-600" />
            {t('detect.healthy.careTitle')}
          </h3>
          {prevention && <p className="mt-2 text-sm leading-relaxed text-leaf-950/82">{prevention}</p>}
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(Array.isArray(careItems) ? careItems : []).map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-xl border border-white bg-white/85 px-3.5 py-2.5 text-sm font-medium text-leaf-900"
              >
                <CheckCircleIcon size={15} className="shrink-0 text-leaf-500" />
                {item}
              </li>
            ))}
          </ul>
          {management && (
            <p className="mt-4 border-t border-leaf-200/60 pt-3 text-sm leading-relaxed text-leaf-950/88">
              {management}
            </p>
          )}
        </div>
      )}

      <InfoCard icon={<ShieldIcon size={16} />} title={t('detect.result.expert')} tone="amber">
        {expert || unavailable}
      </InfoCard>
    </div>
  )
}
