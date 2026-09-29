import { useLanguage } from '../context/LanguageContext'
import { CheckCircleIcon, ScanIcon } from './icons'

export default function HealthyPlantCard({ plant, onOpen }) {
  const { t, lang } = useLanguage()
  const name = plant.names[lang] || plant.names.en
  return (
    <button
      type="button"
      onClick={() => onOpen?.(plant)}
      aria-label={`${name} healthy leaf — click to view full size`}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-leaf-100 bg-white text-left shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-300 hover:shadow-xl hover:shadow-leaf-900/15 focus-visible:ring-2 focus-visible:ring-leaf-500"
    >
      <div className="relative overflow-hidden bg-leaf-50">
        <img
          src={plant.image}
          alt={`${name} healthy leaf`}
          className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-leaf-700 shadow-sm">
          <CheckCircleIcon size={12} />
          {t('healthy.healthyLabel')}
        </span>
        <span className="absolute inset-0 flex items-center justify-center bg-leaf-900/0 transition-all duration-300 group-hover:bg-leaf-900/25 group-hover:backdrop-blur-[2px]">
          <span className="inline-flex translate-y-3 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-leaf-800 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ScanIcon size={15} />
            {t('healthy.viewFull')}
          </span>
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-display text-base font-semibold text-leaf-950">{name}</h4>
        <p className="mt-1 truncate text-sm text-leaf-950/85">{plant.names.en}</p>
      </div>
    </button>
  )
}