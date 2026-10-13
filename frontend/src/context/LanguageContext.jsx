import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext(null)

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

export function formatDigits(val, lang) {
  if (val === undefined || val === null) return ''
  const str = String(val)
  if (lang === 'hi' || lang === 'mr') {
    return str.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[parseInt(d, 10)])
  }
  return str
}

const STORAGE_KEY = 'plantcare_lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const formatNum = useMemo(() => (val) => formatDigits(val, lang), [lang])

  const t = useMemo(
    () => (path, vars) => {
      const dict = translations[lang] || translations.en
      const value = path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dict)
      let text = value !== undefined ? value : path
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          const formattedV = lang === 'hi' || lang === 'mr' ? formatDigits(v, lang) : v
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), formattedV)
        })
      }
      if (lang === 'hi' || lang === 'mr') {
        text = formatDigits(text, lang)
      }
      return text
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t, formatDigits: formatNum, n: formatNum }), [lang, t, formatNum])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}