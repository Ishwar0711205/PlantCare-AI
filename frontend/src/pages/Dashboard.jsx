import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { getHistory } from '../utils/history'
import {
  CameraIcon,
  BookOpenIcon,
  SproutIcon,
  ArrowRight,
  ImageIcon,
  MicroscopeIcon,
} from '../components/icons'

export default function Dashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const latest = history[0] || null

  useEffect(() => {
    import('../utils/history').then((mod) => {
      import('../services/api').then((api) => {
        api.getHistoryApi().then((historyFromApi) => {
          if (historyFromApi && historyFromApi.length > 0) {
            setHistory(historyFromApi)
          } else {
            setHistory(mod.getHistory())
          }
        }).catch(() => {
           setHistory(mod.getHistory())
        })
      })
    })
  }, [])

  const actions = [
    { to: '/disease-detection', title: t('dashboard.detect'), icon: <CameraIcon size={22} /> },
    { to: '/healthy-plants', title: t('dashboard.healthy'), icon: <SproutIcon size={22} /> },
    { to: '/disease-library', title: t('dashboard.library'), icon: <BookOpenIcon size={22} /> },
  ]

  const firstName = (user?.name || 'there').split(' ')[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-[2rem] bg-leaf-900 p-8 text-white sm:p-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('auth.welcomeMsg', { name: firstName })}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-leaf-100/75">{t('dashboard.subtitle')}</p>

        {/* Summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-leaf-100/80">
              <MicroscopeIcon size={15} />
              {t('dashboard.summary.total')}
            </p>
            <p className="mt-2 font-display text-3xl font-bold">{history.length}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-leaf-100/80">
              <CameraIcon size={15} />
              {t('dashboard.summary.latest')}
            </p>
            {latest ? (
              <div className="mt-2">
                <p className="font-display text-base font-semibold leading-snug">{latest.prediction}</p>
                <p className="mt-0.5 text-xs text-leaf-100/82">{latest.plant} · {latest.confidence}% · {latest.date}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-leaf-100/78">{t('dashboard.summary.noLatest')}</p>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {actions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group rounded-2xl bg-white/10 p-5 transition-hover hover:bg-white/15"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-leaf-100 transition-hover group-hover:bg-white/25">
                {a.icon}
              </div>
              <h3 className="mt-3 font-display text-base font-semibold">{a.title}</h3>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-leaf-100/85">
                {t('common.getStarted')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-leaf-950/72">{t('dashboard.demoNote')}</p>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight text-leaf-950">
            {t('dashboard.historyTitle')}
          </h2>
          {history.length > 0 && (
            <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-600 transition-hover hover:text-leaf-800">
              {t('dashboard.viewHistory')} <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {history.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-leaf-300 bg-white px-6 py-14 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-leaf-50 text-leaf-600">
              <ImageIcon size={26} />
            </div>
            <p className="mt-4 max-w-sm text-sm text-leaf-950/78">{t('dashboard.noHistory')}</p>
            <Link
              to="/disease-detection"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-leaf-600/30 transition-hover hover:bg-leaf-700"
            >
              <CameraIcon size={16} />
              {t('dashboard.detect')}
            </Link>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-leaf-100 bg-white shadow-sm shadow-leaf-900/5">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-leaf-100 bg-leaf-50/80">
                  {['image', 'date', 'plant', 'prediction', 'confidence', 'model'].map((k) => (
                    <th key={k} className="px-5 py-3.5 font-display text-xs font-semibold uppercase tracking-wider text-leaf-800">
                      {t(`dashboard.columns.${k}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-leaf-50">
                {history.slice(0, 5).map((h, i) => (
                  <tr key={i} className="transition-hover hover:bg-leaf-50/40">
                    <td className="px-5 py-3.5">
                      {h.image ? (
                        <img src={h.image} alt="Analyzed leaf" className="h-10 w-10 rounded-lg object-cover ring-1 ring-leaf-100" />
                      ) : (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-leaf-50 text-leaf-600">
                          <ImageIcon size={16} />
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-leaf-950/82">{h.date}</td>
                    <td className="px-5 py-3.5 font-medium text-leaf-950">{h.plant}</td>
                    <td className="px-5 py-3.5 text-leaf-950/85">{h.prediction}</td>
                    <td className="px-5 py-3.5 font-semibold text-leaf-700">{h.confidence}%</td>
                    <td className="px-5 py-3.5 text-leaf-950/85">{h.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}