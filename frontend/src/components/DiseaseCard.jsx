import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { isHealthyKey } from '../data/diseaseData'
import { getLeafImage, getPlantDisplayName } from '../data/plants'
import { ArrowRight, ImageIcon } from './icons'

export default function DiseaseCard({ classKey, info }) {
  const { t, lang } = useLanguage()
  const [imgError, setImgError] = useState(false)
  const healthy = isHealthyKey(classKey)
  const plantRaw = info?.plant
  const plantLabel = getPlantDisplayName(plantRaw, lang)
  const name = info?.name || {}
  const nameLabel = name[lang] || name.en || classKey

  const imageSrc = getLeafImage(classKey)

  return (
    <Link
      to={`/disease-library/${encodeURIComponent(classKey)}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md hover:shadow-leaf-900/10"
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden p-6 ${
          healthy ? 'bg-leaf-50' : 'bg-gradient-to-br from-amber-50 to-leaf-50'
        }`}
      >
        {!imgError && imageSrc ? (
          <img
            src={imageSrc}
            alt={`${nameLabel} leaf`}
            onError={() => setImgError(true)}
            className="h-28 w-28 rounded-xl object-cover ring-2 ring-white shadow-md transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-xl border border-dashed border-leaf-300 bg-white/70 p-2 text-center">
            <ImageIcon size={20} className="text-leaf-400" />
            <span className="mt-1 text-[9px] font-semibold text-leaf-700">
              {t('gallery.refUnavailable') || 'Reference image not available'}
            </span>
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
            healthy ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {healthy ? t('library.healthyTag') : t('library.conditionTag')}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-4">
        <h4 className="font-display text-base font-semibold text-leaf-950">{nameLabel}</h4>
        <p className="text-sm text-leaf-950/70">{name.en || classKey}</p>
        <div className="mt-auto pt-3 text-xs font-semibold uppercase tracking-wide text-leaf-600">
          {plantLabel || plantRaw}
        </div>
      </div>
      <div className="flex items-center gap-1 border-t border-leaf-100 px-4 py-2.5 text-xs font-semibold text-leaf-600 transition-hover group-hover:text-leaf-700">
        {t('library.details')} <ArrowRight size={14} />
      </div>
    </Link>
  )
}