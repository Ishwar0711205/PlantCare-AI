import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { LeafIcon } from '../components/icons'

function PasswordField({ id, label, value, onChange, error, showPw, onToggle }) {
  const { t } = useLanguage()
  const inputClass =
    'w-full rounded-xl border border-leaf-200 bg-white px-4 py-3 pr-11 text-sm text-leaf-950 outline-none transition-hover placeholder:text-leaf-950/82 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200'
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-leaf-900">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPw ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder="••••••••"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-0.5 text-xs font-semibold text-leaf-600 transition-hover hover:bg-leaf-50"
          aria-label={showPw ? t('auth.hide') : t('auth.show')}
        >
          {showPw ? t('auth.hide') : t('auth.show')}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-amber-700">{error}</p>}
    </div>
  )
}

export default function Signup() {
  const { t } = useLanguage()
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = t('auth.errors.nameRequired')
    if (!email.trim()) errs.email = t('auth.errors.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t('auth.errors.invalidEmail')
    if (!password) errs.password = t('auth.errors.passwordRequired')
    else if (password.length < 6) errs.password = t('auth.errors.passwordMin')
    if (confirm !== password) errs.confirm = t('auth.errors.confirmMismatch')
    return errs
  }

  async function onSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try {
      await signup(name.trim(), email.trim(), password)
      navigate('/dashboard')
    } catch {
      setErrors({ form: t('auth.errors.accountExists') })
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm text-leaf-950 outline-none transition-hover placeholder:text-leaf-950/82 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200'

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-3xl border border-leaf-100 bg-white p-8 shadow-lg shadow-leaf-900/5 sm:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight text-leaf-950">
          {t('auth.signupTitle')}
        </h1>
        <p className="mt-1.5 text-center text-sm text-leaf-950/85">{t('auth.signupSubtitle')}</p>

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-leaf-900">
              {t('auth.name')}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Amit Kumar"
            />
            {errors.name && <p className="mt-1.5 text-xs font-medium text-amber-700">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-leaf-900">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-amber-700">{errors.email}</p>}
          </div>

          <PasswordField
            id="password"
            label={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            showPw={showPw}
            onToggle={() => setShowPw((v) => !v)}
          />

          <PasswordField
            id="confirm"
            label={t('auth.confirmPassword')}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            showPw={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />

          {errors.form && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">{errors.form}</p>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-leaf-600/30 transition-hover hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LeafIcon size={16} />
            {busy ? t('auth.creating') : t('auth.signUp')}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-leaf-950/72">{t('auth.demoNote')}</p>

        <p className="mt-3 text-center text-sm text-leaf-950/78">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-leaf-700 transition-hover hover:text-leaf-900">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}