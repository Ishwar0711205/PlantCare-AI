import { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { healthyPlants } from '../data/plants'
import HealthyPlantCard from '../components/HealthyPlantCard'
import Lightbox from '../components/Lightbox'
import { SearchIcon } from '../components/icons'

export default function HealthyPlants() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return healthyPlants
    return healthyPlants.filter(
      (p) =>
        p.names.en.toLowerCase().includes(q) ||
        p.names.hi.toLowerCase().includes(q) ||
        p.names.mr.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q),
    )
  }, [search])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-leaf-950 sm:text-4xl">
          {t('healthy.title')}
        </h1>
        <p className="mt-3 text-base text-leaf-950/88">{t('healthy.subtitle')}</p>
      </header>

      <div className="relative mt-8 max-w-md">
        <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-600" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('healthy.search')}
          className="w-full rounded-xl border border-leaf-200 bg-white py-3 pl-11 pr-4 text-sm text-leaf-950 outline-none transition-hover placeholder:text-leaf-950/82 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-sm text-leaf-950/85">{t('library.notFound')}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plant) => (
            <HealthyPlantCard key={plant.key} plant={plant} onOpen={setSelected} />
          ))}
        </div>
      )}

      <p className="mt-10 text-sm text-leaf-950/85">{t('healthy.note')}</p>

      <Lightbox
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        image={selected?.image}
        title={selected?.names[lang] || selected?.names.en}
        subtitle={selected?.names.en}
        badge={t('healthy.healthyLabel')}
      />
    </div>
  )
}