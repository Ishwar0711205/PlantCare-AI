import { useLanguage } from '../context/LanguageContext'
import { TECH_CONFIG, MODEL_ORDER, MODEL_INPUT } from '../data/projectData'
import Reveal from './Reveal'
import {
  CodeIcon,
  LayersIcon,
  CloudIcon,
  ActivityIcon,
  ChartIcon,
  GridIcon,
  RefreshIcon,
  SettingsIcon,
  DatabaseIcon,
  CpuIcon,
} from './icons'

const ICONS = {
  code: CodeIcon,
  layers: LayersIcon,
  cloud: CloudIcon,
  activity: ActivityIcon,
  chart: ChartIcon,
  grid: GridIcon,
  refresh: RefreshIcon,
  sliders: SettingsIcon,
  database: DatabaseIcon,
}

/**
 * Shared training configuration, taken from the training logs and the
 * `model_metadata.json` files in `models/`. Input sizes are listed separately
 * because the backend resizes per model — the custom CNN is 128 × 128, the
 * transfer-learning models are 224 × 224.
 */
export default function TechConfig() {
  const { t } = useLanguage()

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="eyebrow">
            <SettingsIcon size={13} />
            {t('research.tech.title')}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {TECH_CONFIG.map((item, i) => {
            const Icon = ICONS[item.icon] || SettingsIcon
            return (
              <Reveal key={item.key} delay={i * 50}>
                <div className="group flex items-center gap-3.5 rounded-xl border border-leaf-100 bg-white px-4 py-3.5 shadow-sm shadow-leaf-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-md">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-leaf-50 text-leaf-600 transition-colors group-hover:bg-leaf-100">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-leaf-950/82">
                      {t(`research.tech.keys.${item.key}`)}
                    </span>
                    <span className="block truncate font-display text-sm font-bold text-leaf-950">
                      {item.value}
                    </span>
                  </span>
                </div>
              </Reveal>
            )
          })}
        </div>

        <p className="mt-4 text-xs text-leaf-950/72">{t('research.tech.subtitle')}</p>
      </div>

      <div className="lg:col-span-2">
        <div className="relative h-full overflow-hidden rounded-2xl border border-leaf-100 bg-gradient-to-br from-leaf-50 to-white p-5 shadow-sm shadow-leaf-900/5">
          <span aria-hidden="true" className="net-dots-faint pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-leaf-950">
              <CpuIcon size={17} className="text-leaf-600" />
              {t('research.tech.inputsTitle')}
            </h3>

            <ul className="mt-4 space-y-2">
              {MODEL_ORDER.map((id, i) => (
                <li
                  key={id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/80 bg-white/80 px-3.5 py-2.5 transition-transform duration-300 hover:translate-x-1"
                  style={{ animation: 'fadeInRight 0.5s ease-out both', animationDelay: `${i * 70}ms` }}
                >
                  <span className="truncate font-display text-sm font-semibold text-leaf-950">{id}</span>
                  <span className="shrink-0 rounded-md bg-leaf-100/80 px-2 py-0.5 text-xs font-bold tnum text-leaf-700">
                    {MODEL_INPUT[id]}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-leaf-200/50 pt-3 text-xs leading-relaxed text-leaf-950/85">
              {t('research.tech.inputsNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
