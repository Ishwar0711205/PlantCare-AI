import { Link, useParams, Navigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useData, isHealthyKey } from '../data/diseaseData'
import { healthyImageFor } from '../data/plants'
import ResultSections from '../components/ResultSections'
import PlantLeaf from '../components/PlantLeaf'
import { ArrowLeft, CheckCircleIcon, AlertIcon, ImageIcon } from '../components/icons'

export default function DiseaseDetails() {
  const { key } = useParams()
  const { t, lang } = useLanguage()
  const { data, loading } = useData()

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-leaf-200 border-t-leaf-600" />
      </div>
    )
  }

  const infoMap = data?.info || {}
  const info = infoMap[key]
  if (!info) return <Navigate to="/disease-library" replace />

  const healthy = isHealthyKey(key)
  const name = info.name || {}
  const nameLabel = name[lang] || name.en || key
  const severity = info.severity || ''
  const realImage = healthy ? healthyImageFor(info.plant || key) : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Link
        to="/disease-library"
        className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-700 transition-hover hover:text-leaf-900"
      >
        <ArrowLeft size={16} />
        {t('library.backLabel')}
      </Link>

      <div className="mt-6 grid items-start gap-8 md:grid-cols-[auto_1fr]">
        <div
          className={`relative grid h-40 w-40 place-items-center overflow-hidden rounded-3xl ${
            healthy ? 'bg-leaf-50' : 'bg-gradient-to-br from-amber-50 to-leaf-50'
          }`}
        >
          {realImage ? (
            <img src={realImage} alt={`${nameLabel} leaf`} className="h-full w-full object-cover" />
          ) : (
            <PlantLeaf healthy={healthy} className="h-28 w-28" tooltip={nameLabel} />
          )}
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              healthy ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {healthy ? <CheckCircleIcon size={14} /> : <AlertIcon size={14} />}
            {healthy ? t('library.healthyTag') : t('library.conditionTag')}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-leaf-950">{nameLabel}</h1>
          <p className="mt-1 text-base text-leaf-950/78">{info.plant}</p>
          <div className="mt-3 space-y-0.5 text-sm text-leaf-950/88">
            <p>English: {name.en}</p>
            <p>हिन्दी: {name.hi}</p>
            <p>मराठी: {name.mr}</p>
            {severity && <p className="pt-1 text-xs uppercase tracking-wide text-leaf-950/72">Severity: {severity}</p>}
          </div>
        </div>
      </div>

      {!healthy && (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3 text-xs text-leaf-950/85">
          <ImageIcon size={15} className="shrink-0 text-leaf-500" />
          {t('library.imgNote')}
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-leaf-100 bg-leaf-50/50 p-6 sm:p-8">
        <ResultSections info={info} />
      </div>
    </div>
  )
}