import { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useData } from '../data/diseaseData'
import { healthyPlants } from '../data/plants'
import DiseaseCard from '../components/DiseaseCard'
import { SearchIcon } from '../components/icons'

export default function DiseaseLibrary() {
  const { t, lang } = useLanguage()
  const { data, loading } = useData()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [plant, setPlant] = useState('all')

  const info = data?.info || {}
  const classes = data?.classes || []

  const entries = useMemo(() => {
    const q = search.trim().toLowerCase()
    return classes
      .map((k) => {
        const d = info[k] || {}
        const isHealthy = k.split('___')[1] === 'healthy'
        return { key: k, d, isHealthy }
      })
      .filter((item) => {
        if (status === 'healthy' && !item.isHealthy) return false
        if (status === 'diseases' && item.isHealthy) return false
        if (plant !== 'all' && item.d.plant !== plant) return false
        if (q) {
          const hay = [
            item.key,
            item.d.plant,
            item.d.name?.en,
            item.d.name?.hi,
            item.d.name?.mr,
            item.d.symptoms?.en,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes, info, search, status, plant])

  const filters = [
    { value: 'all', label: t('library.all') },
    { value: 'healthy', label: t('library.healthy') },
    { value: 'diseases', label: t('library.diseases') },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-leaf-950 sm:text-4xl">
          {t('library.title')}
        </h1>
        <p className="mt-3 text-base text-leaf-950/88">{t('library.subtitle')}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-600" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('library.search')}
            className="w-full rounded-xl border border-leaf-200 bg-white py-3 pl-11 pr-4 text-sm text-leaf-950 outline-none transition-hover placeholder:text-leaf-950/82 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
          />
        </div>

        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-hover ${
                status === f.value ? 'bg-leaf-600 text-white shadow-sm shadow-leaf-600/30' : 'border border-leaf-200 bg-white text-leaf-800 hover:border-leaf-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={plant}
          onChange={(e) => setPlant(e.target.value)}
          className="rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm font-medium text-leaf-950 outline-none transition-hover focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
        >
          <option value="all">{t('library.allPlants')}</option>
          {healthyPlants.map((p) => (
            <option key={p.key} value={p.key}>
              {p.names[lang] || p.names.en}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="mt-14 flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-leaf-200 border-t-leaf-600" />
          <p className="text-sm text-leaf-950/85">Loading…</p>
        </div>
      ) : entries.length === 0 ? (
        <p className="mt-14 text-center text-sm text-leaf-950/85">{t('library.notFound')}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {entries.map((item) => (
            <DiseaseCard key={item.key} classKey={item.key} info={item.d} />
          ))}
        </div>
      )}
    </div>
  )
}