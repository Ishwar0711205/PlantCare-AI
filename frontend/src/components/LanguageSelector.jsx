import { useEffect, useRef, useState } from 'react'
import { languageOptions } from '../data/translations'
import { useLanguage } from '../context/LanguageContext'
import { GlobeIcon, ChevronDown, CheckCircleIcon } from './icons'

export default function LanguageSelector({ variant = 'desktop' }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const current = languageOptions.find((o) => o.code === lang)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm font-medium text-leaf-800 transition-hover hover:border-leaf-400 hover:bg-leaf-50 ${
          variant === 'mobile' ? 'w-full justify-center' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <GlobeIcon size={16} />
        <span>{current?.native}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-leaf-100 bg-white p-1 shadow-lg shadow-leaf-900/5"
          role="listbox"
        >
          {languageOptions.map((opt) => (
            <li key={opt.code}>
              <button
                type="button"
                onClick={() => {
                  setLang(opt.code)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-hover hover:bg-leaf-50 ${
                  opt.code === lang ? 'font-semibold text-leaf-700' : 'text-leaf-900'
                }`}
              >
                <span>{opt.native}</span>
                {opt.code === lang && <CheckCircleIcon size={16} className="text-leaf-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}