import { useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CloudUploadIcon, ImageIcon, CloseIcon, RefreshIcon, AlertIcon } from './icons'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg']
const ACCEPT_ATTR = '.jpg,.jpeg,.png,image/jpeg,image/png'

/**
 * Drag-and-drop leaf uploader.
 *
 * The image is never submitted automatically — the user always presses
 * "Analyze Leaf" themselves. Unsupported files and oversized picks are
 * reported inline instead of failing silently.
 */
export default function UploadBox({ image, preview, onSelect, onClear, error, disabled = false, onZoom }) {
  const { t } = useLanguage()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  const message = localError || error || ''

  function handleFiles(files) {
    const file = files && files[0]
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      setLocalError(t('detect.unsupportedError') || 'Unsupported file type. Please upload a JPG or PNG.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalError('File is too large. Maximum size is 10 MB.')
      return
    }
    setLocalError('')
    onSelect(file)
  }

  function openPicker() {
    if (disabled) return
    inputRef.current?.click()
  }

  /* ── Selected state: preview ─────────────────────────────── */
  if (image && preview) {
    return (
      <div className="overflow-hidden rounded-2xl border border-leaf-200 bg-white shadow-sm shadow-leaf-900/5">
        <div className="group relative overflow-hidden">
          {/* Whole preview is the zoom trigger, so it is reachable by keyboard. */}
          <button
            type="button"
            onClick={() => !disabled && onZoom?.()}
            disabled={disabled || !onZoom}
            aria-label={t('detect.previewTitle')}
            className="block w-full cursor-zoom-in disabled:cursor-default"
          >
            <img
              src={preview}
              alt={t('detect.uploadedLabel')}
              className="mx-auto max-h-80 w-full animate-[fadeIn_0.4s_ease-out] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </button>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-leaf-200/50"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold text-leaf-800 shadow-sm backdrop-blur">
            <ImageIcon size={12} />
            {t('detect.previewTitle')}
          </span>
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-leaf-800 shadow-sm transition-all duration-200 hover:border-leaf-400 hover:bg-leaf-50 active:scale-[0.97] disabled:opacity-60"
          >
            <CloseIcon size={13} />
            {t('detect.chooseAnother')}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-leaf-100 bg-leaf-50/60 px-4 py-2.5">
          <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-leaf-700">
            <ImageIcon size={13} className="shrink-0" />
            <span className="truncate">{fileMeta(image)}</span>
          </span>
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-leaf-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-leaf-800 transition-all duration-200 hover:border-leaf-400 hover:bg-leaf-50 active:scale-[0.97] disabled:opacity-60"
          >
            <RefreshIcon size={12} />
            {t('detect.chooseImage')}
          </button>
        </div>
      </div>
    )
  }

  /* ── Empty state: drop zone ──────────────────────────────── */
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) handleFiles(e.dataTransfer.files)
      }}
      onClick={openPicker}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-9 text-center transition-all duration-300 sm:p-12 ${
        disabled
          ? 'cursor-not-allowed border-leaf-100 bg-white/50 opacity-70'
          : dragging
            ? 'border-leaf-500 bg-leaf-50 shadow-lg shadow-leaf-500/10'
            : 'border-leaf-300 bg-white hover:-translate-y-1 hover:border-leaf-500 hover:bg-leaf-50/40 hover:shadow-lg hover:shadow-leaf-900/5'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* Marching dashed inner ring — signals "drop here" without being loud */}
      {!disabled && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] text-leaf-200 opacity-0 transition-opacity duration-300 group-hover:opacity-70"
          preserveAspectRatio="none"
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="drop-dash"
          />
        </svg>
      )}

      <div
        className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
          dragging ? 'bg-leaf-500 text-white' : 'bg-leaf-100 text-leaf-700 group-hover:bg-leaf-200'
        }`}
      >
        <CloudUploadIcon size={28} />
      </div>

      <p className="mt-5 font-display text-lg font-bold text-leaf-950">{t('detect.uploadTitle')}</p>
      <p className="mt-1.5 text-sm font-medium text-leaf-950/78">
        {dragging ? t('detect.dragActive') : t('detect.dropHere')}
      </p>

      <div className="mt-3.5 flex items-center justify-center gap-3 text-xs text-leaf-950/82">
        <span className="h-px w-8 bg-leaf-200" />
        {t('detect.or')}
        <span className="h-px w-8 bg-leaf-200" />
      </div>

      <span className="btn-primary mt-3 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white">
        <ImageIcon size={16} />
        {t('detect.chooseImage')}
      </span>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-leaf-950/82">
        {t('detect.supported')}
      </p>

      {message && (
        <p
          role="alert"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-800"
        >
          <AlertIcon size={15} className="shrink-0" />
          {message}
        </p>
      )}
    </div>
  )
}

function fileMeta(file) {
  const kb = (file.size / 1024).toFixed(0)
  const type = (file.type || '').replace('image/', '').toUpperCase()
  return `${file.name} · ${type} · ${kb} KB`
}
