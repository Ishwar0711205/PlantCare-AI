import { useCallback, useEffect, useRef } from 'react'
import { CloseIcon, CheckCircleIcon } from './icons'

/**
 * Centred full-size image viewer.
 *
 * The image is centred on both axes inside a flex viewport, so it stays centred
 * whatever its aspect ratio. Focus moves to the close button on open and is
 * returned to the trigger on close, and Tab is kept inside the dialog.
 */
export default function Lightbox({ open, onClose, image, title, subtitle, badge, alt }) {
  const close = useCallback(() => onClose?.(), [onClose])
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const restoreRef = useRef(null)

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        return
      }
      // Keep Tab inside the dialog while it is open.
      if (e.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    document.body.style.overflow = 'hidden'
    // Focus after the entry animation starts so the browser does not scroll.
    const id = requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      window.removeEventListener('keydown', onKey, true)
      cancelAnimationFrame(id)
      document.body.style.overflow = ''
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus()
    }
  }, [open, close])

  if (!open || !image) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Image preview'}
      className="modal-backdrop fixed inset-0 z-[100] flex items-start justify-center bg-leaf-950/60 pt-28 pb-6 px-4 sm:px-6 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        ref={panelRef}
        className="modal-card glass-dark relative flex max-h-[85vh] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] shadow-2xl shadow-black/60 ring-1 ring-white/15"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close preview"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white/30 active:scale-95"
        >
          <CloseIcon size={20} />
        </button>

        {/* Centred image stage.

            The caption is an overlay rather than a flow sibling so the image
            itself stays exactly centred. `max-h` is viewport-relative and the
            stage gets generous padding, so the photo is shown as large as the
            screen allows and is never cropped or downscaled below its natural
            size on typical desktop widths. Nothing blurs or filters the image
            itself — only the surrounding backdrop. */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black/50 p-2 sm:p-4">
          <span
            aria-hidden="true"
            className="net-dots-faint pointer-events-none absolute inset-0 opacity-30"
          />
          <img
            src={image}
            alt={alt || title || 'leaf image'}
            decoding="async"
            className="relative max-h-[75vh] w-full max-w-full cursor-zoom-out rounded-xl object-contain shadow-2xl shadow-black/60 transition-transform duration-500 ease-out hover:scale-[1.02]"
            onClick={(e) => e.stopPropagation()}
          />

          {(title || subtitle || badge) && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pb-3 pt-8 sm:px-5 sm:pb-4">
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-white sm:text-lg">{title}</p>
                {subtitle && <p className="mt-0.5 truncate text-xs text-white/85 sm:text-sm">{subtitle}</p>}
              </div>
              {badge && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-leaf-500/25 px-3 py-1 text-[11px] font-semibold text-leaf-50 ring-1 ring-inset ring-leaf-300/40 sm:px-3.5 sm:py-1.5 sm:text-xs">
                  <CheckCircleIcon size={13} />
                  {badge}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
