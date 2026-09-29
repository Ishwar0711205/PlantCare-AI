import { useLanguage } from "../context/LanguageContext"
import { isHealthyKey, plantNameFromKey, conditionFromKey } from "../data/diseaseData"
import ConfidenceMeter from "./ConfidenceMeter"
import { AlertIcon, CpuIcon, ImageIcon, LeafIcon, ShieldIcon } from "./icons"

const DEFAULT_INPUT = { CNN: "128×128", EfficientNetB0: "224×224", ResNet50: "224×224", MobileNetV2: "224×224", VGG16: "224×224" }
const MODEL_ICON = { CNN: "🧠", VGG16: "🏗️", MobileNetV2: "⚡", ResNet50: "🔗", EfficientNetB0: "🏆" }

export default function PredictionResult({ result, preview, info, onZoom }) {
  const { t, lang } = useLanguage()
  const healthy = isHealthyKey(result.class)

  const plant = info?.plant || plantNameFromKey(result.class)
  const condition = info?.name?.[lang] || conditionFromKey(result.class)
  const confidencePct = result.confidence * 100
  const lowConfidence = result.confidence < 0.7
  const inputSize = result.model ? DEFAULT_INPUT[result.model] : null

  return (
    <section aria-label={t("detect.resultTitle")} className="grid items-start gap-6 lg:grid-cols-2">
      {/* ── Image preview ─────────────────────────────── */}
      <figure
        className="group overflow-hidden rounded-[2rem] border border-leaf-200 bg-white shadow-lg shadow-leaf-900/10 transition-all duration-300 hover:shadow-xl hover:shadow-leaf-900/15 hover:border-leaf-300"
        style={{ animation: "fadeUp 0.6s ease-out both" }}
      >
        <div className="relative overflow-hidden bg-leaf-50">
          <button
            type="button"
            onClick={onZoom}
            disabled={!onZoom}
            aria-label={t("detect.previewTitle")}
            className="block w-full cursor-zoom-in disabled:cursor-default"
          >
            <img
              src={preview}
              alt={t("detect.uploadedLabel")}
              className="mx-auto max-h-[24rem] w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </button>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-leaf-200/50"
          />
          <figcaption className="glass absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-leaf-800 shadow-sm">
            <ImageIcon size={14} className="text-leaf-600" />
            Input Image
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
                healthy ? "bg-emerald-100 text-emerald-800" : "bg-leaf-100 text-leaf-800"
              }`}
            >
              {confidencePct.toFixed(2)}%
            </span>
          </div>
        </div>
      </figure>

      {/* ── Result card ───────────────────────────────── */}
      <div
        className={`relative overflow-hidden rounded-[2rem] border bg-white p-7 sm:p-9 shadow-xl transition-all duration-300 ${
          healthy ? "border-emerald-200 shadow-emerald-900/10" : "border-leaf-200 shadow-leaf-900/10"
        }`}
        style={{ animation: "fadeUp 0.6s 0.1s ease-out both" }}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-32 ${
            healthy
              ? "bg-gradient-to-b from-emerald-100/60 to-transparent"
              : "bg-gradient-to-b from-leaf-100/60 to-transparent"
          }`}
        />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-leaf-600">
            {t("detect.resultTitle")}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm ${
              healthy ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" : "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950"
            }`}
            style={{ animation: "fadeIn 0.5s 0.4s ease-out both" }}
          >
            {healthy ? <LeafIcon size={14} /> : <AlertIcon size={14} />}
            {healthy ? t("detect.healthy.title") : t("detect.diseaseStatus")}
          </span>
        </div>

        {/* Predicted disease */}
        <div className="relative mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-leaf-950/50">
            {t("detect.result.predictedDisease")}
          </p>
          <h2 className={`mt-2 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${healthy ? "text-emerald-900" : "text-leaf-950"}`}>
            {healthy ? t("detect.healthy.title") : condition}
          </h2>
          <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-leaf-50 px-3 py-1.5 text-sm font-medium text-leaf-950/80">
            <span className="text-leaf-950/50">{t("detect.result.plant")}:</span>
            <span className="font-bold text-leaf-900">{plant}</span>
          </p>
        </div>

        {/* Confidence */}
        <div className="relative mt-8">
          <ConfidenceMeter confidence={result.confidence} />
        </div>

        {/* Model tags */}
        <div
          className="relative mt-8 flex flex-wrap items-center gap-2"
          style={{ animation: "fadeUp 0.5s 0.3s ease-out both" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-800 shadow-sm">
            <CpuIcon size={13} className="text-leaf-500" />
            {t("detect.result.modelUsed")}: {result.model}
          </span>
          {inputSize && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-800 shadow-sm">
              <ImageIcon size={13} className="text-leaf-500" />
              {t("detect.result.inputSize")}: {inputSize}
            </span>
          )}
        </div>

        {lowConfidence && (
          <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
            <ShieldIcon size={20} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-bold text-amber-900">{t("detect.lowTitle")}</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900/80">{t("detect.lowMsg")}</p>
              <p className="mt-2 text-sm font-medium text-amber-900/90">{t("detect.lowExpert")}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
