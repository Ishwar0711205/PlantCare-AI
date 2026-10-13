import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useData, isHealthyKey } from '../data/diseaseData'
import { healthyPlants, getLeafImage, getPlantDisplayName } from '../data/plants'
import Lightbox from '../components/Lightbox'
import Reveal from '../components/Reveal'
import {
  SearchIcon,
  LeafIcon,
  CheckCircleIcon,
  AlertIcon,
  ArrowRight,
  CloseIcon,
  ShieldIcon,
  SproutIcon,
  FlaskIcon,
  BookOpenIcon,
  MicroscopeIcon,
  ImageIcon,
} from '../components/icons'

export default function LeafGallery() {
  const { t, lang } = useLanguage()
  const { data, loading } = useData()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all') // 'all' | 'healthy' | 'diseased'
  const [selectedCrop, setSelectedCrop] = useState('all')
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [lightboxImg, setLightboxImg] = useState(null)

  const infoMap = data?.info || {}
  const rawClasses = data?.classes || []

  // Ensure ALL 38 classes are indexed and mapped cleanly
  const allLeafItems = useMemo(() => {
    return rawClasses.map((classKey) => {
      const info = infoMap[classKey] || {}
      const isHealthy = isHealthyKey(classKey)
      const plantRaw = info.plant || classKey.split('___')[0].replace(/_/g, ' ')
      const imageSrc = getLeafImage(classKey)
      const nameObj = info.name || {}
      const symptomsObj = info.symptoms || {}

      return {
        classKey,
        isHealthy,
        plantRaw,
        imageSrc,
        info,
        name: nameObj[lang] || nameObj.en || classKey.replace(/___/g, ' - '),
        nameEn: nameObj.en || classKey,
        plantName: getPlantDisplayName(plantRaw, lang),
        symptoms: symptomsObj[lang] || symptomsObj.en || '',
        severity: info.severity || (isHealthy ? 'Healthy' : 'Moderate'),
      }
    })
  }, [rawClasses, infoMap, lang])

  // Filter items by status, crop, and multi-language search query
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allLeafItems.filter((item) => {
      // Category filter
      if (status === 'healthy' && !item.isHealthy) return false
      if (status === 'diseased' && item.isHealthy) return false

      // Crop filter
      if (selectedCrop !== 'all') {
        const itemPlantKey = String(item.plantRaw).toLowerCase().replace(/[^a-z0-9]/g, '')
        const cropKey = String(selectedCrop).toLowerCase().replace(/[^a-z0-9]/g, '')
        if (!itemPlantKey.includes(cropKey) && !cropKey.includes(itemPlantKey)) {
          return false
        }
      }

      // Search across class key, English name, local name, plant, and symptoms
      if (q) {
        const searchCorpus = [
          item.classKey,
          item.name,
          item.nameEn,
          item.plantName,
          item.plantRaw,
          item.info?.name?.hi,
          item.info?.name?.mr,
          item.symptoms,
          item.info?.symptoms?.en,
          item.info?.symptoms?.hi,
          item.info?.symptoms?.mr,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!searchCorpus.includes(q)) return false
      }

      return true
    })
  }, [allLeafItems, search, status, selectedCrop])

  // Statistics
  const healthyCount = useMemo(() => allLeafItems.filter((i) => i.isHealthy).length, [allLeafItems])
  const diseasedCount = useMemo(() => allLeafItems.filter((i) => !i.isHealthy).length, [allLeafItems])

  function resetFilters() {
    setSearch('')
    setStatus('all')
    setSelectedCrop('all')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* ── Page Header ─────────────────────────────────────── */}
      <header className="mx-auto max-w-3xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5">
          <LeafIcon size={14} className="text-leaf-600" />
          {t('gallery.badge') || '38 Leaf Classes Reference'}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-leaf-950 sm:text-4xl lg:text-5xl">
          {t('gallery.title')}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-leaf-950/80 sm:text-lg">
          {t('gallery.subtitle')}
        </p>
      </header>

      {/* ── Controls & Filter Bar ────────────────────────────── */}
      <div className="mt-10 rounded-2xl border border-leaf-200/80 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-500"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('gallery.searchPlaceholder')}
              className="w-full rounded-xl border border-leaf-200 bg-white py-2.5 pl-11 pr-10 text-sm text-leaf-950 outline-none transition-all placeholder:text-leaf-950/50 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-leaf-400 hover:text-leaf-700"
                aria-label="Clear search"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Tabs (All / Healthy / Diseased) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatus('all')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                status === 'all'
                  ? 'bg-leaf-700 text-white shadow-sm shadow-leaf-700/25'
                  : 'border border-leaf-200 bg-white text-leaf-900 hover:border-leaf-400 hover:bg-leaf-50'
              }`}
            >
              {t('gallery.allCount', { count: allLeafItems.length }) || `All (${allLeafItems.length})`}
            </button>
            <button
              type="button"
              onClick={() => setStatus('healthy')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                status === 'healthy'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'border border-leaf-200 bg-white text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              <CheckCircleIcon size={14} />
              {t('gallery.healthyCount', { count: healthyCount }) || `Healthy (${healthyCount})`}
            </button>
            <button
              type="button"
              onClick={() => setStatus('diseased')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                status === 'diseased'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/25'
                  : 'border border-leaf-200 bg-white text-amber-900 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              <AlertIcon size={14} />
              {t('gallery.diseasedCount', { count: diseasedCount }) || `Diseased (${diseasedCount})`}
            </button>
          </div>

          {/* Crop Selector */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              aria-label={t('gallery.cropFilter')}
              className="w-full rounded-xl border border-leaf-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-leaf-950 outline-none transition-all focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 sm:text-sm"
            >
              <option value="all">{t('gallery.allCrops') || 'All 14 Crops'}</option>
              {healthyPlants.map((plant) => (
                <option key={plant.key} value={plant.key}>
                  {plant.names[lang] || plant.names.en} ({plant.names.en})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter and Active Filter Feedback */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-leaf-100 pt-3 text-xs text-leaf-950/70">
          <span>
            {t('gallery.showing', {
              count: filteredItems.length,
              total: allLeafItems.length,
            }) || `Showing ${filteredItems.length} of ${allLeafItems.length} leaf classes`}
          </span>
          {(search || status !== 'all' || selectedCrop !== 'all') && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-bold text-leaf-700 underline underline-offset-2 hover:text-leaf-900"
            >
              {t('gallery.resetFilters')}
            </button>
          )}
        </div>
      </div>

      {/* ── Content Grid ────────────────────────────────────── */}
      {loading ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-leaf-200 border-t-leaf-600" />
          <p className="text-sm font-semibold text-leaf-950/70">Loading Leaf Gallery…</p>
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty state */
        <div className="mt-12 rounded-3xl border border-dashed border-leaf-200 bg-white/70 p-12 text-center backdrop-blur">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-leaf-50 text-leaf-500">
            <SearchIcon size={28} />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-leaf-950">
            {t('gallery.noResultsTitle')}
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-leaf-950/70">
            {t('gallery.noResultsText')}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white sm:text-sm"
          >
            {t('gallery.resetFilters')}
          </button>
        </div>
      ) : (
        /* Card Grid */
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, idx) => (
            <Reveal key={item.classKey} delay={Math.min(idx * 25, 300)}>
              <LeafCard
                item={item}
                onOpenDetails={() => setActiveModalItem(item)}
                onZoomImg={() => setLightboxImg(item.imageSrc)}
              />
            </Reveal>
          ))}
        </div>
      )}

      {/* ── Detailed Modal Popup ─────────────────────────────── */}
      {activeModalItem && (
        <LeafDetailModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onZoomImg={() => setLightboxImg(activeModalItem.imageSrc)}
        />
      )}

      {/* ── Lightbox for full photo zoom ─────────────────────── */}
      <Lightbox
        open={Boolean(lightboxImg)}
        onClose={() => setLightboxImg(null)}
        image={lightboxImg}
        title={activeModalItem ? activeModalItem.name : t('detect.previewTitle')}
      />
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   LEAF CARD COMPONENT
   Correctly matched real image with placeholder fallback,
   plant name, disease name, category tag, short symptoms & action button.
   ────────────────────────────────────────────────────────────── */
function LeafCard({ item, onOpenDetails, onZoomImg }) {
  const { t } = useLanguage()
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-leaf-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-xl hover:shadow-leaf-900/10">
      {/* Leaf Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-leaf-50 to-leaf-100/60">
        {!imgFailed && item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={`${item.name} leaf`}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Explicit, transparent placeholder when reference image is absent */
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-leaf-100 text-leaf-500">
              <ImageIcon size={22} />
            </div>
            <p className="mt-2 text-xs font-semibold text-leaf-700/80">
              {t('gallery.refUnavailable') || 'Reference image not available'}
            </p>
          </div>
        )}

        {/* Category Badge (Healthy vs Diseased) */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur ${
            item.isHealthy
              ? 'bg-emerald-600/90 text-white'
              : 'bg-amber-500/95 text-amber-950'
          }`}
        >
          {item.isHealthy ? <CheckCircleIcon size={12} /> : <AlertIcon size={12} />}
          {item.isHealthy ? t('gallery.healthy') : t('gallery.diseased')}
        </span>

        {/* Zoom button on image */}
        {!imgFailed && item.imageSrc && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onZoomImg?.()
            }}
            aria-label="Zoom image"
            className="absolute bottom-2.5 right-2.5 rounded-lg bg-leaf-950/60 p-1.5 text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 hover:bg-leaf-950"
          >
            <SearchIcon size={14} />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Plant tag */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-leaf-700">
            <SproutIcon size={12} />
            {item.plantName}
          </span>
          <span className="rounded bg-leaf-50 px-2 py-0.5 text-[10px] font-semibold text-leaf-700">
            {item.severity}
          </span>
        </div>

        {/* Localized Disease Title */}
        <h3 className="mt-1.5 font-display text-base font-bold text-leaf-950 line-clamp-1 group-hover:text-leaf-800">
          {item.name}
        </h3>

        {/* English Technical Name (if localized title is Hindi/Marathi) */}
        {item.nameEn && item.nameEn !== item.name && (
          <p className="text-xs font-medium text-leaf-950/60 line-clamp-1">{item.nameEn}</p>
        )}

        {/* Short Symptoms summary */}
        <p className="mt-2.5 text-xs leading-relaxed text-leaf-950/75 line-clamp-2">
          {item.symptoms || (item.isHealthy ? t('solution.healthyText') : '—')}
        </p>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={onOpenDetails}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-leaf-200 bg-leaf-50/70 py-2 text-xs font-bold text-leaf-800 transition-all hover:border-leaf-400 hover:bg-leaf-600 hover:text-white"
          >
            {t('gallery.viewDetails')}
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   LEAF DETAIL MODAL
   Displays complete symptoms, treatment & solution, what to do,
   safety note, and image zoom for the clicked class.
   ────────────────────────────────────────────────────────────── */
