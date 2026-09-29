import { useLanguage } from '../context/LanguageContext'
import { METHOD_STEPS } from '../data/projectData'
import Reveal from './Reveal'
import {
  DatabaseIcon,
  GridIcon,
  ChartIcon,
  SettingsIcon,
  RefreshIcon,
  CpuIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ArrowRight,
  LayersIcon,
} from './icons'

const STEP_ICON = {
  dataset: DatabaseIcon,
  organize: GridIcon,
  split: ChartIcon,
  preprocess: SettingsIcon,
  augment: RefreshIcon,
  models: CpuIcon,
  classify: LayersIcon,
  evaluate: CheckCircleIcon,
  interface: BookOpenIcon,
}

/**
 * Research pipeline, in execution order. Steps reveal on scroll and the
 * connector arrows animate continuously (both are disabled under
 * `prefers-reduced-motion`).
 */
export default function MethodologyFlow() {
  const { t } = useLanguage()

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="eyebrow">
          <CpuIcon size={13} />
          {t('research.method.title')}
        </span>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {METHOD_STEPS.map((key, i) => {
          const Icon = STEP_ICON[key] || CpuIcon
          const step = t(`research.method.steps.${key}`)
          const label = typeof step === 'object' ? step.label : key
          const text = typeof step === 'object' ? step.text : ''
          return (
            <Reveal key={key} delay={i * 70} as="li" className="relative list-none">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-leaf-100 bg-white p-5 shadow-sm shadow-leaf-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lg hover:shadow-leaf-900/10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-leaf-50 transition-transform duration-500 group-hover:scale-125"
                />
                <div className="relative flex items-center gap-3">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-leaf-50 text-leaf-600 transition-colors group-hover:bg-leaf-100">
                    <Icon size={19} />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl ring-1 ring-leaf-200/70"
                      style={{ animation: 'nodePing 3.2s ease-out infinite' }}
                    />
                  </span>
                  <span className="font-display text-xs font-bold tnum text-leaf-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="relative mt-3.5 font-display text-[15px] font-bold leading-snug text-leaf-950">
                  {label}
                </h3>
                {text && (
                  <p className="relative mt-1.5 text-[13px] leading-relaxed text-leaf-950/78">{text}</p>
                )}

                {/* Connector to the next step */}
                {i < METHOD_STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-3 right-4 hidden text-leaf-500 lg:block"
                  >
                    <span className="arrow-flow block">
                      <ArrowRight size={16} className="-rotate-90" />
                    </span>
                  </span>
                )}
              </div>
            </Reveal>
          )
        })}
      </ol>
    </div>
  )
}
