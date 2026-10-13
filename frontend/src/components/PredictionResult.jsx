import { useLanguage } from '../context/LanguageContext'
import { isHealthyKey, plantNameFromKey, conditionFromKey, useData } from '../data/diseaseData'
import { getPlantDisplayName } from '../data/plants'
import ConfidenceMeter from './ConfidenceMeter'
import { AlertIcon, CpuIcon, ImageIcon, LeafIcon, ShieldIcon, CheckCircleIcon } from './icons'

const DEFAULT_INPUT = {
  CNN: '128×128',
  EfficientNetB0: '224×224',
  ResNet50: '224×224',
  MobileNetV2: '224×224',
  VGG16: '224×224',
}
const MODEL_ICON = { CNN: '🧠', VGG16: '🏗️', MobileNetV2: '⚡', ResNet50: '🔗', EfficientNetB0: '🏆' }

export default function PredictionResult({ result, preview, info, onZoom }) {
  const { t, lang, n } = useLanguage()
  const { data } = useData()
  const allInfo = data?.info || {}

  const healthy = isHealthyKey(result.class)
  const rawPlant = info?.plant || plantNameFromKey(result.class)
  const localizedPlant = getPlantDisplayName(rawPlant, lang)
  const condition = info?.name?.[lang] || info?.name?.en || conditionFromKey(result.class)
  const confidencePct = (result.confidence || 0) * 100
  const lowConfidence = (result.confidence || 0) < 0.7
  const inputSize = result.model ? n(DEFAULT_INPUT[result.model]) : null

  // Ensure top-5 predictions are available
  const top5 = Array.isArray(result.top5) && result.top5.length > 0 ? result.top5 : [
    { class: result.class, confidence: result.confidence },
  ]

  return (
    <section aria-label={t('detect.resultTitle')} className="space-y-6">
      {/* ── Main Prediction Overview Card ──────────────────── */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Uploaded leaf photo figure */}
        <figure
          className="group overflow-hidden rounded-[2rem] border border-leaf-200 bg-white shadow-lg shadow-leaf-900/10 transition-all duration-300 hover:border-leaf-300 hover:shadow-xl hover:shadow-leaf-900/15"
          style={{ animation: 'fadeUp 0.6s ease-out both' }}
        >
          <div className="relative overflow-hidden bg-leaf-50">
            <button
              type="button"
              onClick={onZoom}
              disabled={!onZoom}
              aria-label={t('detect.previewTitle')}
              className="block w-full cursor-zoom-in disabled:cursor-default"
            >
              <img
                src={preview}
                alt={t('detect.uploadedLabel')}
                className="mx-auto max-h-[24rem] w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </button>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-leaf-200/50"
            />
            <figcaption className="glass absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-leaf-800 shadow-sm">
              <ImageIcon size={14} className="text-leaf-600" />
              {t('detect.uploadedLabel') || 'Input Leaf'}
            </figcaption>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-leaf-100 bg-gradient-to-r from-white to-leaf-50 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-leaf-100 text-lg shadow-inner">
                {MODEL_ICON[result.model] || <CpuIcon size={16} className="text-leaf-600" />}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-leaf-950">{result.model}</p>
                {inputSize && <p className="text-[11px] font-medium text-leaf-950/50">{inputSize}</p>}
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold shadow-sm ${
                  healthy ? 'bg-emerald-100 text-emerald-800' : 'bg-leaf-100 text-leaf-800'
                }`}
              >
                {n(confidencePct.toFixed(1))}% {t('detect.result.confidence')}
              </span>
            </div>
          </div>
        </figure>

        {/* Prediction summary card */}
        <div
          className={`relative overflow-hidden rounded-[2rem] border bg-white p-7 shadow-xl transition-all duration-300 sm:p-9 ${
            healthy ? 'border-emerald-200 shadow-emerald-900/10' : 'border-leaf-200 shadow-leaf-900/10'
          }`}
          style={{ animation: 'fadeUp 0.6s 0.1s ease-out both' }}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 h-32 ${
              healthy
                ? 'bg-gradient-to-b from-emerald-100/60 to-transparent'
                : 'bg-gradient-to-b from-leaf-100/60 to-transparent'
            }`}
          />

          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-leaf-600">
              {t('detect.resultTitle')}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm ${
                healthy
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950'
              }`}
            >
              {healthy ? <LeafIcon size={14} /> : <AlertIcon size={14} />}
              {healthy ? (t('solution.healthyBadge') || 'Healthy Crop') : t('detect.diseaseStatus')}
            </span>
          </div>

          {/* Predicted disease name */}
          <div className="relative mt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-leaf-950/60">
              {t('detect.result.predictedDisease')}
            </p>
            <h2
              className={`mt-1 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl ${
                healthy ? 'text-emerald-950' : 'text-leaf-950'
              }`}
            >
              {healthy ? (t('solution.healthyTitle') || 'Healthy Plant Detected') : condition}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-50 px-3 py-1.5 text-sm font-semibold text-leaf-900">
                <span className="text-leaf-950/50">{t('detect.result.plant')}:</span>
                <span className="font-bold text-leaf-900">{localizedPlant}</span>
              </span>
              {info?.severity && (
                <span className="rounded-lg border border-leaf-200 bg-white px-2.5 py-1 text-xs font-semibold text-leaf-700">
                  {t('gallery.severity')}: {info.severity}
                </span>
              )}
            </div>
          </div>

          {/* Confidence bar meter */}
          <div className="relative mt-6">
            <ConfidenceMeter confidence={result.confidence || 0} />
          </div>

          {/* Model info tags */}
          <div className="relative mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-800 shadow-sm">
              <CpuIcon size={13} className="text-leaf-500" />
              {t('detect.result.modelUsed')}: {result.model}
            </span>
            {inputSize && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-800 shadow-sm">
                <ImageIcon size={13} className="text-leaf-500" />
                {t('detect.result.inputSize')}: {inputSize}
              </span>
            )}
          </div>

          {/* Low Confidence Warning (Prompt Requirement: if confidence is low, show understandable warning & suggest clearer image) */}
          {lowConfidence && (
            <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm">
              <ShieldIcon size={22} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {t('solution.lowConfidenceTitle') || 'Low Confidence Warning — Diagnosis Uncertain'}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-950/85 sm:text-sm">
                  {t('solution.lowConfidenceMsg') ||
                    'The model confidence is below 70%. The leaf might be blurry, poorly lit, or have symptoms outside standard classes.'}
                </p>
                <p className="mt-2 text-xs font-semibold text-amber-900 sm:text-sm">
                  💡 {t('solution.lowConfidenceTip') ||
                    'Please upload a clearer, well-lit photograph of a single affected leaf, or consult a local agricultural expert.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Top-5 Predictions Breakdown Section ──────────────── */}
      {top5.length > 0 && (
        <div className="rounded-3xl border border-leaf-200/90 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-leaf-100 pb-4">
            <div>
              <h3 className="font-display text-base font-bold text-leaf-950 sm:text-lg">
                {t('solution.top5Title') || 'Top-5 Model Predictions'}
              </h3>
              <p className="mt-0.5 text-xs text-leaf-950/70 sm:text-sm">
                {t('solution.top5Subtitle') ||
                  'Confidence distribution across diagnostic candidates evaluated by the model'}
              </p>
            </div>
            <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-700">
              {top5.length} {t('detect.result.predictedDisease')}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {top5.map((candidate, idx) => {
              const candInfo = allInfo[candidate.class] || {}
              const candHealthy = isHealthyKey(candidate.class)
              const candPlant = getPlantDisplayName(candInfo.plant || plantNameFromKey(candidate.class), lang)
              const candName = candInfo.name?.[lang] || candInfo.name?.en || conditionFromKey(candidate.class)
              const pct = (candidate.confidence * 100).toFixed(1)
              const isTop = idx === 0

              return (
                <div
                  key={candidate.class}
                  className={`rounded-2xl border p-3.5 transition-all sm:p-4 ${
                    isTop
                      ? 'border-leaf-400 bg-leaf-50/70 shadow-sm'
                      : 'border-leaf-100 bg-white hover:bg-leaf-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          isTop
                            ? 'bg-leaf-600 text-white'
                            : 'bg-leaf-100 text-leaf-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-leaf-950">{candPlant}</span>
                        <span className="text-leaf-950/50"> — </span>
                        <span className={isTop ? 'font-bold text-leaf-900' : 'text-leaf-900'}>
                          {candName}
                        </span>
                        {candHealthy && (
                          <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            {t('gallery.healthy')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isTop && (
                        <span className="hidden sm:inline-block rounded-full bg-leaf-200 px-2.5 py-0.5 text-[10px] font-bold text-leaf-800 uppercase tracking-wide">
                          {t('solution.top1Badge') || 'Top Match'}
                        </span>
                      )}
                      <span className="font-display font-bold text-leaf-950 text-xs sm:text-sm">
                        {n(pct)}%
                      </span>
                    </div>
                  </div>

                  {/* Visual probability bar */}
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-leaf-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isTop
                          ? 'bg-gradient-to-r from-leaf-500 to-leaf-700'
                          : 'bg-leaf-400/60'
                      }`}
                      style={{ width: `${Math.max(Number(pct), 2)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
