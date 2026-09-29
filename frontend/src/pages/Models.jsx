import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useData } from '../data/diseaseData'
import { MODEL_ORDER, MODEL_META, pct } from '../data/projectData'
import useRadioGroup from '../hooks/useRadioGroup'
import AccuracyChart from '../components/AccuracyChart'
import ModelCard from '../components/ModelCard'
import MetricsTable from '../components/MetricsTable'
import MethodologyFlow from '../components/MethodologyFlow'
import TechConfig from '../components/TechConfig'
import Reveal from '../components/Reveal'
import { CpuIcon, ChartIcon, InfoIcon, ArrowRight } from '../components/icons'

export default function Models() {
  const { t } = useLanguage()
  const { data } = useData()
  const results = data?.results
  const [selected, setSelected] = useState('EfficientNetB0')

  const rows = useMemo(
    () =>
      MODEL_ORDER.map((id) => ({
        id,
        result: results?.[id] || null,
        available: Boolean(results?.[id]?.status === 'Available' || results?.[id]?.validation_accuracy !== null),
      })),
    [results],
  )

  const availableCount = rows.filter((r) => r.available).length

  const { setNode, tabIndexFor, onKeyDown } = useRadioGroup(
    rows.map((r) => r.id),
    selected,
    setSelected,
    (id) => !rows.find((r) => r.id === id)?.available,
  )

  /* Architecture write-up for the picked model. Every number comes from
     model_results.json via pct(); the prose is MODEL_META.detail, which is part
     of the project's own verified notes. */
  const detail = useMemo(() => {
    const row = rows.find((r) => r.id === selected)
    const meta = MODEL_META[selected]
    if (!row || !meta) return null
    const r = row.result || {}
    const nr = t('research.metrics.nr')
    return {
      id: selected,
      name: r.display_name || selected,
      accent: meta.accent || '#0d7d4e',
      archLabel: meta.type === 'custom' ? t('models.archCustom') : t('models.archTransfer'),
      text: meta.detail,
      facts: [
        { label: t('models.inputLabel'), value: r.input_size ? r.input_size.replace('x', ' × ') : meta.input },
        { label: t('models.trainingLabel'), value: pct(r.training_accuracy, nr) },
        { label: t('models.accuracyLabel'), value: pct(r.validation_accuracy, nr) },
        { label: t('research.metrics.cols.f1'), value: pct(r.macro_f1, nr) },
      ],
    }
  }, [rows, selected, t])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">
          <CpuIcon size={13} />
          {t('models.title')}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-leaf-950 sm:text-4xl">
          {t('research.method.title')}
        </h1>
        <p className="mt-3 text-base text-leaf-950/78">{t('research.method.subtitle')}</p>
      </header>

      {/* ── Summary strip ──────────────────────────────────── */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatTile value={MODEL_ORDER.length} label={t('models.chips.models')} icon={<CpuIcon size={16} />} />
        <StatTile
          value={
            results?.EfficientNetB0?.validation_accuracy != null
              ? `${results.EfficientNetB0.validation_accuracy.toFixed(2)}%`
              : '—'
          }
          label={t('models.cols.acc')}
          icon={<ChartIcon size={16} />}
        />
        <StatTile value="32,598" label={t('models.chips.validation')} icon={<InfoIcon size={16} />} />
      </div>

      {/* ── Comparison chart ───────────────────────────────── */}
      <Reveal>
        <section className="mt-12">
          <AccuracyChart results={results} />
        </section>
      </Reveal>

      {/* ── Model cards ────────────────────────────────────── */}
      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-leaf-950">
              {t('models.cardsTitle')}
            </h2>
            <p className="mt-1.5 text-sm text-leaf-950/85">{t('models.cardsSubtitle')}</p>
          </div>
        </div>

        <div
          className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          role="radiogroup"
          aria-label={t('models.cardsTitle')}
        >
          {rows.map((r, i) => (
            <Reveal key={r.id} delay={i * 70} className="h-full">
              <ModelCard
                id={r.id}
                result={r.result}
                selected={selected === r.id}
                onSelect={setSelected}
                disabled={!r.available}
                tabIndex={tabIndexFor(r.id)}
                onKeyDown={(e) => onKeyDown(e, r.id)}
                cardRef={(el) => setNode(r.id, el)}
              />
            </Reveal>
          ))}
        </div>

        {/* Detail of the picked model — re-animates on every selection change. */}
        {detail && (
          <div
            key={detail.id}
            className="card mt-6 overflow-hidden p-5 sm:p-7"
            style={{ animation: 'fadeUp 0.45s ease-out both' }}
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white"
                style={{ background: detail.accent }}
              >
                <CpuIcon size={17} />
              </span>
              <h3 className="font-display text-lg font-bold text-leaf-950">{detail.name}</h3>
              <span className="chip">{t('models.cols.arch')}: {detail.archLabel}</span>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-leaf-950/85">{detail.text}</p>

            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {detail.facts.map((f) => (
                <div key={f.label} className="rounded-xl border border-leaf-100 bg-leaf-50/60 px-3.5 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-leaf-950/85">
                    {f.label}
                  </dt>
                  <dd className="tnum mt-1 font-display text-base font-bold text-leaf-900">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-leaf-950/72">
          <InfoIcon size={14} className="mt-0.5 shrink-0" />
          {t('models.note')}
        </p>
      </section>

      {/* ── Metrics table ──────────────────────────────────── */}
      <Reveal>
        <section className="mt-14">
          <MetricsTable results={results} />
        </section>
      </Reveal>

      {/* ── Methodology ────────────────────────────────────── */}
      <Reveal>
        <section className="mt-14">
          <MethodologyFlow />
        </section>
      </Reveal>

      {/* ── Technical configuration ────────────────────────── */}
      <Reveal>
        <section className="mt-14">
          <TechConfig />
        </section>
      </Reveal>

      {/* ── CTA ────────────────────────────────────────────── */}
      <Reveal>
        <section className="dark-section mt-14 overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {availableCount} {t('models.chips.models').toLowerCase()}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-leaf-100/85">{t('home.ctaText')}</p>
            <Link
              to="/disease-detection"
              className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
            >
              {t('home.ctaBtn')}
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  )
}

function StatTile({ value, label, icon }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf-50 text-leaf-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="tnum font-display text-xl font-bold text-leaf-950">{value}</p>
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-leaf-950/82">{label}</p>
      </div>
    </div>
  )
}
