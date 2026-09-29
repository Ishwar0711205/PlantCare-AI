import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useData } from '../data/diseaseData'
import Reveal from './Reveal'
import AccuracyChartMini from './AccuracyChart'
import { ArrowRight, LeafIcon, DatabaseIcon, CpuIcon, GridIcon } from './icons'

/**
 * Home hero.
 *
 * The visual is a real PlantVillage reference photograph from the project's
 * own dataset plus the verified accuracy chart — there is no invented
 * prediction card anywhere on this page.
 */
export default function Hero() {
  const { t } = useLanguage()
  const { data } = useData()

  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Copy ──────────────────────────────────────── */}
          <div>
            <Reveal>
              <span className="eyebrow">
                <LeafIcon size={13} />
                {t('home.hero.badge')}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-[34px] font-bold leading-[1.08] tracking-tight text-leaf-950 sm:text-5xl lg:text-[56px]">
                {t('home.hero.title1')}
                <span className="mt-1 block gradient-text">{t('home.hero.title2')}</span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-leaf-950/88 sm:text-lg">
                {t('home.hero.subtitle')}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-leaf-950/85">{t('home.hero.text')}</p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/disease-detection"
                  className="btn-primary inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-white"
                >
                  <LeafIcon size={17} />
                  {t('home.hero.cta')}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/models"
                  className="btn-secondary inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold"
                >
                  {t('home.hero.ctaSecondary')}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <ul className="mt-9 flex flex-wrap gap-2.5">
                <HeroChip icon={<DatabaseIcon size={13} />} label={t('home.hero.chips.dataset')} />
                <HeroChip icon={<CpuIcon size={13} />} label={t('home.hero.chips.models')} />
                <HeroChip icon={<GridIcon size={13} />} label={t('home.hero.chips.classes')} />
              </ul>
            </Reveal>
          </div>

          {/* ── Visual ────────────────────────────────────── */}
          <Reveal delay={180}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-leaf-200/40 via-leaf-100/30 to-transparent blur-2xl"
              />

              <figure className="card overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src="/healthy_images/Apple_healthy.png"
                    alt={t('home.hero.visualTitle')}
                    loading="eager"
                    width={640}
                    height={480}
                    className="h-64 w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-105 sm:h-80"
                    onError={(e) => {
                      e.currentTarget.src = '/healthy_images/Tomato_healthy.png'
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-leaf-950/85 via-leaf-950/35 to-transparent"
                  />
                  <figcaption className="absolute inset-x-4 bottom-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leaf-200">
                      {t('home.hero.visualCaption')}
                    </p>
                    <p className="mt-0.5 font-display text-base font-bold text-white">
                      {t('home.hero.visualTitle')}
                    </p>
                  </figcaption>
                </div>

                {/* Verified accuracy, straight from model_results.json */}
                <div className="border-t border-leaf-100 bg-white px-5 py-5">
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-leaf-600">
                    {t('models.chartTitle')}
                  </p>
                  <AccuracyChartMini results={data?.results} />
                </div>

                <p className="border-t border-leaf-50 bg-leaf-50/50 px-5 py-3 text-[11px] leading-relaxed text-leaf-950/72">
                  {t('home.hero.visualNote')}
                </p>
              </figure>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function HeroChip({ icon, label }) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-leaf-800 shadow-sm backdrop-blur">
      {icon}
      {label}
    </li>
  )
}
