import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { PROJECT, DATASET, formatImages } from '../data/projectData'
import { LeafIcon, DatabaseIcon, ShieldIcon, ArrowRight } from './icons'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="dark-section relative mt-20 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-leaf-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* ── Project ───────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-600 text-leaf-950">
                <LeafIcon size={19} />
              </span>
              <div className="leading-tight">
                <p className="font-display text-base font-bold text-white">{PROJECT.shortTitle}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-leaf-300/70">
                  {t('nav.models')}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm font-semibold leading-relaxed text-white/85">
              {t('footer.project')}
            </p>

            <dl className="mt-5 space-y-2 text-sm text-leaf-100/82">
              <div className="flex gap-2">
                <dt className="font-semibold text-leaf-300/80">{t('footer.department')}:</dt>
                <dd>{PROJECT.department}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-leaf-300/80">{t('footer.institute')}:</dt>
                <dd>{PROJECT.institute}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-leaf-300/80">{t('footer.year')}:</dt>
                <dd>{PROJECT.academicYear}</dd>
              </div>
            </dl>

            <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-leaf-200">
              <DatabaseIcon size={13} />
              {DATASET.name} · {DATASET.classes} · {formatImages(DATASET.totalImages)}
            </p>
          </div>

          {/* ── Navigation ────────────────────────────────── */}
          <nav aria-label="Footer">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-300/80">
              {t('nav.menu')}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/disease-detection', label: t('nav.detect') },
                { to: '/disease-library', label: t('nav.library') },
                { to: '/models', label: t('nav.models') },
                { to: '/about', label: t('nav.about') },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-1.5 text-sm text-leaf-100/85 transition-colors hover:text-white"
                  >
                    <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Team ──────────────────────────────────────── */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-300/80">
              {t('footer.teamTitle')}
            </h2>
            <ul className="mt-4 space-y-1.5">
              {PROJECT.team.map((name) => (
                <li key={name} className="text-sm text-leaf-100/75">
                  {name}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-300/80">
              {t('footer.guideTitle')}
            </h2>
            <p className="mt-2 text-sm font-semibold text-white">{PROJECT.guide}</p>
          </div>
        </div>

        {/* ── Disclaimer ──────────────────────────────────── */}
        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-300/5 p-4">
          <ShieldIcon size={18} className="mt-0.5 shrink-0 text-amber-300" />
          <p className="text-xs leading-relaxed text-leaf-100/85">{t('footer.disclaimer')}</p>
        </div>

        <div className="divider-soft my-8" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-leaf-100/75">
            © {year} {PROJECT.institute}. {PROJECT.department}.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-leaf-100/75">
            {DATASET.name} dataset · {t('models.chips.validation')}: {formatImages(DATASET.valImages)}
          </p>
        </div>
      </div>
    </footer>
  )
}
