import { useLanguage } from '../context/LanguageContext'
import InfoCard from './InfoCard'
import { MODEL_INPUT } from '../data/projectData'
import { getPlantDisplayName } from '../data/plants'
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
  en: { Healthy: 'Healthy', Moderate: 'Moderate', Severe: 'Severe' },
  hi: { Healthy: 'स्वस्थ', Moderate: 'मध्यम', Severe: 'गंभीर' },
  mr: { Healthy: 'निरोगी', Moderate: 'मध्यम', Severe: 'तीव्र' },
}

const LANG_LABEL = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' }

function pickLang(value, lang) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[lang] || value.en || ''
}

export default function ResultSections({ info, result }) {
  const { t, lang, n } = useLanguage()

  const healthy = result ? result.class.split('___')[1] === 'healthy' : false
  const severity = info?.severity
  const unavailable = t('detect.result.unavailable')

  const nameObj = info?.name || {}
  const otherNames = ['en', 'hi', 'mr'].filter((l) => l !== lang && nameObj[l])

  const localizedPlant = getPlantDisplayName(info?.plant, lang)

  // Structured fields from plant_info.json (mapped to exact class)
  const symptoms = info?.symptoms?.[lang] || info?.symptoms?.en || ''
  const immediateActions = info?.what_to_do?.[lang] || info?.what_to_do?.en || ''
  const treatmentSpray = info?.spray?.[lang] || info?.spray?.en || ''
  const expertSafety = info?.safety_note?.[lang] || info?.safety_note?.en || ''

  // Optional fields if added in the knowledge base
  const causes = pickLang(info?.causes, lang)
  const affected = pickLang(info?.affected_parts, lang)

  const careItems = t('detect.healthy.careItems')
  const modelId = result?.model
  const inputSize = modelId ? MODEL_INPUT[modelId] : null

  return (
    <div className="space-y-6">
      {/* ── Main Solution Header ───────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-leaf-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-leaf-100 text-leaf-700">
              <FlaskIcon size={16} />
            </span>
            <h2 className="font-display text-xl font-bold text-leaf-950 sm:text-2xl">
              {t('solution.title')}
            </h2>
          </div>
          <p className="mt-1 text-xs text-leaf-950/70 sm:text-sm">
            {t('solution.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {modelId && (
            <span className="chip">
              <CpuIcon size={12} />
              {t('detect.result.modelUsed')}: {modelId}
              {inputSize ? ` · ${n(inputSize)}` : ''}
            </span>
          )}
          <span
            className={`chip font-bold ${
              healthy
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-amber-300 bg-amber-50 text-amber-900'
            }`}
          >
            {healthy ? <LeafIcon size={12} /> : <ActivityIcon size={12} />}
            {SEVERITY_LABEL[lang]?.[severity] || severity || (healthy ? 'Healthy' : 'Moderate')}
          </span>
        </div>
      </header>

      {/* ── Overview & Identification Cards ────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={<BookOpenIcon size={16} />} title={t('solution.overviewTitle') || t('detect.details.overview')}>
          <p className="font-display text-base font-bold text-leaf-950">
            {nameObj[lang] || nameObj.en || '—'}
          </p>
          {otherNames.length > 0 && (
            <ul className="mt-2 space-y-1">
              {otherNames.map((l) => (
                <li key={l} className="text-xs text-leaf-950/80">
                  <span className="font-semibold text-leaf-950/70">{LANG_LABEL[l]}:</span> {nameObj[l]}
                </li>
              ))}
            </ul>
          )}
        </InfoCard>

        <InfoCard icon={<LeafIcon size={16} />} title={t('detect.result.plant')}>
          <p className="font-display text-base font-bold text-leaf-950">{localizedPlant || info?.plant || '—'}</p>
          <p className="mt-1 text-xs text-leaf-950/70">
            {info?.plant ? `Scientific classification: ${info.plant}` : ''}
          </p>
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
      </div>

      {/* ── Healthy State Guidance (Positive message & Preventive care) ── */}
      {healthy ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-leaf-50/60 p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <CheckCircleIcon size={22} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-emerald-950 sm:text-xl">
                {t('solution.healthyTitle') || 'Healthy Crop Detected!'}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-emerald-950/80 sm:text-sm">
                {t('solution.healthyText')}
              </p>
            </div>
          </div>

          {/* Preventive Care Checklist */}
          <div className="mt-6 border-t border-emerald-100 pt-5">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <SproutIcon size={14} className="text-emerald-700" />
              {t('solution.healthyCareTitle') || 'Preventive Care Guidelines'}
            </h4>
            {immediateActions && (
              <p className="mt-2 text-xs leading-relaxed text-emerald-950/85 sm:text-sm">
                {immediateActions}
              </p>
            )}

            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(Array.isArray(careItems) ? careItems : [
                'Regular field scouting and leaf inspection',
                'Balanced crop nutrition and organic compost',
                'Appropriate drip or furrow irrigation',
                'Field sanitation and tool hygiene',
              ]).map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl border border-emerald-200/60 bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-emerald-950 shadow-2xs sm:text-sm"
                >
                  <CheckCircleIcon size={15} className="shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Explicit Note: No Spray Needed for healthy leaves */}
          <div className="mt-5 rounded-2xl border border-emerald-300/70 bg-emerald-100/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-900">
              🛡️ {t('solution.noSprayTitle') || 'No Chemical Spray Required'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-950/85 sm:text-sm">
              {treatmentSpray || t('solution.noSprayNote')}
            </p>
          </div>
        </div>
      ) : (
        /* ── Diseased State Guidance: Symptoms, Immediate Actions, Spray, Prevention ── */
        <div className="space-y-4">
          {/* Common Symptoms */}
          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/60 p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-amber-900 sm:text-base">
              <AlertIcon size={18} className="text-amber-600" />
              {t('solution.symptomsTitle') || t('detect.result.symptoms')}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-amber-950 sm:text-sm">
              {symptoms || unavailable}
            </p>
          </div>

          {/* Immediate Actions (What To Do Now) */}
          <div className="rounded-2xl border border-leaf-200 bg-leaf-50/60 p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-leaf-900 sm:text-base">
              <SproutIcon size={18} className="text-leaf-600" />
              {t('solution.immediateActionTitle') || t('detect.result.prevention')}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-leaf-950 sm:text-sm">
              {immediateActions || unavailable}
            </p>
          </div>

          {/* Recommended Treatment & Spray (Label Guidance from knowledge base) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-blue-900 sm:text-base">
              <FlaskIcon size={18} className="text-blue-600" />
              {t('solution.managementTitle') || t('detect.result.management')}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-blue-950 sm:text-sm">
              {treatmentSpray || unavailable}
            </p>
            <p className="mt-3 text-[11px] font-semibold text-blue-900/70 sm:text-xs">
              ⚠️ {t('solution.expertDisclaimer')}
            </p>
          </div>
        </div>
      )}

      {/* ── Expert Advice & Safety Precautions ──────────────── */}
      <div className="rounded-2xl border border-rose-200/90 bg-gradient-to-r from-rose-50/80 to-amber-50/60 p-5 sm:p-6">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-rose-900 sm:text-base">
          <ShieldIcon size={18} className="text-rose-600" />
          {t('solution.expertTitle') || t('detect.result.expert')}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-rose-950/90 sm:text-sm">
          {expertSafety || unavailable}
        </p>
      </div>
    </div>
  )
}
