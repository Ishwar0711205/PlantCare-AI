import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, signup as apiSignup } from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'plantcare_user'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const signin = async (email, password) => {
    const result = await apiLogin(email, password)
    setUser({ email, name: result.name || email.split('@')[0], token: result.token })
    return result
  }

  const signup = async (name, email, password) => {
    const result = await apiSignup(name, email, password)
    setUser({ email, name, token: result.token })
    return result
  }

  const signout = () => setUser(null)

  const value = useMemo(() => ({ user, signin, signup, signout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}