function LeafDetailModal({ item, onClose, onZoomImg }) {
  const { t, lang } = useLanguage()
  const info = item.info || {}
  const nameObj = info.name || {}
  const isHealthy = item.isHealthy

  const whatToDo = info.what_to_do?.[lang] || info.what_to_do?.en || ''
  const spray = info.spray?.[lang] || info.spray?.en || ''
  const safety = info.safety_note?.[lang] || info.safety_note?.en || ''

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-leaf-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-leaf-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('gallery.close')}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-leaf-100 text-leaf-800 transition-colors hover:bg-leaf-200"
        >
          <CloseIcon size={16} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-leaf-200 bg-leaf-50">
            {item.imageSrc ? (
              <img
                src={item.imageSrc}
                alt={item.name}
                className="h-full w-full object-cover cursor-zoom-in"
                onClick={onZoomImg}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-leaf-400">
                <ImageIcon size={32} />
              </div>
            )}
            <button
              type="button"
              onClick={onZoomImg}
              className="absolute bottom-1 right-1 rounded bg-leaf-950/70 p-1 text-white hover:bg-leaf-950"
            >
              <SearchIcon size={12} />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  isHealthy
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {isHealthy ? <CheckCircleIcon size={12} /> : <AlertIcon size={12} />}
                {isHealthy ? t('gallery.healthy') : t('gallery.diseased')}
              </span>
              <span className="text-xs font-semibold text-leaf-600">
                {item.plantName}
              </span>
            </div>

            <h2 className="mt-2 font-display text-2xl font-bold text-leaf-950 sm:text-3xl">
              {item.name}
            </h2>

            {/* Other language names */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-leaf-950/70">
              {nameObj.en && <span>EN: <strong className="text-leaf-900">{nameObj.en}</strong></span>}
              {nameObj.hi && <span>HI: <strong className="text-leaf-900">{nameObj.hi}</strong></span>}
              {nameObj.mr && <span>MR: <strong className="text-leaf-900">{nameObj.mr}</strong></span>}
            </div>
          </div>
        </div>

        {/* Modal Sections */}
        <div className="mt-6 space-y-4">
          {/* Symptoms */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <AlertIcon size={14} className="text-amber-600" />
              {t('gallery.symptoms')}
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-amber-950/90">
              {item.symptoms || '—'}
            </p>
          </div>

          {/* Immediate Actions / What To Do */}
          <div className="rounded-2xl border border-leaf-200 bg-leaf-50/60 p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-leaf-900">
              <SproutIcon size={14} className="text-leaf-700" />
              {t('gallery.whatToDo')}
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-leaf-950/90">
              {whatToDo || '—'}
            </p>
          </div>

          {/* Treatment & Spray Guidance */}
          <div className="rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-leaf-900">
              <FlaskIcon size={14} className="text-leaf-700" />
              {t('gallery.spray')}
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-leaf-950/90">
              {spray || '—'}
            </p>
          </div>

          {/* Expert Safety Note */}
          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-900">
              <ShieldIcon size={14} className="text-rose-600" />
              {t('gallery.safetyNote')}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-rose-950/85">
              {safety || '—'}
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-leaf-100 pt-4">
          <Link
            to={`/disease-library/${encodeURIComponent(item.classKey)}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-700 hover:text-leaf-900"
          >
            <BookOpenIcon size={14} />
            {t('gallery.modalTitle')} <ArrowRight size={12} />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/disease-detection"
              className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
            >
              <MicroscopeIcon size={14} />
              {t('gallery.testDetection')}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary rounded-xl px-4 py-2 text-xs font-semibold"
            >
              {t('gallery.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
