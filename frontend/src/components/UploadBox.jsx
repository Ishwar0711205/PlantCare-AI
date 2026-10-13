import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { CloudUploadIcon, ImageIcon, CloseIcon, RefreshIcon, AlertIcon, CameraIcon } from './icons'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg']
const ACCEPT_ATTR = '.jpg,.jpeg,.png,image/jpeg,image/png'

/**
 * Leaf uploader supporting drag-and-drop, file picking, and live camera photo capture.
 */
export default function UploadBox({ image, preview, onSelect, onClear, error, disabled = false, onZoom }) {
  const { t } = useLanguage()
  const inputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const videoRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)

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

  function openPicker(e) {
    e?.stopPropagation()
    if (disabled) return
    inputRef.current?.click()
  }

  // Camera Management
  async function startCamera(e) {
    e?.stopPropagation()
    if (disabled) return
    setLocalError('')

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Fallback to mobile native camera input
      cameraInputRef.current?.click()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      setCameraStream(stream)
      setCameraActive(true)
      setCapturedBlob(null)
    } catch (err) {
      console.warn('[PlantCare] Web camera access failed, falling back to camera input:', err)
      // Fallback to native capture input
      cameraInputRef.current?.click()
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setCameraActive(false)
    setCapturedBlob(null)
  }

  useEffect(() => {
    if (cameraActive && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch((e) => console.error(e))
    }
  }, [cameraActive, cameraStream])

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  function capturePhoto() {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        setCapturedBlob(URL.createObjectURL(blob))
        const file = new File([blob], `leaf_capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
        stopCamera()
        onSelect(file)
      },
      'image/jpeg',
      0.92,
    )
  }

  /* ── Selected state: preview ─────────────────────────────── */
  if (image && preview) {
    return (
      <div className="overflow-hidden rounded-2xl border border-leaf-200 bg-white shadow-sm shadow-leaf-900/5">
        <div className="group relative overflow-hidden">
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
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={startCamera}
              disabled={disabled}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-leaf-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-leaf-800 transition-all duration-200 hover:border-leaf-400 hover:bg-leaf-50 active:scale-[0.97] disabled:opacity-60"
            >
              <CameraIcon size={12} />
              {t('solution.cameraButton') || 'Camera'}
            </button>
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

        {/* Hidden inputs */}
        <input ref={inputRef} type="file" accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }} />
      </div>
    )
  }

  /* ── Empty state: drop zone ──────────────────────────────── */
  return (
    <>
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
        className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-10 ${
          disabled
            ? 'cursor-not-allowed border-leaf-100 bg-white/50 opacity-70'
            : dragging
              ? 'border-leaf-500 bg-leaf-50 shadow-lg shadow-leaf-500/10'
              : 'border-leaf-300 bg-white hover:border-leaf-500 hover:bg-leaf-50/40 hover:shadow-lg hover:shadow-leaf-900/5'
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
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />

        <div
          className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
            dragging ? 'bg-leaf-500 text-white' : 'bg-leaf-100 text-leaf-700 group-hover:bg-leaf-200'
          }`}
        >
          <CloudUploadIcon size={28} />
        </div>

        <p className="mt-4 font-display text-lg font-bold text-leaf-950">{t('detect.uploadTitle')}</p>
        <p className="mt-1 text-sm font-medium text-leaf-950/75">
          {dragging ? t('detect.dragActive') : t('detect.dropHere')}
        </p>

        {/* Dual Actions: Upload Image OR Camera Capture */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all sm:text-sm"
          >
            <ImageIcon size={16} />
            {t('detect.chooseImage')}
          </button>

          <button
            type="button"
            onClick={startCamera}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl border border-leaf-300 bg-white px-4 py-2.5 text-xs font-bold text-leaf-800 shadow-sm transition-all hover:border-leaf-500 hover:bg-leaf-50 sm:text-sm"
          >
            <CameraIcon size={16} className="text-leaf-600" />
            {t('solution.cameraButton') || 'Take Photo'}
          </button>
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-leaf-950/70">
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

      {/* ── Live Camera Modal Viewfinder ────────────────────────── */}
      {cameraActive && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-leaf-950/70 backdrop-blur-sm" onClick={stopCamera} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-leaf-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4">
              <h3 className="font-display text-base font-bold text-leaf-950">
                {t('solution.cameraModalTitle') || 'Capture Leaf Image'}
              </h3>
              <button
                type="button"
                onClick={stopCamera}
                className="grid h-8 w-8 place-items-center rounded-full bg-leaf-100 text-leaf-800 hover:bg-leaf-200"
              >
                <CloseIcon size={15} />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-dashed border-white/50" />
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg"
              >
                <CameraIcon size={18} />
                {t('solution.cameraCapture') || 'Capture Photo'}
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="btn-secondary rounded-2xl px-4 py-3 text-sm font-semibold"
              >
                {t('solution.cameraClose') || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function fileMeta(file) {
  const kb = (file.size / 1024).toFixed(0)
  const type = (file.type || '').replace('image/', '').toUpperCase()
  return `${file.name} · ${type} · ${kb} KB`
}
