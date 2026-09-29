import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useData, isHealthyKey, plantNameFromKey, conditionFromKey } from '../data/diseaseData'
import { predict } from '../services/api'
import UploadBox from '../components/UploadBox'
import Lightbox from '../components/Lightbox'
import PredictionResult from '../components/PredictionResult'
import ModelSelector from '../components/ModelSelector'
import ResultSections from '../components/ResultSections'
import Reveal from '../components/Reveal'
import { addToHistory, matchInfoKey, thumbnailFor } from '../utils/history'
import { MODEL_ORDER } from '../data/projectData'
import {
  MicroscopeIcon,
  ArrowRight,
  ShieldIcon,
  CpuIcon,
  ImageIcon,
  UploadIcon,
  CheckCircleIcon,
  LeafIcon,
  BookOpenIcon,
} from '../components/icons'

const FALLBACK_MODELS = MODEL_ORDER

export default function Detection() {
  const { t } = useLanguage()
  const { data } = useData()

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [model, setModel] = useState('EfficientNetB0')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [scanStep, setScanStep] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const scanInterval = useRef(null)
  const resultRef = useRef(null)

  const scanSteps = [
    t('detect.scanSteps.step1'),
    t('detect.scanSteps.step2'),
    t('detect.scanSteps.step3'),
    t('detect.scanSteps.step4'),
  ]

  const availableModels = useMemo(() => {
    const results = data?.results
    if (!results) return FALLBACK_MODELS
    const list = FALLBACK_MODELS.filter((id) => {
      const r = results[id]
      return r && (r.status === 'Available' || r.validation_accuracy !== null)
    })
    return list.length ? list : FALLBACK_MODELS
  }, [data])

  useEffect(() => {
    if (!availableModels.includes(model)) setModel(availableModels[0])
  }, [availableModels, model])

  useEffect(() => {
    if (analyzing) {
      scanInterval.current = setInterval(() => setScanStep((s) => s + 1), 620)
      return () => clearInterval(scanInterval.current)
    }
    setScanStep(0)
  }, [analyzing])

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  function onSelect(f) {
    if (preview) URL.revokeObjectURL(preview)
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError('')
  }

  function onClear() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview('')
    setResult(null)
    setError('')
    setZoomed(false)
  }

  async function analyze() {
    if (analyzing) return
    if (!file) {
      setError(t('detect.noImageError'))
      return
    }
    setAnalyzing(true)
    setResult(null)
    setError('')
    try {
      const res = await predict(file, model)
      setResult(res)
      const infoMap = data?.info || {}
      const name = infoMap[res.class]?.name?.en || conditionFromKey(res.class)
      const thumb = await thumbnailFor(file)
      const entry = {
        date: new Date().toISOString().slice(0, 10),
        plant: infoMap[res.class]?.plant || plantNameFromKey(res.class),
        prediction: name,
        confidence: Math.round((res.confidence || 0) * 100),
        model: res.model || model,
        class: res.class,
        image: thumb,
      }
      addToHistory(entry)
      
      import('../services/api').then(api => {
        api.savePrediction({
          disease: name,
          confidence: res.confidence,
          model: res.model || model,
          date_time: new Date().toISOString(),
          image_ref: thumb ? "local_thumb" : ""
        })
      })
    } catch (e) {
      const offline = e instanceof TypeError || /failed to fetch|networkerror/i.test(e?.message || '')
      setError(offline ? t('detect.serviceDown') : t('detect.predictError'))
      console.error('[PlantCare] prediction failed:', e)
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  const infoKey = result ? matchInfoKey(result.class, data?.info || {}) : null
  const info = infoKey ? data?.info?.[infoKey] : null
  const isHealthy = result ? isHealthyKey(result.class) : false

  const steps = [
    { n: 1, label: t('detect.modelLabel'), done: Boolean(file), icon: <CpuIcon size={14} /> },
    { n: 2, label: t('detect.uploadTitle'), done: Boolean(preview), icon: <UploadIcon size={14} /> },
    { n: 3, label: t('detect.resultTitle'), done: Boolean(result), icon: <CheckCircleIcon size={14} /> },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">
          <MicroscopeIcon size={13} />
          {t('home.hero.badge')}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-leaf-950 sm:text-4xl">
          {t('detect.title')}
        </h1>
        <p className="mt-3 text-base text-leaf-950/78">{t('detect.subtitle')}</p>
      </header>

      {/* ── Stepper ────────────────────────────────────────── */}
      <ol className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                s.done
                  ? 'border-leaf-300 bg-leaf-100 text-leaf-800'
                  : 'border-leaf-100 bg-white text-leaf-950/72'
              }`}
            >
              {s.done ? <CheckCircleIcon size={13} className="text-leaf-600" /> : s.icon}
              {s.label}
            </span>
            {i < steps.length - 1 && <span aria-hidden="true" className="h-px w-5 bg-leaf-200" />}
          </li>
        ))}
      </ol>

      {/* ── Upload + models ────────────────────────────────── */}
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <UploadBox
            image={file}
            preview={preview}
            onSelect={onSelect}
            onClear={onClear}
            error={error}
            disabled={analyzing}
            onZoom={() => setZoomed(true)}
          />

          <button
            type="button"
            onClick={analyze}
            disabled={analyzing || !file}
            aria-disabled={analyzing || !file}
            className="btn-primary flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold text-white"
          >
            {analyzing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                {scanSteps[scanStep % scanSteps.length]}
              </>
            ) : (
              <>
                <MicroscopeIcon size={17} />
                {t('detect.analyze')}
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <div className="card p-4 sm:p-5">
            <ModelSelector
              models={availableModels}
              results={data?.results}
              selected={model}
              onSelect={setModel}
              disabled={analyzing || result !== null}
            />
            <p className="mt-3 text-xs leading-relaxed text-leaf-950/72">{t('detect.modelHelp')}</p>
          </div>
        </div>

        {/* ── Analysis panel ──────────────────────────────── */}
        <div className="lg:sticky lg:top-28 lg:col-span-3 self-start">
          {analyzing ? (
            <ScanPanel preview={preview} model={model} step={scanSteps[scanStep % scanSteps.length]} />
          ) : result ? (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-2xl border border-leaf-200 bg-white/70 p-10 text-center backdrop-blur-sm">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-leaf-50 text-leaf-600">
                <CheckCircleIcon size={28} />
              </div>
              <p className="mt-4 font-display text-base font-bold text-leaf-950">{t('detect.resultTitle')}</p>
              <p className="mt-1.5 text-sm text-leaf-950/85">{t('detect.details.overview')}</p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white px-4 py-2 text-xs font-semibold text-leaf-700">
                <CpuIcon size={13} />
                {result.model}
              </p>
            </div>
          ) : (
            <EmptyState
              onAnalyze={analyze}
              disabled={analyzing || !file}
              /* Only nag once the user has actually pressed Analyze — an error
                 shown on first paint reads as a broken page. */
              prompt={!file ? error : ''}
            />
          )}
        </div>
      </div>

      {/* ── Result ─────────────────────────────────────────── */}
      {result && (
        <div ref={resultRef} className="mt-12 scroll-mt-28 space-y-6">
          <Reveal>
            <PredictionResult result={result} preview={preview} info={info} onZoom={() => setZoomed(true)} />
          </Reveal>

          <Reveal delay={80}>
            <div className="card p-5 sm:p-7">
              <ResultSections info={info} result={result} />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClear}
                className="btn-secondary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                <ImageIcon size={15} />
                {t('detect.chooseAnother')}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-secondary inline-flex items-center gap-2 rounded-xl border border-leaf-200 bg-white px-5 py-2.5 text-sm font-semibold text-leaf-800 transition-hover hover:border-leaf-300 hover:bg-leaf-50"
              >
                <BookOpenIcon size={15} />
                Download PDF
              </button>
              <button
                type="button"
                onClick={analyze}
                disabled={analyzing}
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
              >
                <MicroscopeIcon size={15} />
                {t('detect.analyze')}
                <ArrowRight size={14} />
              </button>
            </div>
          </Reveal>

          {isHealthy && (
            <Reveal delay={180}>
              <p className="flex items-center justify-center gap-2 text-center text-sm text-leaf-700/75">
                <LeafIcon size={15} />
                {t('healthy.note')}
              </p>
            </Reveal>
          )}

          <Reveal delay={220}>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4">
              <ShieldIcon size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900/80">{t('footer.disclaimer')}</p>
            </div>
          </Reveal>
        </div>
      )}

      {/* Full-size view of the uploaded leaf */}
      <Lightbox
        open={zoomed}
        onClose={() => setZoomed(false)}
        image={preview}
        title={t('detect.previewTitle')}
        subtitle={file ? file.name : undefined}
        alt={t('detect.uploadedLabel')}
      />
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptyState({ onAnalyze, disabled, prompt }) {
  const { t } = useLanguage()
  return (
    <div className="relative flex h-full min-h-[24rem] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-leaf-200 bg-white/65 p-10 text-center backdrop-blur-sm transition-all duration-300 hover:border-leaf-300 hover:bg-white/85">
      <span aria-hidden="true" className="net-dots-faint pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-leaf-50 to-leaf-100 text-leaf-500 shadow-inner shadow-leaf-200">
        <LeafIcon size={34} />
      </div>
      <p className="relative mt-5 font-display text-xl font-bold text-leaf-950">{t('detect.uploadTitle')}</p>
      <p className="relative mt-2 max-w-xs text-sm text-leaf-950/85">
        {t('detect.emptyText')}
      </p>
      <p className="relative mt-1 max-w-xs text-xs text-leaf-950/82">{t('detect.supported')}</p>
      <div className="relative mt-6">
        <button
          type="button"
          disabled={disabled}
          onClick={onAnalyze}
          className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white"
        >
          <MicroscopeIcon size={17} />
          {t('detect.analyze')}
          <ArrowRight size={15} />
        </button>
      </div>
      {prompt && (
        <p role="alert" className="relative mt-3 text-xs font-medium text-amber-700/80">
          {prompt}
        </p>
      )}
    </div>
  )
}

/* ── AI scanning animation ───────────────────────────────── */
function ScanPanel({ preview, model, step }) {
  const { t } = useLanguage()
  return (
    <div className="card overflow-hidden p-6 sm:p-8">
      <div className="relative mx-auto max-h-72 overflow-hidden rounded-2xl border border-leaf-200">
        <img src={preview} alt={t('detect.uploadedLabel')} className="h-64 w-full object-cover" />
        {/* scanning line */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-leaf-400 to-transparent shadow-[0_0_18px_rgba(109,212,160,0.9)]"
          style={{ animation: 'scanTravel 1.9s ease-in-out infinite' }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-leaf-950/35 via-transparent to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-leaf-400/40"
        />

        {/* AI nodes */}
        {[
          { top: '18%', left: '22%', delay: '0s' },
          { top: '46%', left: '68%', delay: '0.5s' },
          { top: '72%', left: '38%', delay: '1s' },
        ].map((n, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute h-2 w-2 rounded-full bg-leaf-300"
            style={{ top: n.top, left: n.left, animation: `nodePing 1.8s ${n.delay} ease-out infinite` }}
          />
        ))}

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-leaf-950/70 px-3 py-1 text-[11px] font-semibold text-leaf-100 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf-300 animate-pulse" />
          {t('detect.modelLoading')}
        </span>
      </div>

      <div className="mt-7 flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-leaf-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-leaf-500 spin-slow" />
          <div className="absolute inset-2 grid place-items-center rounded-full bg-leaf-50">
            <MicroscopeIcon size={18} className="text-leaf-600" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-leaf-950" aria-live="polite">
            {step}
          </p>
          <p className="mt-1 text-xs text-leaf-950/72">
            {t('detect.result.modelUsed')}:{' '}
            <span className="font-semibold text-leaf-700">{model}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
