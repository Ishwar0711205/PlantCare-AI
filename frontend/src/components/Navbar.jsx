import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import LanguageSelector from './LanguageSelector'
import { LeafIcon, MenuIcon, CloseIcon, HistoryIcon, UserIcon } from './icons'

export default function Navbar() {
  const { t } = useLanguage()
  const { user, signout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const location = useLocation()
  const toggleRef = useRef(null)

  useEffect(() => setOpen(false), [location.pathname])

  /* Scroll state and reading progress share one rAF-throttled listener so the
     progress bar never forces a layout read on every scroll event. */
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 12)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(y / max, 1) : 0)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* Escape closes the mobile menu and hands focus back to the button that
     opened it, so keyboard users are never stranded. */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/disease-detection', label: t('nav.detect') },
    { to: '/healthy-plants', label: t('nav.healthy') },
    { to: '/disease-library', label: t('nav.library') },
    { to: '/models', label: t('nav.models') },
    { to: '/about', label: t('nav.about') },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-leaf-100 shadow-sm shadow-leaf-900/5' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          {/* Brand */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-leaf-500 to-leaf-700 text-white shadow-md shadow-leaf-700/25 transition-transform duration-300 group-hover:scale-105">
              <LeafIcon size={18} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-bold tracking-tight text-leaf-950">PlantCare AI</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-leaf-700/70">
                Deep Learning
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => {
              const active = l.to === '/' ? location.pathname === '/' : location.pathname.startsWith(l.to)
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    data-active={active}
                    aria-current={active ? 'page' : undefined}
                    className={`nav-underline relative block rounded-lg px-2.5 py-2 text-[12.5px] font-semibold transition-colors duration-200 xl:px-3 xl:text-[13px] ${
                      active ? 'text-leaf-800' : 'text-leaf-950/85 hover:text-leaf-800'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/history"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-leaf-800 transition-colors hover:border-leaf-400 hover:bg-leaf-50"
                >
                  <HistoryIcon size={14} />
                  {t('nav.history')}
                </Link>
                <button
                  type="button"
                  onClick={signout}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-leaf-950/85 transition-colors hover:text-leaf-800"
                >
                  <UserIcon size={14} />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary hidden items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold text-white lg:inline-flex"
              >
                {t('nav.login')}
              </Link>
            )}

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t('nav.menu')}
              className="grid h-10 w-10 place-items-center rounded-xl border border-leaf-200 bg-white text-leaf-800 transition-colors hover:bg-leaf-50 lg:hidden"
            >
              {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Reading-progress hairline. transform-only so it stays on the compositor. */}
      {scrolled && (
        <div aria-hidden="true" className="relative h-[2px] w-full overflow-hidden bg-leaf-100/60">
          <span
            className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-leaf-400 via-leaf-500 to-leaf-700"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="glass max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-leaf-100 lg:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {links.map((l, i) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  style={{ animation: `fadeIn 0.28s ${i * 40}ms ease-out both` }}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-leaf-100 text-leaf-800'
                        : 'text-leaf-950/88 hover:bg-leaf-50 hover:text-leaf-800'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <LanguageSelector />
            </li>
            <li>
              {user ? (
                <div className="flex gap-2">
                  <Link
                    to="/history"
                    className="flex-1 rounded-xl border border-leaf-200 bg-white px-4 py-3 text-center text-sm font-semibold text-leaf-800"
                  >
                    {t('nav.history')}
                  </Link>
                  <button
                    type="button"
                    onClick={signout}
                    className="flex-1 rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm font-semibold text-leaf-800"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary block rounded-xl px-4 py-3 text-center text-sm font-bold text-white"
                >
                  {t('nav.login')}
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
