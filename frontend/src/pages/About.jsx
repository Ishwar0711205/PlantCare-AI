import { useLanguage } from '../context/LanguageContext'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import {
  LeafIcon,
  AlertIcon,
  CheckCircleIcon,
  CpuIcon,
  MicroscopeIcon,
  BookOpenIcon,
  ShieldIcon,
  UploadIcon,
  GraduationIcon,
  FlaskIcon,
  UsersIcon,
  ChartIcon,
  GlobeIcon,
  ArrowRight,
} from '../components/icons'

const workflowIcons = {
  user: UsersIcon,
  upload: UploadIcon,
  preprocess: CpuIcon,
  model: MicroscopeIcon,
  prediction: ChartIcon,
  info: BookOpenIcon,
  guidance: GlobeIcon,
}

function DatabaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  )
}

export default function About() {
  const { t } = useLanguage()
  const S = t('about.sections')
  const W = t('about.workflow')
  const rows = [
    { label: t('about.datasetRows.total.label'), value: t('about.datasetRows.total.value') },
    { label: t('about.datasetRows.train.label'), value: t('about.datasetRows.train.value') },
    { label: t('about.datasetRows.val.label'), value: t('about.datasetRows.val.value') },
    { label: t('about.datasetRows.classes.label'), value: t('about.datasetRows.classes.value') },
  ]

  const sections = [
    { icon: <LeafIcon size={20} />, ...S.about },
    { icon: <AlertIcon size={20} />, ...S.problem },
    { icon: <CheckCircleIcon size={20} />, ...S.objective },
    { icon: <DatabaseIcon />, ...S.dataset },
    { icon: <CpuIcon size={20} />, ...S.approach },
    { icon: <MicroscopeIcon size={20} />, ...S.models },
    { icon: <BookOpenIcon size={20} />, ...S.plants },
    { icon: <GlobeIcon size={20} />, ...S.deployment },
    { icon: <UsersIcon size={20} />, ...S.audience },
    { icon: <ShieldIcon size={20} />, ...S.disclaimer },
  ]

  const workflows = [
    { key: 'user' },
    { key: 'upload' },
    { key: 'preprocess' },
    { key: 'model' },
    { key: 'prediction' },
    { key: 'info' },
    { key: 'guidance' },
  ]

  const audiences = [
    { icon: <UploadIcon size={22} />, ...t('about.audiences.farmers') },
    { icon: <GraduationIcon size={22} />, ...t('about.audiences.students') },
    { icon: <FlaskIcon size={22} />, ...t('about.audiences.researchers') },
    { icon: <BookOpenIcon size={22} />, ...t('about.audiences.educators') },
    { icon: <LeafIcon size={22} />, ...t('about.audiences.gardeners') },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading eyebrow="Project" title={t('about.title')} />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s, i) => (
          <Reveal
            key={s.heading}
            delay={i * 50}
            className={`rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-0.5 hover:border-leaf-200 hover:shadow-md ${
              s.heading === S.disclaimer.heading ? 'sm:col-span-2 lg:col-span-3' : ''
            }`}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-50 text-leaf-600">{s.icon}</div>
            <h2 className="mt-4 font-display text-lg font-semibold text-leaf-950">{s.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-leaf-950/88">{s.text}</p>
          </Reveal>
        ))}
      </div>

      {/* System workflow */}
      <Reveal className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-leaf-950">{t('about.systemTitle')}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {workflows.map((w, i) => {
            const Icon = workflowIcons[w.key]
            const step = W[w.key] || {}
            return (
              <div key={w.key} className="relative rounded-2xl border border-leaf-100 bg-white p-4 shadow-sm shadow-leaf-900/5 transition-hover hover:border-leaf-300">
                <span className="font-display text-xs font-bold text-leaf-700">{String(i + 1).padStart(2, '0')}</span>
                <div className="mt-2 grid h-9 w-9 place-items-center rounded-lg bg-leaf-50 text-leaf-600">
                  <Icon size={17} />
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-leaf-950">{step.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-leaf-950/85">{step.text}</p>
                {i < workflows.length - 1 && (
                  <ArrowRight size={15} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-leaf-500 lg:block" />
                )}
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Dataset stats */}
      <Reveal className="mt-12 rounded-[2rem] bg-leaf-900 p-8 text-white sm:p-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{t('about.datasetTitle')}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r) => (
            <div key={r.label} className="rounded-2xl bg-white/10 p-5">
              <p className="font-display text-3xl font-bold text-leaf-100">{r.value}</p>
              <p className="mt-1 text-sm text-leaf-100/75">{r.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Audiences */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-leaf-950">{t('about.audiencesTitle')}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 60} className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-50 text-leaf-600">{a.icon}</div>
              <h3 className="mt-4 font-display text-base font-semibold text-leaf-950">{a.title}</h3>
              <p className="mt-1.5 text-sm text-leaf-950/78">{a.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}