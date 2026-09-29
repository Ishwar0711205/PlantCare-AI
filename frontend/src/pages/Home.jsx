import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useData } from '../data/diseaseData'
import { DATASET, formatImages } from '../data/projectData'
import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import StatCard from '../components/StatCard'
import Counter from '../components/Counter'
import Reveal from '../components/Reveal'
import AccuracyChart from '../components/AccuracyChart'
import { healthyPlants } from '../data/plants'
import {
  UploadIcon,
  MicroscopeIcon,
  BookOpenIcon,
  CameraIcon,
  GraduationIcon,
  FlaskIcon,
  UsersIcon,
  ArrowRight,
  CpuIcon,
  SproutIcon,
  LeafIcon,
  CheckCircleIcon,
  GlobeIcon,
  DatabaseIcon,
} from '../components/icons'

export default function Home() {
  const { t, lang } = useLanguage()
  const { data } = useData()

  const stats = [
    { value: t('home.stats.classes.value'), label: t('home.stats.classes.label'), icon: <CheckCircleIcon size={20} /> },
    { value: t('home.stats.total.value'), label: t('home.stats.total.label'), icon: <CameraIcon size={20} /> },
    { value: t('home.stats.train.value'), label: t('home.stats.train.label'), icon: <FlaskIcon size={20} /> },
    { value: t('home.stats.val.value'), label: t('home.stats.val.label'), icon: <MicroscopeIcon size={20} /> },
  ]

  const whyItems = [
    { icon: <CheckCircleIcon size={22} />, key: 'home.why.multi' },
    { icon: <MicroscopeIcon size={22} />, key: 'home.why.models' },
    { icon: <GlobeIcon size={22} />, key: 'home.why.multilingual' },
    { icon: <BookOpenIcon size={22} />, key: 'home.why.guidance' },
    { icon: <LeafIcon size={22} />, key: 'home.why.healthy' },
    { icon: <CameraIcon size={22} />, key: 'home.why.easy' },
  ]

  const steps = [
    { icon: <UploadIcon size={22} />, num: '01', key: 'home.steps.upload' },
    { icon: <CpuIcon size={22} />, num: '02', key: 'home.steps.choose' },
    { icon: <MicroscopeIcon size={22} />, num: '03', key: 'home.steps.analyze' },
    { icon: <BookOpenIcon size={22} />, num: '04', key: 'home.steps.guidance' },
  ]

  const features = [
    { icon: <CameraIcon size={24} />, accent: 'leaf', title: t('home.ai.title'), text: t('home.ai.text') },
    { icon: <BookOpenIcon size={24} />, accent: 'leaf', title: t('home.healthy.title'), text: t('home.healthy.text') },
    { icon: <FlaskIcon size={24} />, accent: 'amber', title: t('home.library.title'), text: t('home.library.text') },
    { icon: <UsersIcon size={24} />, accent: 'blue', title: t('home.multi.title'), text: t('home.multi.text') },
  ]

  const audiences = [
    { icon: <SproutIcon size={22} />, title: t('home.who.farmers.title'), text: t('home.who.farmers.text') },
    { icon: <GraduationIcon size={22} />, title: t('home.who.students.title'), text: t('home.who.students.text') },
    { icon: <FlaskIcon size={22} />, title: t('home.who.researchers.title'), text: t('home.who.researchers.text') },
    { icon: <UsersIcon size={22} />, title: t('home.who.enthusiasts.title'), text: t('home.who.enthusiasts.text') },
  ]

  return (
    <>
      <Hero />

      {/* Verified Stats */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <StatCard icon={s.icon} label={s.label} value={<Counter value={s.value} duration={1400 + i * 200} />} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Supported Plants */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('home.plantsTitle')} title={t('home.plantsTitle')} subtitle={t('home.plantsSubtitle')} />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {healthyPlants.map((plant, i) => (
            <Reveal key={plant.key} delay={i * 50} className="group rounded-2xl border border-leaf-100 bg-white p-4 text-center shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md">
              <img src={plant.image} alt={plant.names[lang] || plant.names.en} className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-leaf-100 transition-hover group-hover:ring-leaf-300" />
              <p className="mt-3 text-sm font-semibold text-leaf-900">{plant.names[lang] || plant.names.en}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why PlantCare AI */}
      <section className="bg-leaf-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t('home.whyTitle')} subtitle={t('home.whySubtitle')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item, i) => (
              <Reveal key={item.key} delay={i * 70} className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-50 text-leaf-600">{item.icon}</div>
                <h3 className="mt-4 font-display text-lg font-semibold text-leaf-950">{t(`${item.key}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-leaf-950/78">{t(`${item.key}.text`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading title={t('home.howTitle')} subtitle={t('home.howSubtitle')} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 80} className="relative rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md">
              <span className="font-display text-sm font-bold text-leaf-700">{step.num}</span>
              <div className="mt-3 grid h-11 w-11 place-items-center rounded-xl bg-leaf-50 text-leaf-600">{step.icon}</div>
              <h3 className="mt-4 font-display text-lg font-semibold text-leaf-950">{t(`${step.key}.title`)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-leaf-950/78">{t(`${step.key}.text`)}</p>
              {i < steps.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-leaf-500 lg:block">
                  <ArrowRight size={18} />
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Verified research results */}
      <section className="bg-leaf-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={t('models.comparisonTitle')} subtitle={t('models.comparisonSubtitle')} />
            <Link
              to="/models"
              className="btn-secondary mb-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              {t('home.hero.ctaSecondary')}
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <AccuracyChart results={data?.results} />
            </Reveal>

            <Reveal delay={90} className="lg:col-span-2">
              <div className="card h-full p-6">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-leaf-950">
                  <DatabaseIcon size={17} className="text-leaf-600" />
                  {t('about.datasetTitle')}
                </h3>
                <dl className="mt-4 space-y-3">
                  {[
                    ['total', DATASET.totalImages],
                    ['train', DATASET.trainImages],
                    ['val', DATASET.valImages],
                    ['classes', DATASET.classes],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3 border-b border-leaf-50 pb-2.5 last:border-0">
                      <dt className="text-sm text-leaf-950/78">{t(`about.datasetRows.${k}.label`)}</dt>
                      <dd className="tnum font-display text-sm font-bold text-leaf-950">{formatImages(v)}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-leaf-950/72">{t('research.metrics.note')}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-leaf-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t('home.featuresTitle')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="group h-full rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl transition-hover ${
                    f.accent === 'leaf'
                      ? 'bg-leaf-50 text-leaf-600 group-hover:bg-leaf-100'
                      : 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
                  }`}>
                    {f.icon}
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-leaf-950">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-leaf-950/78">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-[2rem] bg-leaf-900 p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">{t('home.whoTitle')}</h2>
            <p className="mt-3 text-leaf-100/80">{t('home.whoSubtitle')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((a, i) => (
              <Reveal key={a.title} delay={i * 80} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm transition-hover hover:bg-white/15">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-leaf-100">{a.icon}</div>
                <h3 className="mt-3 font-display text-base font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-leaf-100/75">{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-leaf-200 bg-white p-10 text-center shadow-sm shadow-leaf-900/5 sm:p-12 lg:flex-row lg:text-left">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-leaf-950 sm:text-3xl">{t('home.ctaTitle')}</h2>
              <p className="mt-2 text-leaf-950/78">{t('home.ctaText')}</p>
            </div>
            <Link
              to="/disease-detection"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-leaf-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-leaf-600/30 transition-hover hover:bg-leaf-700"
            >
              {t('home.ctaBtn')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}