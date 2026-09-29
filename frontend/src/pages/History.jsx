import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getHistory, clearHistory } from '../utils/history'
import { isHealthyKey } from '../data/diseaseData'
import { SearchIcon, ArrowLeft, CameraIcon, ImageIcon, LockIcon } from '../components/icons'

function Trash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export default function History() {
  const { t } = useLanguage()
  const [entries, setEntries] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    import('../utils/history').then((mod) => {
      // Still fallback to local storage if needed, but we try API via getHistoryApi
      import('../services/api').then((api) => {
        api.getHistoryApi().then((historyFromApi) => {
          if (historyFromApi && historyFromApi.length > 0) {
            setEntries(historyFromApi)
          } else {
             // fallback to local storage
            setEntries(mod.getHistory())
          }
        }).catch(() => {
           setEntries(mod.getHistory())
        })
      })
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((h) => {
      if (filter === 'healthy' && !isHealthyKey(h.class || '')) return false
      if (filter === 'disease' && isHealthyKey(h.class || '')) return false
      if (q) {
        const hay = [h.plant, h.prediction, h.model, h.date].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [entries, search, filter])

  function handleClear() {
    clearHistory()
    setEntries([])
  }

  const filters = [
    { value: 'all', label: t('history.all') },
    { value: 'healthy', label: t('history.healthy') },
    { value: 'disease', label: t('history.disease') },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-700 transition-hover hover:text-leaf-900"
      >
        <ArrowLeft size={16} />
        {t('history.back')}
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-leaf-950 sm:text-4xl">{t('history.title')}</h1>
        <p className="mt-3 text-base text-leaf-950/88">{t('history.subtitle')}</p>
      </header>

      {entries.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-600" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('history.search')}
              className="w-full rounded-xl border border-leaf-200 bg-white py-3 pl-11 pr-4 text-sm text-leaf-950 outline-none transition-hover placeholder:text-leaf-950/82 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
            />
          </div>

          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-hover ${
                  filter === f.value
                    ? 'bg-leaf-600 text-white shadow-sm shadow-leaf-600/30'
                    : 'border border-leaf-200 bg-white text-leaf-800 hover:border-leaf-400'
                }`}
              >
                {f.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition-hover hover:border-red-400 hover:bg-red-50"
            >
              <Trash />
              {t('history.clear')}
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-leaf-300 bg-white px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-leaf-50 text-leaf-600">
            <ImageIcon size={26} />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-leaf-950">{t('history.emptyTitle')}</p>
          <p className="mt-1 max-w-sm text-sm text-leaf-950/78">{t('history.emptyText')}</p>
          <Link
            to="/disease-detection"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-leaf-600/30 transition-hover hover:bg-leaf-700"
          >
            <CameraIcon size={16} />
            {t('history.goDetect')}
          </Link>
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-leaf-950/82">
            <LockIcon size={13} />
            {t('dashboard.demoNote')}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-14 text-center text-sm text-leaf-950/85">{t('history.noResults')}</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-leaf-100 bg-white shadow-sm shadow-leaf-900/5 lg:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-leaf-100 bg-leaf-50/80">
                  {['image', 'date', 'plant', 'prediction', 'confidence', 'model'].map((k) => (
                    <th key={k} className="px-5 py-3.5 font-display text-xs font-semibold uppercase tracking-wider text-leaf-800">
                      {t(`history.columns.${k}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-leaf-50">
                {filtered.map((h, i) => {
                  const healthy = isHealthyKey(h.class || '')
                  return (
                    <tr 
                      key={i} 
                      className="cursor-pointer transition-hover hover:bg-leaf-50/40"
                      onClick={() => navigate(`/disease-library?search=${encodeURIComponent(h.prediction)}`)}
                    >
                      <td className="px-5 py-3.5">
                        {h.image ? (
                          <img src={h.image} alt="Analyzed leaf" className="h-12 w-12 rounded-lg object-cover ring-1 ring-leaf-100" />
                        ) : (
                          <span className="inline-block h-12 w-12 rounded-lg bg-leaf-50 text-leaf-600" />
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-leaf-950/82">{h.date}</td>
                      <td className="px-5 py-3.5 font-medium text-leaf-950">{h.plant}</td>
                      <td className="px-5 py-3.5">
                        <span className={healthy ? 'text-leaf-700' : 'text-amber-800'}>{h.prediction}</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-leaf-700">{h.confidence}%</td>
                      <td className="px-5 py-3.5 text-leaf-950/85">{h.model}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:hidden">
            {filtered.map((h, i) => {
              return (
                <div 
                  key={i} 
                  className="flex cursor-pointer items-center gap-4 rounded-2xl border border-leaf-100 bg-white p-4 shadow-sm shadow-leaf-900/5 transition-hover hover:border-leaf-300"
                  onClick={() => navigate(`/disease-library?search=${encodeURIComponent(h.prediction)}`)}
                >
                  {h.image ? (
                    <img src={h.image} alt="Analyzed leaf" className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-leaf-100" />
                  ) : (
                    <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
                      <ImageIcon size={22} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-leaf-950">{h.prediction}</p>
                    <p className="truncate text-xs text-leaf-950/85">{h.plant}</p>
                    <p className="mt-1 text-xs">
                      <span className="font-semibold text-leaf-700">{h.confidence}%</span>
                      <span className="text-leaf-950/82"> · {h.model} · {h.date}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}